/**
 * i18n Configuration — BenefitBridge
 *
 * Languages: English (en, default), Telugu (te), Hindi (hi).
 * To add a new language: add a JSON file to src/i18n/locales/<code>.json
 * and import it in the resources object below.
 *
 * Translation style rules:
 * - Use simple, spoken, everyday language.
 * - Keep official names as-is: PM-KISAN, Aadhaar, PAN, ₹ amounts, dates, URLs.
 * - Short sentences, one idea each.
 * - Mark unreviewed entries with translationReviewed: false in benefitsI18n files.
 */

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import te from './locales/te.json';
import hi from './locales/hi.json';

export const SUPPORTED_LANGUAGES = [
  { code: 'en', label: 'English', nativeLabel: 'English' },
  { code: 'te', label: 'Telugu', nativeLabel: 'తెలుగు' },
  { code: 'hi', label: 'Hindi', nativeLabel: 'हिन्दी' },
] as const;

export type SupportedLang = typeof SUPPORTED_LANGUAGES[number]['code'];

/** Get the saved language from localStorage, falling back to browser language or 'en'. */
export function getStoredLanguage(): SupportedLang {
  try {
    const stored = localStorage.getItem('benefitbridge_lang') as SupportedLang | null;
    if (stored && SUPPORTED_LANGUAGES.some(l => l.code === stored)) return stored;
    const browserLang = navigator.language.split('-')[0] as SupportedLang;
    if (SUPPORTED_LANGUAGES.some(l => l.code === browserLang)) return browserLang;
  } catch { /* SSR or private mode */ }
  return 'en';
}

/** Persist the chosen language. */
export function setStoredLanguage(lang: SupportedLang): void {
  try {
    localStorage.setItem('benefitbridge_lang', lang);
    document.documentElement.lang = lang;
  } catch { /* ignore */ }
}

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      te: { translation: te },
      hi: { translation: hi },
    },
    lng: getStoredLanguage(),
    fallbackLng: 'en',
    interpolation: {
      // React already escapes values
      escapeValue: false,
    },
    // Don't log missing keys in production
    missingKeyHandler: import.meta.env.DEV
      ? (lngs, _ns, key) => console.warn(`[i18n] Missing key: ${key} (${lngs})`)
      : false,
  });

// Keep html[lang] in sync
document.documentElement.lang = i18n.language;

export default i18n;
