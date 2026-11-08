import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User } from 'firebase/auth';
import { 
  onAuthStateChanged, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut as firebaseSignOut 
} from 'firebase/auth';
import { auth } from '../lib/firebase';
import { getUserProfile } from '../services/userService';
import type { UserProfile } from '../types/user';

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  isOnboarded: boolean | null; // null means we are still checking
  signInWithGoogle: () => Promise<void>;
  signInAsDemo: () => Promise<void>;
  signOut: () => Promise<void>;
  refreshOnboardingStatus: () => Promise<void>;
}

const DEMO_USER: any = {
  uid: 'demo-citizen-101',
  email: 'rajesh.kumar@example.com',
  displayName: 'Rajesh Kumar',
  phoneNumber: '+919876543210',
  photoURL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      if (typeof window !== 'undefined' && localStorage.getItem('benefitbridge_demo_mode') === 'true') {
        return DEMO_USER;
      }
    } catch {}
    return null;
  });
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(() => {
    try {
      if (typeof window !== 'undefined' && localStorage.getItem('benefitbridge_demo_mode') === 'true') {
        return false;
      }
    } catch {}
    return true;
  });
  const [isOnboarded, setIsOnboarded] = useState<boolean | null>(() => {
    try {
      if (typeof window !== 'undefined' && localStorage.getItem('benefitbridge_demo_mode') === 'true') {
        return true;
      }
    } catch {}
    return null;
  });

  const checkOnboardingStatus = async (uid: string) => {
    try {
      const profile = await getUserProfile(uid);
      setUserProfile(profile);
      setIsOnboarded(!!profile);
    } catch (error) {
      console.error("Error checking onboarding status:", error);
      setUserProfile(null);
      setIsOnboarded(false);
    }
  };

  const refreshOnboardingStatus = async () => {
    if (user) {
      await checkOnboardingStatus(user.uid);
    }
  };

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    if (localStorage.getItem('benefitbridge_demo_mode') === 'true') {
      getUserProfile('demo-citizen-101').then(profile => {
        setUserProfile(profile);
      });
      return;
    }

    try {
      unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
        if (localStorage.getItem('benefitbridge_demo_mode') === 'true') return;
        setUser(currentUser);
        if (currentUser) {
          await checkOnboardingStatus(currentUser.uid);
        } else {
          setIsOnboarded(null);
        }
        setLoading(false);
      }, (err) => {
        console.warn("Auth state error:", err);
        setLoading(false);
      });
    } catch {
      setLoading(false);
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const signInWithGoogle = async () => {
    localStorage.removeItem('benefitbridge_demo_mode');
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const signInAsDemo = async () => {
    try {
      localStorage.setItem('benefitbridge_demo_mode', 'true');
      setUser(DEMO_USER);
      await checkOnboardingStatus('demo-citizen-101');
      setIsOnboarded(true);
      setLoading(false);
    } catch (e) {
      console.error("Failed demo login:", e);
    }
  };

  const signOut = async () => {
    localStorage.removeItem('benefitbridge_demo_mode');
    setUser(null);
    setUserProfile(null);
    setIsOnboarded(null);
    try {
      await firebaseSignOut(auth);
    } catch {}
  };

  return (
    <AuthContext.Provider value={{ user, userProfile, loading, isOnboarded, signInWithGoogle, signInAsDemo, signOut, refreshOnboardingStatus }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}


