
import { useState, useEffect } from 'react';
import { auth, firebaseService } from '../services/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { UserProfile } from '../types';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) return;
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        const userProfile = await firebaseService.getUserProfile(firebaseUser.uid);
        setProfile(userProfile);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const refreshProfile = async () => {
    if (user) {
      const userProfile = await firebaseService.getUserProfile(user.uid);
      setProfile(userProfile);
    }
  };

  return { user, profile, loading, refreshProfile };
};
