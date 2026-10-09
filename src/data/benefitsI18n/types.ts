export interface BenefitI18n {
  titleExplanation?: string; // local explanation next to official name, e.g. "పీఎం కిసాన్"
  description: string;       // simple, conversational description
  benefitAmountWording?: string; // friendly amount explanation
  requiredDocuments?: Record<string, string>;
  howToApplySteps?: string[];
  deadlinesText?: string;
  renewalNotes?: string;
  translationReviewed: boolean; // false until checked by native speaker
}

export type BenefitsTranslationMap = Record<string, BenefitI18n>;
