
import { initializeApp, getApp, getApps } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  deleteDoc, 
  updateDoc, 
  doc, 
  onSnapshot, 
  query, 
  orderBy,
  getDoc,
  setDoc,
  Firestore,
  where
} from 'firebase/firestore';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  Auth
} from 'firebase/auth';
import { UserProfile } from '../types';

// Using process.env.API_KEY as per guidelines
const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: "pelada-pro.firebaseapp.com",
  projectId: "pelada-pro",
  storageBucket: "pelada-pro.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};

let app;
let db: Firestore | null = null;
let auth: Auth | null = null;

try {
  // Only attempt initialization if API Key looks valid
  if (firebaseConfig.apiKey && firebaseConfig.apiKey !== "YOUR_API_KEY") {
    app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    db = getFirestore(app);
    auth = getAuth(app);
  } else {
    console.warn("Firebase API Key is missing or using placeholder. Auth features will be disabled.");
  }
} catch (error) {
  console.error("Erro ao inicializar Firebase:", error);
}

export { db, auth };

const getAthletesRef = () => db ? collection(db, 'athletes') : null;
const getUsersRef = () => db ? collection(db, 'users') : null;

export const firebaseService = {
  // Auth
  signInWithGoogle: async () => {
    if (!auth) throw new Error("Firebase Auth não inicializado. Verifique sua API Key.");
    const provider = new GoogleAuthProvider();
    return await signInWithPopup(auth, provider);
  },
  logout: async () => {
    if (!auth) return;
    return await signOut(auth);
  },

  // User Profile
  getUserProfile: async (uid: string): Promise<UserProfile | null> => {
    if (!db) return null;
    const userDoc = await getDoc(doc(db, 'users', uid));
    return userDoc.exists() ? (userDoc.data() as UserProfile) : null;
  },
  saveUserProfile: async (profile: UserProfile) => {
    if (!db) return;
    return await setDoc(doc(db, 'users', profile.uid), profile);
  },

  // Presence/Athletes
  getAthletes: (callback: (athletes: any[]) => void) => {
    const ref = getAthletesRef();
    if (!ref) return () => {};
    const q = query(ref, orderBy('name'));
    return onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      callback(data);
    }, (error) => {
      console.error("Firestore error:", error);
    });
  },
  confirmPresence: async (user: UserProfile) => {
    const ref = getAthletesRef();
    if (!ref || !db) throw new Error("Firestore não inicializado");
    
    return await setDoc(doc(db, 'athletes', user.uid), {
      uid: user.uid,
      name: user.name,
      position: user.position,
      status: 'active',
      timestamp: Date.now()
    });
  },
  removePresence: async (uid: string) => {
    if (!db) return;
    return await deleteDoc(doc(db, 'athletes', uid));
  },
  
  addAthlete: async (athlete: any) => {
    const ref = getAthletesRef();
    if (!ref) throw new Error("Firestore não inicializado");
    return await addDoc(ref, athlete);
  },
  updateAthlete: async (id: string, data: any) => {
    if (!db) throw new Error("Firestore não inicializado");
    const athleteDoc = doc(db, 'athletes', id);
    return await updateDoc(athleteDoc, data);
  },
  deleteAthlete: async (id: string) => {
    if (!db) throw new Error("Firestore não inicializado");
    const athleteDoc = doc(db, 'athletes', id);
    return await deleteDoc(athleteDoc);
  }
};
