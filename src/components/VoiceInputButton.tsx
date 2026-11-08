import { useState, useEffect, useRef } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface VoiceInputButtonProps {
  onTranscript: (text: string) => void;
  className?: string;
}

export function VoiceInputButton({ onTranscript, className = '' }: VoiceInputButtonProps) {
  const { i18n } = useTranslation();
  const [isListening, setIsListening] = useState(false);
  const [supported] = useState(() => {
    return typeof window !== 'undefined' &&
      !!((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);
  });
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (!supported) return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    const recognizer = new SpeechRecognition();
    recognizer.continuous = false;
    recognizer.interimResults = false;

    const langCode = i18n.language?.split('-')[0] || 'en';
    const langMap: Record<string, string> = {
      te: 'te-IN',
      hi: 'hi-IN',
      en: 'en-IN',
    };
    recognizer.lang = langMap[langCode] || 'en-IN';

    recognizer.onresult = (event: any) => {
      const transcript = event.results[0]?.[0]?.transcript;
      if (transcript) {
        onTranscript(transcript);
      }
      setIsListening(false);
    };

    recognizer.onerror = () => {
      setIsListening(false);
    };

    recognizer.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognizer;

    return () => {
      try {
        recognizer.abort();
      } catch {}
    };
  }, [i18n.language, onTranscript, supported]);

  const toggleListening = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const recognizer = recognitionRef.current;
    if (!recognizer) return;

    if (isListening) {
      recognizer.stop();
      setIsListening(false);
    } else {
      try {
        const langCode = i18n.language?.split('-')[0] || 'en';
        const langMap: Record<string, string> = {
          te: 'te-IN',
          hi: 'hi-IN',
          en: 'en-IN',
        };
        recognizer.lang = langMap[langCode] || 'en-IN';
        recognizer.start();
        setIsListening(true);
      } catch {
        setIsListening(false);
      }
    }
  };

  if (!supported) return null;

  return (
    <button
      type="button"
      onClick={toggleListening}
      aria-label={isListening ? 'Stop listening' : 'Speak your request'}
      title={isListening ? 'Stop recording' : 'Speak in your language'}
      className={`p-2.5 rounded-xl border transition-all flex items-center justify-center ${
        isListening
          ? 'bg-red-500 text-white border-red-500 animate-pulse ring-4 ring-red-500/20'
          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:text-emerald-600 hover:border-emerald-500'
      } ${className}`}
    >
      {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
    </button>
  );
}
