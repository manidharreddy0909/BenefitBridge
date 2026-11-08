import { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ReadAloudButtonProps {
  text: string;
  className?: string;
  title?: string;
}

/** Maps i18n language code → BCP-47 locale for SpeechSynthesis */
const LANG_MAP: Record<string, string> = {
  te: 'te-IN',
  hi: 'hi-IN',
  en: 'en-IN',
};

/** Button labels in each language so the UI itself is localized */
const LABELS: Record<string, { listen: string; stop: string }> = {
  te: { listen: 'వినండి', stop: 'ఆపు' },
  hi: { listen: 'सुनें', stop: 'रोकें' },
  en: { listen: 'Listen', stop: 'Stop' },
};

/**
 * ReadAloudButton — plays any text via the Web Speech Synthesis API.
 * Supports English, Telugu (te-IN), and Hindi (hi-IN).
 * The button label auto-switches to match the active UI language.
 */
export function ReadAloudButton({ text, className = '', title }: ReadAloudButtonProps) {
  const { i18n } = useTranslation();
  const [speaking, setSpeaking] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const [supported] = useState(
    () => typeof window !== 'undefined' && 'speechSynthesis' in window,
  );

  // When language changes mid-speech, stop current utterance
  useEffect(() => {
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n.language]);

  const getLangCode = () => (i18n.language?.split('-')[0] || 'en') as string;

  const getBestVoice = (langCode: string): SpeechSynthesisVoice | undefined => {
    const bcp47 = LANG_MAP[langCode] || 'en-IN';
    const voices = window.speechSynthesis.getVoices();
    // Prefer exact match, then prefix match, then anything
    return (
      voices.find(v => v.lang === bcp47) ||
      voices.find(v => v.lang.startsWith(langCode)) ||
      undefined
    );
  };

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!supported) return;

    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();

    const langCode = getLangCode();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = LANG_MAP[langCode] || 'en-IN';
    utterance.rate = 0.85; // Slower pace for low-literacy users
    utterance.pitch = 1.0;

    // Try to attach a matching voice; some browsers need voices loaded first
    const trySetVoice = () => {
      const voice = getBestVoice(langCode);
      if (voice) utterance.voice = voice;
    };

    trySetVoice();

    // Fallback: voices may not be ready yet (especially on first load)
    if (!utterance.voice) {
      window.speechSynthesis.onvoiceschanged = () => {
        trySetVoice();
        window.speechSynthesis.onvoiceschanged = null;
      };
    }

    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);

    utteranceRef.current = utterance;
    setSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  if (!supported) return null;

  const langCode = getLangCode();
  const labels = LABELS[langCode] || LABELS['en'];

  return (
    <button
      type="button"
      onClick={handleToggle}
      title={title || (speaking ? labels.stop : labels.listen)}
      aria-label={speaking ? labels.stop : labels.listen}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${
        speaking
          ? 'bg-emerald-600 text-white border-emerald-600 animate-pulse'
          : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-emerald-500 hover:text-emerald-600'
      } ${className}`}
    >
      {speaking ? (
        <>
          <VolumeX className="w-3.5 h-3.5" />
          <span>{labels.stop}</span>
        </>
      ) : (
        <>
          <Volume2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>{labels.listen}</span>
        </>
      )}
    </button>
  );
}
