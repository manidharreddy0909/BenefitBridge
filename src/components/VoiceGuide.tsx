import { useState, useEffect } from "react";
import { HelpCircle, X, Volume2, VolumeX } from "lucide-react";
import { useTranslation } from "react-i18next";

const GUIDANCE: Record<string, { title: string; steps: string[]; audioScript: string }> = {
  en: {
    title: "How to use BenefitBridge",
    steps: [
      "1. Go to Opportunities to see government schemes you are eligible for.",
      "2. Tap Apply Now to start your application.",
      "3. Go to Tasks to see what documents or steps are pending.",
      "4. Upload your documents using the Document Vault.",
      "5. Your AI agent tracks everything and reminds you of deadlines.",
    ],
    audioScript:
      "Welcome to BenefitBridge. " +
      "This app helps you find and apply for government schemes. " +
      "First, go to Opportunities to see which schemes you qualify for. " +
      "Then tap Apply Now to start. " +
      "Check the Tasks page to know what documents are needed. " +
      "Upload your papers in the Document Vault. " +
      "Your AI agent will remind you of important deadlines. " +
      "Government schemes are free to apply. Do not pay anyone.",
  },
  te: {
    title: "BenefitBridge ఎలా ఉపయోగించాలి",
    steps: [
      "1. పథకాల పేజీకి వెళ్ళండి — మీకు అర్హత ఉన్న ప్రభుత్వ పథకాలు చూడండి.",
      "2. 'ఇప్పుడే దరఖాస్తు చేయి' బటన్ నొక్కండి.",
      "3. పనుల పేజీలో పెండింగ్ పనులు మరియు పత్రాలు చూడండి.",
      "4. డాక్యుమెంట్ వాల్ట్‌లో మీ సర్టిఫికెట్లు అప్‌లోడ్ చేయండి.",
      "5. AI ఏజెంట్ అన్నింటినీ ట్రాక్ చేసి గడువు తేదీలను గుర్తుచేస్తుంది.",
    ],
    audioScript:
      "నమస్కారం! బెనిఫిట్ బ్రిడ్జ్ కు స్వాగతం. " +
      "ఈ యాప్ ద్వారా మీకు అర్హమైన ప్రభుత్వ సంక్షేమ పథకాలు మరియు స్కాలర్‌షిప్‌లను సులభంగా కనుగొనవచ్చు. " +
      "మొదట పథకాల పేజీకి వెళ్లి మీకు అర్హత ఉన్న పథకాలను తనిఖీ చేయండి. " +
      "ఆ తర్వాత ఇప్పుడే దరఖాస్తు చేయి పై నొక్కి దరఖాస్తును ప్రారంభించండి. " +
      "పనుల పేజీలో ఏయే పత్రాలు అవసరమో చూసి వాల్ట్ లో అప్‌లోడ్ చేయండి. " +
      "ప్రభుత్వ పథకాలకు దరఖాస్తు చేయడం పూర్తిగా ఉచితం. ఎవరికీ డబ్బులు చెల్లించవద్దు.",
  },
  hi: {
    title: "BenefitBridge का उपयोग कैसे करें",
    steps: [
      "1. योजनाएं पेज पर जाएं — अपने लिए उपयुक्त सरकारी योजनाएं देखें।",
      "2. 'अभी आवेदन करें' बटन दबाकर आवेदन शुरू करें।",
      "3. काम पेज पर जाकर आवश्यक दस्तावेज़ और चरण देखें।",
      "4. डॉक्यूमेंट वॉल्ट में अपने कागज़ात अपलोड करें।",
      "5. आपका AI एजेंट सब कुछ ट्रैक करेगा और समय-सीमा याद दिलाएगा।",
    ],
    audioScript:
      "नमस्ते! बेनिफिट ब्रिज में आपका स्वागत है। " +
      "यह ऐप आपको सही सरकारी योजनाएं और छात्रवृत्तियां खोजने और आवेदन करने में मदद करता है। " +
      "सबसे पहले योजनाएं पेज पर जाएं और अपनी पात्रता देखें। " +
      "फिर अभी आवेदन करें पर क्लिक करें। " +
      "काम पेज पर आवश्यक दस्तावेज़ देखें और वॉल्ट में अपलोड करें। " +
      "सरकारी योजनाओं के लिए आवेदन पूरी तरह से निःशुल्क है। किसी को पैसे न दें.",
  },
};

