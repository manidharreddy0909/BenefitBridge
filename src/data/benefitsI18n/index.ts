import type { Benefit } from '../../types/benefit';
import type { BenefitI18n } from './types';
import { TELUGU_BENEFITS } from './te';
import { HINDI_BENEFITS } from './hi';

export * from './types';

const TRANSLATIONS_BY_LANG: Record<string, Record<string, BenefitI18n>> = {
  te: TELUGU_BENEFITS,
  hi: HINDI_BENEFITS,
};

/**
 * Fetch localized info for a given benefit ID and language code.
 * Falls back to null if no localization exists (which signals callers to use English defaults).
 */
export function getBenefitI18n(benefitId: string, lang: string): BenefitI18n | null {
  const normalizedLang = lang?.split('-')[0];
  if (!normalizedLang || normalizedLang === 'en') return null;
  const langMap = TRANSLATIONS_BY_LANG[normalizedLang];
  return langMap ? langMap[benefitId] ?? null : null;
}

/**
 * Formats a localized benefit title following hard rules:
 * Official name stays in its official form: PM-KISAN, Ayushman Bharat PM-JAY.
 * Local language explanation is shown next to official name: e.g. PM-KISAN (పీఎం కిసాన్)
 */
export function getLocalizedBenefitTitle(benefit: Benefit, lang: string): string {
  const i18nData = getBenefitI18n(benefit.id, lang);
  if (i18nData && i18nData.titleExplanation) {
    // If the official title doesn't already contain the explanation, append it
    return `${benefit.title} (${i18nData.titleExplanation})`;
  }
  return benefit.title;
}

/**
 * Gets localized description or falls back to official English description
 */
export function getLocalizedBenefitDescription(benefit: Benefit, lang: string): string {
  const i18nData = getBenefitI18n(benefit.id, lang);
  return i18nData?.description || benefit.description;
}

/**
 * Gets localized benefit amount wording or falls back to official English amount
 */
export function getLocalizedBenefitAmount(benefit: Benefit, lang: string): string {
  const i18nData = getBenefitI18n(benefit.id, lang);
  return i18nData?.benefitAmountWording || benefit.benefitAmount;
}

/**
 * Check if the translation for this benefit in this language has been native-speaker reviewed.
 */
export function isTranslationReviewed(benefitId: string, lang: string): boolean {
  const normalizedLang = lang?.split('-')[0];
  if (!normalizedLang || normalizedLang === 'en') return true;
  const i18nData = getBenefitI18n(benefitId, lang);
  return i18nData ? i18nData.translationReviewed : true;
}
