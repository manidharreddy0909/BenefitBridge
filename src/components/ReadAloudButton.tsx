import { useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ReadAloudButtonProps {
  text: string;
  className?: string;
  title?: string;
}

export function ReadAloudButton({ text, className = '', title }: ReadAloudButtonProps) {
  const { i18n } = useTranslation();
  const [speaking, setSpeaking] = useState(false);
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    setSupported(typeof window !== 'undefined' && 'speechSynthesis' in window);
  }, []);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!supported) return;

    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel(); // Stop any ongoing speech
    const utterance = new SpeechSynthesisUtterance(text);

    const langCode = i18n.language?.split('-')[0] || 'en';
    const langMap: Record<string, string> = {
      te: 'te-IN',
      hi: 'hi-IN',
      en: 'en-IN',
    };
    utterance.lang = langMap[langCode] || 'en-IN';
    utterance.rate = 0.9; // Slightly slower, clear pace for rural / low-literacy users

    // Try finding matching voice
    const voices = window.speechSynthesis.getVoices();
    const matchingVoice = voices.find(v => v.lang.startsWith(langCode));
    if (matchingVoice) {
      utterance.voice = matchingVoice;
    }

    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);

    setSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  if (!supported) return null;

  return (
    <button
      type="button"
      onClick={handleToggle}
      title={title || (speaking ? 'Stop read aloud' : 'Read aloud')}
      aria-label={speaking ? 'Stop read aloud' : 'Read aloud'}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${
        speaking
          ? 'bg-emerald-600 text-white border-emerald-600 animate-pulse'
          : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-emerald-500 hover:text-emerald-600'
      } ${className}`}
    >
      {speaking ? (
        <>
          <VolumeX className="w-3.5 h-3.5" />
          <span>Stop</span>
        </>
      ) : (
        <>
          <Volume2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>Listen</span>
        </>
      )}
    </button>
  );
}
