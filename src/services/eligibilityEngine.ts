import type { Benefit, EligibilityResult, EligibilityStatus, CriterionDetail } from '../types/benefit';
import type { UserProfile } from '../types/user';
import { CURATED_BENEFITS } from '../data/benefits';
import { getUserDocuments } from './documentService';
import { getStateCode } from '../lib/utils';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function calculateAge(dobString?: string): number | null {
  if (!dobString) return null;
  const dob = new Date(dobString);
  const diff_ms = Date.now() - dob.getTime();
  const age_dt = new Date(diff_ms);
  return Math.abs(age_dt.getUTCFullYear() - 1970);
}

function parseMaxIncomeFromRange(incomeRange?: string): number | null {
  if (!incomeRange) return null;
  if (incomeRange === '0-250000') return 250000;
  if (incomeRange === '250001-500000') return 500000;
  if (incomeRange === '500001-800000') return 800000;
  if (incomeRange === '800001+') return 800001;
  return null;
}

// ─── Core Eligibility Evaluator ──────────────────────────────────────────────

export function evaluateEligibility(
  user: UserProfile,
  benefit: Benefit,
  uploadedDocTypes: string[] = []
): EligibilityResult {
  const satisfied: string[] = [];
  const missing: string[] = [];
  const unmet: string[] = [];
  const missingDocs: string[] = [];

  const satisfiedDetails: CriterionDetail[] = [];
  const missingDetails: CriterionDetail[] = [];
  const unmetDetails: CriterionDetail[] = [];

  const addSatisfied = (text: string, messageKey?: string, params?: Record<string, string | number>) => {
    satisfied.push(text);
    satisfiedDetails.push({ text, messageKey, params });
  };

  const addMissing = (text: string, messageKey?: string, params?: Record<string, string | number>) => {
    missing.push(text);
    missingDetails.push({ text, messageKey, params });
  };

  const addUnmet = (text: string, messageKey?: string, params?: Record<string, string | number>) => {
    unmet.push(text);
    unmetDetails.push({ text, messageKey, params });
  };

  const { eligibilityCriteria: c } = benefit;
  const income = parseMaxIncomeFromRange(user.annualIncome);
  const age = calculateAge(user.dateOfBirth);

  // ── State ─────────────────────────────────────────────────────────────────
  // Profile stores full names (e.g. "Maharashtra"); benefits use 2-letter codes (e.g. "MH").
  if (c.states && c.states.length > 0) {
    if (!user.state) {
      addMissing('State of residence not set in profile', 'stateNotSet');
    } else {
      const userStateCode = getStateCode(user.state);
      if (c.states.includes(userStateCode) || c.states.includes(user.state)) {
        addSatisfied(`Resident of eligible state (${user.state})`, 'stateEligible', { state: user.state });
      } else {
        addUnmet(`Scheme available only in: ${c.states.join(', ')} — your state: ${user.state}`, 'stateIneligible', { states: c.states.join(', '), state: user.state });
      }
    }
  }

  // ── Max Income ────────────────────────────────────────────────────────────
  if (c.maxAnnualIncome !== undefined) {
    if (income === null) {
      addMissing('Annual income not set in profile', 'incomeNotSet');
    } else if (income <= c.maxAnnualIncome) {
      addSatisfied(`Income (₹${income.toLocaleString('en-IN')}) within limit of ₹${c.maxAnnualIncome.toLocaleString('en-IN')}`, 'incomeWithinLimit', { income, limit: c.maxAnnualIncome });
    } else {
      addUnmet(`Income exceeds scheme limit of ₹${c.maxAnnualIncome.toLocaleString('en-IN')}`, 'incomeExceedsLimit', { limit: c.maxAnnualIncome });
    }
  }

  // ── Min Income ────────────────────────────────────────────────────
  if (c.minAnnualIncome !== undefined) {
    if (income === null) {
      addMissing('Annual income not set in profile', 'incomeNotSet');
    } else if (income >= c.minAnnualIncome) {
      addSatisfied(`Income meets minimum requirement of ₹${c.minAnnualIncome.toLocaleString('en-IN')}`, 'incomeMeetsMin', { min: c.minAnnualIncome });
    } else {
      addUnmet(`Income below scheme minimum of ₹${c.minAnnualIncome.toLocaleString('en-IN')}`, 'incomeBelowMin', { min: c.minAnnualIncome });
    }
  }

  // ── Education ─────────────────────────────────────────────────────
  if (c.educationLevels && c.educationLevels.length > 0) {
    if (!user.educationLevel) {
      addMissing('Education level not set in profile', 'educationNotSet');
    } else if (c.educationLevels.includes(user.educationLevel)) {
      addSatisfied(`Education level (${user.educationLevel}) qualifies`, 'educationQualifies', { level: user.educationLevel });
    } else {
      addUnmet(`Education level must be one of: ${c.educationLevels.join(', ')}`, 'educationIneligible', { levels: c.educationLevels.join(', ') });
    }
  }

  // ── Employment ────────────────────────────────────────────────────
  if (c.employmentStatuses && c.employmentStatuses.length > 0) {
    if (!user.employmentStatus) {
      addMissing('Employment status not set in profile', 'employmentNotSet');
    } else if (c.employmentStatuses.includes(user.employmentStatus)) {
      addSatisfied(`Employment status (${user.employmentStatus}) qualifies`, 'employmentQualifies', { status: user.employmentStatus });
    } else {
      addUnmet(`Scheme targets: ${c.employmentStatuses.join(', ')} — your status: ${user.employmentStatus}`, 'employmentIneligible', { targets: c.employmentStatuses.join(', '), status: user.employmentStatus });
    }
  }

  // ── Age Min ───────────────────────────────────────────────────────
  if (c.ageMin !== undefined) {
    if (age === null) {
      addMissing('Date of birth not set in profile', 'ageNotSet');
    } else if (age >= c.ageMin) {
      addSatisfied(`Age (${age}) meets minimum requirement of ${c.ageMin}`, 'ageMeetsMin', { age, min: c.ageMin });
    } else {
      addUnmet(`Minimum age required: ${c.ageMin} — your age: ${age}`, 'ageBelowMin', { age, min: c.ageMin });
    }
  }

  // ── Age Max ───────────────────────────────────────────────────────
  if (c.ageMax !== undefined) {
    if (age === null) {
      addMissing('Date of birth not set in profile', 'ageNotSet');
    } else if (age <= c.ageMax) {
      addSatisfied(`Age (${age}) within maximum of ${c.ageMax}`, 'ageWithinMax', { age, max: c.ageMax });
    } else {
      addUnmet(`Maximum age allowed: ${c.ageMax} — your age: ${age}`, 'ageExceedsMax', { age, max: c.ageMax });
    }
  }

  // ── Caste Criteria (cannot verify — mark as user-verify) ──────────
  if (c.casteCriteria && c.casteCriteria.length > 0) {
    addMissing(`Caste certificate required (eligible categories: ${c.casteCriteria.join(', ')}) — user must verify`, 'casteVerifyRequired', { categories: c.casteCriteria.join(', ') });
  }

  // ── Required Documents ────────────────────────────────────────────
  for (const requiredDoc of benefit.requiredDocuments) {
    if (!uploadedDocTypes.includes(requiredDoc)) {
      missingDocs.push(requiredDoc);
    }
  }

  // ── Status Determination ──────────────────────────────────────────
  let status: EligibilityStatus;
  if (unmet.length > 0) {
    status = 'Not Eligible';
  } else if (missing.length > 0) {
    status = 'Potentially Eligible';
  } else {
    status = 'Eligible';
  }

  // ── Confidence ────────────────────────────────────────────────────
  const totalCriteriaCount = Object.values(c).filter(v =>
    v !== undefined && (!Array.isArray(v) || v.length > 0)
  ).length;
  const verifiedCount = satisfied.length + unmet.length;
  const confidence: EligibilityResult['confidenceLevel'] =
    totalCriteriaCount === 0 ? 'HIGH'
    : verifiedCount / totalCriteriaCount >= 0.7 ? 'HIGH'
    : verifiedCount / totalCriteriaCount >= 0.4 ? 'MEDIUM'
    : 'LOW';

  return {
    benefitId: benefit.id,
    status,
    confidenceLevel: confidence,
    satisfiedCriteria: satisfied,
    missingCriteria: missing,
    unmetCriteria: unmet,
    missingDocuments: missingDocs,
    details: {
      satisfied: satisfiedDetails,
      missing: missingDetails,
      unmet: unmetDetails,
    },
  };
}

// ─── Batch Evaluator ─────────────────────────────────────────────────────────

export async function evaluateAllBenefits(
  uid: string,
  profile: UserProfile
): Promise<{ benefit: Benefit; result: EligibilityResult }[]> {
  const docs = await getUserDocuments(uid);
  const uploadedDocTypes = docs.map(d => d.type);

  return CURATED_BENEFITS.map(benefit => ({
    benefit,
    result: evaluateEligibility(profile, benefit, uploadedDocTypes),
  }));
}

// ─── Re-export dataset ───────────────────────────────────────────────────────
export { CURATED_BENEFITS };
