import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { UserProfile } from '../types/user';

const USERS_COLLECTION = 'users';

const DEFAULT_DEMO_PROFILE: UserProfile = {
  uid: 'demo-citizen-101',
  email: 'rajesh.kumar@example.com',
  displayName: 'Rajesh Kumar',
  age: 42,
  gender: 'Male',
  state: 'Telangana',
  district: 'Warangal',
  cityTownVillage: 'Kazipet',
  pinCode: '506004',
  contactNumber: '+919876543210',
  preferredLanguage: 'en',
  educationLevel: 'Secondary (Class 10)',
  employmentStatus: 'Farmer',
  annualIncome: '120000',
  category: 'OBC',
  landHoldingAcres: 2.5,
  rationCardType: 'BPL',
  specialEligibilityCategories: ['Farmer'],
  createdAt: Date.now() - 86400000 * 30,
  updatedAt: Date.now(),
};

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  if (uid === 'demo-citizen-101') {
    try {
      const stored = localStorage.getItem('benefitbridge_demo_profile');
      if (stored) return JSON.parse(stored);
    } catch { /* ignore */ }
    return DEFAULT_DEMO_PROFILE;
  }

  try {
    const docRef = doc(db, USERS_COLLECTION, uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data() as UserProfile;
    } else {
      return null;
    }
  } catch (err) {
    console.warn("Firestore getUserProfile fallback:", err);
    try {
      const stored = localStorage.getItem(`profile_${uid}`);
      if (stored) return JSON.parse(stored);
    } catch {}
    return null;
  }
}

export async function createUserProfile(uid: string, data: Omit<UserProfile, 'createdAt' | 'updatedAt'>): Promise<void> {
  const now = Date.now();
  const profile: UserProfile = {
    ...data,
    createdAt: now,
    updatedAt: now,
  };

  if (uid === 'demo-citizen-101') {
    try {
      localStorage.setItem('benefitbridge_demo_profile', JSON.stringify(profile));
    } catch {}
    return;
  }

  try {
    const docRef = doc(db, USERS_COLLECTION, uid);
    await setDoc(docRef, profile);
  } catch (err) {
    console.warn("Firestore createUserProfile fallback:", err);
    try {
      localStorage.setItem(`profile_${uid}`, JSON.stringify(profile));
    } catch {}
  }
}

export async function updateUserProfile(uid: string, data: Partial<UserProfile>): Promise<void> {
  if (uid === 'demo-citizen-101') {
    try {
      const existing = await getUserProfile(uid) || DEFAULT_DEMO_PROFILE;
      const updated = { ...existing, ...data, updatedAt: Date.now() };
      localStorage.setItem('benefitbridge_demo_profile', JSON.stringify(updated));
    } catch {}
    return;
  }

  try {
    const docRef = doc(db, USERS_COLLECTION, uid);
    await setDoc(docRef, {
      ...data,
      updatedAt: Date.now(),
    }, { merge: true });
  } catch (err) {
    console.warn("Firestore updateUserProfile fallback:", err);
    try {
      const existing = await getUserProfile(uid) || ({} as UserProfile);
      const updated = { ...existing, ...data, updatedAt: Date.now() };
      localStorage.setItem(`profile_${uid}`, JSON.stringify(updated));
    } catch {}
  }
}
