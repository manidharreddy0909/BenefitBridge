import { GoogleGenerativeAI } from '@google/generative-ai';
import { TOOLS, executeTool } from './tools';
import type { AgentSession, AgentAction, AgentRun } from '../../types/agent';
import { updateAgentSession, addAgentAction, createAgentRun } from '../agentMemory';

const SYSTEM_INSTRUCTION = `You are the BenefitBridge Autonomous Case Manager. You help Indian citizens find, track, apply, and renew government benefit schemes and scholarships.
Always execute real tools to fetch data before answering. Do NOT guess or hallucinate.
Available tools: get_user_profile, find_benefits, check_eligibility, check_documents, list_applications, create_application, record_external_submission, list_pending_tasks, check_deadlines, get_renewals, get_next_best_action.
Never fabricate reference numbers, deadlines, or approval statuses. Be concise, clear, helpful, and empathetic. Answer EXACTLY what the user asks based on the tool data.
Always cite the official source for any scheme information. Always advise the user to confirm details at the official website or their nearest CSC / Gram Panchayat office before taking action.
CRITICAL: NEVER output raw JSON, tool response objects, or code blocks in your final message. Always translate the tool data into natural, human-readable conversational text.`;

/**
 * Returns the Gemini API key for use with GoogleGenerativeAI.
 * In development: reads from VITE_GEMINI_API_KEY (local .env.local only).
 * In production: the key must be set in Firebase Functions config (server-side only).
 * Never ship VITE_GEMINI_API_KEY in a production build.
 */
async function resolveApiKey(): Promise<string | null> {
  const devKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (devKey && devKey.length > 10) return devKey;
  // In production, the key is server-side only. The user must have the Cloud Function deployed.
  return null;
}

export class AgentOrchestrator {
  private uid: string;
  private session: AgentSession;

  constructor(uid: string, session: AgentSession) {
    this.uid = uid;
    this.session = session;
  }

  public setSession(session: AgentSession) {
    this.session = session;
  }

  private async logAction(type: AgentAction['type'], content: string, toolCall?: AgentAction['toolCall'], role?: 'USER' | 'AGENT') {
    const action: AgentAction = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      type,
      content,
    };
    if (role) {
      action.role = role;
    }
    if (toolCall) {
      action.toolCall = toolCall;
    }
    
    // Clean up any stray undefined properties just in case
    const cleanAction = JSON.parse(JSON.stringify(action));
    
    await addAgentAction(this.uid, cleanAction, this.session.history);
    this.session.history.push(cleanAction);
  }

  async run(userInput: string): Promise<void> {
    try {
      await updateAgentSession(this.uid, { status: 'EXECUTING' });
      this.session.status = 'EXECUTING';
      await this.logAction('MESSAGE', userInput, undefined, 'USER');

      let run: AgentRun;
      try {
        run = await createAgentRun(this.uid, userInput);
        await updateAgentSession(this.uid, { currentRunId: run.id });
      } catch (e) {
        console.warn('Run creation note:', e);
      }

      try {
        const apiKey = await resolveApiKey();
        
        if (!apiKey) {
          await this.logAction('ERROR', "AI Engine Offline: No API key configured. In development, add VITE_GEMINI_API_KEY to .env.local. In production, deploy the geminiProxy Cloud Function with the key set via: firebase functions:config:set gemini.api_key=\"YOUR_KEY\"");
          await updateAgentSession(this.uid, { status: 'IDLE' });
          this.session.status = 'IDLE';
          return;
        }

        // Dynamically find a supported model
        let selectedModel = 'gemini-1.5-flash';
        try {
          const modelsRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
          const modelsData = await modelsRes.json();
          const availableModels = modelsData.models
            ?.filter((m: any) => m.supportedGenerationMethods.includes('generateContent'))
            ?.map((m: any) => m.name.replace('models/', '')) || ['gemini-1.5-flash'];
          
          if (!availableModels.includes(selectedModel) && availableModels.length > 0) {
            selectedModel = availableModels[0];
          }
        } catch (_) { /* ignore model listing errors */ }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
          model: selectedModel,
          tools: [{ functionDeclarations: TOOLS as any }],
        });

        const chat = model.startChat({
          systemInstruction: { role: 'system', parts: [{ text: SYSTEM_INSTRUCTION }] },
        });

        let prompt = `User query: "${userInput}". Use available tools to answer accurately based on real user data. Do not hallucinate.`;
        let result = await chat.sendMessage(prompt);
        let calls = result.response.functionCalls();
        let text = result.response.text();

        let iterations = 0;
        while (calls && calls.length > 0 && iterations < 15) {
          const functionResponses = await Promise.all(
            calls.map(async (call) => {
              await this.logAction('TOOL_CALL', `Executing ${call.name}`, { name: call.name, args: call.args });
              let toolResult;
              try {
                toolResult = await executeTool(call.name, call.args, this.uid);
              } catch (toolErr: any) {
                console.error(`Tool ${call.name} failed:`, toolErr);
                toolResult = { error: toolErr.message || 'Tool execution failed' };
              }

              const safeResponse = (typeof toolResult === 'object' && toolResult !== null && !Array.isArray(toolResult))
                ? toolResult
                : { result: toolResult };

              return {
                functionResponse: {
                  name: call.name,
                  response: safeResponse,
                },
              };
            })
          );

          result = await chat.sendMessage(functionResponses);
          calls = result.response.functionCalls();
          text = result.response.text();
          iterations++;
        }

        if (text) {
          let cleanText = text.replace(/\{"check_eligibility_response"\s*:\s*\{.*?\}\}/gs, '');
          cleanText = cleanText.replace(/\{"result"\s*:\s*\[.*?\]\}/gs, '');
          cleanText = cleanText.replace(/```json\s*.*?\s*```/gs, '');
          cleanText = cleanText.trim();
          
          await this.logAction('MESSAGE', cleanText || "I have analyzed your eligibility.", undefined, 'AGENT');
        } else {
          await this.logAction('ERROR', "I couldn't generate a clear response. Please try rephrasing your request.", undefined, 'AGENT');
        }
      } catch (geminiError: any) {
        let errorMessage = geminiError.message || 'AI service error. Please try again.';
        
        if (errorMessage.includes('429') || errorMessage.toLowerCase().includes('quota')) {
          const delayMatch = errorMessage.match(/retryDelay.*?(\d+)s/);
          const waitTime = delayMatch ? delayMatch[1] + ' seconds' : 'a minute';
          await this.logAction('ERROR', `Google AI Rate Limit Reached! Please wait ${waitTime} before trying again.`);
        } else if (errorMessage.includes('sign in') || errorMessage.includes('ID token')) {
          await this.logAction('ERROR', 'Please sign in to use the AI assistant.');
        } else {
          await this.logAction('ERROR', `AI Engine Error: ${errorMessage}`);
        }
      }

      await updateAgentSession(this.uid, { status: 'IDLE' });
      this.session.status = 'IDLE';

    } catch (error: any) {
      console.error("Agent Loop Error:", error);
      await this.logAction('ERROR', `Error processing request: ${error.message || 'Please try again.'}`);
      await updateAgentSession(this.uid, { status: 'IDLE' });
      this.session.status = 'IDLE';
    }
  }
}
