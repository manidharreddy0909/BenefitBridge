export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  
  // PERSONAL INFORMATION
  dateOfBirth?: string;
  age?: number;
  gender?: string;
  state?: string;
  district?: string;
  cityTownVillage?: string;
  pinCode?: string;
  contactNumber?: string;
  preferredLanguage?: string; // 'en' | 'te' | 'hi' etc.
  simpleMode?: boolean;

  // EDUCATION
  educationLevel?: string;
  course?: string;
  branchStream?: string;
  institution?: string;
  institutionType?: string;
  academicYear?: string;
  yearOfStudy?: string;
  admissionYear?: string;
  expectedGraduationYear?: string;
  previousQualification?: string;
  academicPerformance?: string; // Percentage/CGPA

  // FAMILY & FINANCIAL
  annualIncome?: string; // String to handle ranges or exact values easily for MVP
  incomeSource?: string;
  numberOfFamilyMembers?: number;
  numberOfEarningMembers?: number;
  parentGuardianOccupation?: string;
  employmentStatus?: string;
  financialCategory?: string;

  // LOCATION & RESIDENCY
  ruralUrban?: string;
  residencyStatus?: string;
  domicileState?: string;

  // SOCIAL / ELIGIBILITY INFORMATION
  category?: string; // e.g. General, OBC, SC, ST
  disabilityStatus?: string;
  minorityStatus?: string;
  specialEligibilityCategories?: string[]; // e.g. Farmer, Ex-Serviceman
  studentStatus?: string;
  landHoldingAcres?: number;
  rationCardType?: string; // e.g. BPL, AAY, Priority Household
  isWidowOrSenior?: boolean;
  isPregnantOrLactating?: boolean;
  numberOfChildren?: number;

  // NOTIFICATION & SETTINGS
  notificationPrefs?: {
    sms?: boolean;
    whatsapp?: boolean;
    push?: boolean;
    quietHours?: boolean;
  };

  createdAt: number;
  updatedAt: number;
}