const LANG_MAP: Record<string, string> = { te: "te-IN", hi: "hi-IN", en: "en-IN" };
const BUTTON_LABELS: Record<string, { help: string; close: string; listen: string; stop: string; disclaimer: string }> = {
  te: {
    help: "సహాయం",
    close: "మూసివేయి",
    listen: "ఆడియో వినండి",
    stop: "ఆపు",
    disclaimer: "ప్రభుత్వ పథకాలకు దరఖాస్తు ఉచితం. ఎవరికీ డబ్బు ఇవ్వవద్దు."
  },
  hi: {
    help: "सहायता",
    close: "बंद करें",
    listen: "ऑडियो सुनें",
    stop: "रोकें",
    disclaimer: "सरकारी योजनाओं में आवेदन निःशुल्क है। किसी को पैसे न दें।"
  },
  en: {
    help: "Help Guide",
    close: "Close",
    listen: "Listen Guide",
    stop: "Stop Audio",
    disclaimer: "Government schemes are free to apply. Do not pay anyone."
  },
};

export function VoiceGuide() {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [supported] = useState(
    () => typeof window !== "undefined" && "speechSynthesis" in window
  );

  const langCode = (i18n.language?.split("-")[0] || "en") as string;
  const guide = GUIDANCE[langCode] || GUIDANCE["en"];
  const labels = BUTTON_LABELS[langCode] || BUTTON_LABELS["en"];

  useEffect(() => {
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, i18n.language]);

  const getBestVoice = (): SpeechSynthesisVoice | undefined => {
    const bcp47 = LANG_MAP[langCode] || "en-IN";
    const voices = window.speechSynthesis.getVoices();
    return (
      voices.find((v) => v.lang === bcp47) ||
      voices.find((v) => v.lang.startsWith(langCode)) ||
      undefined
    );
  };

  const handlePlayGuide = () => {
    if (!supported) return;
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(guide.audioScript);
    utterance.lang = LANG_MAP[langCode] || "en-IN";
    utterance.rate = 0.82;
    utterance.pitch = 1.05;
    const trySetVoice = () => {
      const voice = getBestVoice();
      if (voice) utterance.voice = voice;
    };
    trySetVoice();
    if (!utterance.voice) {
      window.speechSynthesis.onvoiceschanged = () => {
        trySetVoice();
        window.speechSynthesis.onvoiceschanged = null;
      };
    }
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    setSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <>
      <button
        type="button"
        id="voice-guide-btn"
        onClick={() => setOpen((o) => !o)}
        aria-label={labels.help}
        title={labels.help}
        className="fixed bottom-20 right-4 z-50 flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg transition-all text-sm font-semibold"
      >
        <HelpCircle className="w-4 h-4" />
        <span className="hidden sm:inline">{labels.help}</span>
      </button>

      {open && (
        <div
          className="fixed bottom-36 right-4 z-50 w-80 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden"
          role="dialog"
          aria-modal="true"
          aria-label={guide.title}
        >
          <div className="flex items-center justify-between px-4 py-3 bg-emerald-600 text-white">
            <span className="font-bold text-sm">{guide.title}</span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label={labels.close}
              className="p-1 rounded-lg hover:bg-emerald-700 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <ol className="px-4 py-3 space-y-2">
            {guide.steps.map((step, i) => (
              <li
                key={i}
                className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed"
              >
                {step}
              </li>
            ))}
          </ol>

          {supported && (
            <div className="px-4 pb-4">
              <button
                type="button"
                id="voice-guide-listen-btn"
                onClick={handlePlayGuide}
                className={
                  speaking
                    ? "w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold bg-red-500 text-white animate-pulse"
                    : "w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700 hover:bg-emerald-100"
                }
              >
                {speaking ? (
                  <>
                    <VolumeX className="w-4 h-4" />
                    <span>{labels.stop}</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-4 h-4" />
                    <span>{labels.listen}</span>
                  </>
                )}
              </button>
            </div>
          )}

          <p className="text-xs text-slate-400 dark:text-slate-500 px-4 pb-3 leading-relaxed">
            {labels.disclaimer}
          </p>
        </div>
      )}
    </>
  );
}