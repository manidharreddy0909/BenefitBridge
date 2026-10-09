import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';
import { SUPPORTED_LANGUAGES, setStoredLanguage, type SupportedLang } from '../i18n';
import { useAuth } from '../contexts/AuthContext';
import { updateUserProfile } from '../services/userService';

interface LanguageSwitcherProps {
  className?: string;
  variant?: 'compact' | 'full';
}

export function LanguageSwitcher({ className = '', variant = 'compact' }: LanguageSwitcherProps) {
  const { i18n } = useTranslation();
  const { user } = useAuth();
  const currentLang = (i18n.language?.split('-')[0] || 'en') as SupportedLang;

  const handleLanguageChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value as SupportedLang;
    await i18n.changeLanguage(newLang);
    setStoredLanguage(newLang);
    document.documentElement.lang = newLang;

    if (user) {
      try {
        await updateUserProfile(user.uid, { preferredLanguage: newLang });
      } catch {
        // silent fail - local storage and i18n are already updated
      }
    }
  };

  return (
    <div className={`relative inline-flex items-center ${className}`}>
      <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
        <Globe className="w-3.5 h-3.5" />
      </div>
      <select
        value={currentLang}
        onChange={handleLanguageChange}
        aria-label="Select Language"
        className="pl-7 pr-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:border-emerald-500 transition-colors focus:outline-none focus:ring-1 focus:ring-emerald-500 appearance-none cursor-pointer shadow-sm dark:shadow-none"
      >
        {SUPPORTED_LANGUAGES.map((lang) => (
          <option key={lang.code} value={lang.code} className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100">
            {variant === 'compact' ? lang.nativeLabel : `${lang.nativeLabel} (${lang.label})`}
          </option>
        ))}
      </select>
    </div>
  );
}
