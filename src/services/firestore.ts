import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase';

// Composition types for AI features
export type Composition = {
  id?: string;
  userId: string;
  title: string;
  voiceParts: string[]; // e.g., ['Soprano', 'Alto', 'Tenor', 'Bass']
  key?: string;
  tempo?: number;
  lyrics?: string;
  aiGenerated: boolean;
  aiPrompt?: string;
  musicXml?: string;
  audioUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export type PracticeSession = {
  id?: string;
  userId: string;
  compositionId: string;
  voicePart: string;
  duration: number; // in seconds
  accuracy?: number; // 0-100
  createdAt?: Date;
};

export type UserProfile = {
  id?: string;
  email: string;
  name?: string;
  voicePart?: string;
  createdAt?: Date;
  updatedAt?: Date;
  preferences?: {
    defaultTempo?: number;
    defaultKey?: string;
    favoriteVoicePart?: string;
  };
};

// Composition CRUD operations
export async function createComposition(composition: Omit<Composition, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  if (!db) {
    throw new Error('Firebase is not configured');
  }

  const compositionsRef = collection(db, 'compositions');
  const docRef = await addDoc(compositionsRef, {
    ...composition,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  
  return docRef.id;
}

export async function getComposition(id: string): Promise<Composition | null> {
  if (!db) {
    throw new Error('Firebase is not configured');
  }

  const docRef = doc(db, 'compositions', id);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Composition;
  }
  
  return null;
}

export async function getUserCompositions(userId: string, limitCount: number = 50): Promise<Composition[]> {
  if (!db) {
    throw new Error('Firebase is not configured');
  }

  const compositionsRef = collection(db, 'compositions');
  const q = query(
    compositionsRef,
    where('userId', '==', userId),
    orderBy('createdAt', 'desc'),
    limit(limitCount)
  );
  
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Composition));
}

export async function updateComposition(id: string, updates: Partial<Composition>): Promise<void> {
  if (!db) {
    throw new Error('Firebase is not configured');
  }

  const docRef = doc(db, 'compositions', id);
  await updateDoc(docRef, {
    ...updates,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteComposition(id: string): Promise<void> {
  if (!db) {
    throw new Error('Firebase is not configured');
  }

  const docRef = doc(db, 'compositions', id);
  await deleteDoc(docRef);
}

// Practice Session operations
export async function createPracticeSession(session: Omit<PracticeSession, 'id' | 'createdAt'>): Promise<string> {
  if (!db) {
    throw new Error('Firebase is not configured');
  }

  const sessionsRef = collection(db, 'practiceSessions');
  const docRef = await addDoc(sessionsRef, {
    ...session,
    createdAt: serverTimestamp(),
  });
  
  return docRef.id;
}

export async function getUserPracticeSessions(userId: string, limitCount: number = 50): Promise<PracticeSession[]> {
  if (!db) {
    throw new Error('Firebase is not configured');
  }

  const sessionsRef = collection(db, 'practiceSessions');
  const q = query(
    sessionsRef,
    where('userId', '==', userId),
    orderBy('createdAt', 'desc'),
    limit(limitCount)
  );
  
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PracticeSession));
}

// User Profile operations
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  if (!db) {
    throw new Error('Firebase is not configured');
  }

  const docRef = doc(db, 'users', userId);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as UserProfile;
  }
  
  return null;
}

export async function updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<void> {
  if (!db) {
    throw new Error('Firebase is not configured');
  }

  const docRef = doc(db, 'users', userId);
  await updateDoc(docRef, {
    ...updates,
    updatedAt: serverTimestamp(),
  });
}

// AI Generation logging
export type AIGenerationLog = {
  id?: string;
  userId: string;
  prompt: string;
  compositionId?: string;
  status: 'pending' | 'completed' | 'failed';
  error?: string;
  createdAt?: Date;
};

export async function createAIGenerationLog(log: Omit<AIGenerationLog, 'id' | 'createdAt'>): Promise<string> {
  if (!db) {
    throw new Error('Firebase is not configured');
  }

  const logsRef = collection(db, 'aiGenerationLogs');
  const docRef = await addDoc(logsRef, {
    ...log,
    createdAt: serverTimestamp(),
  });
  
  return docRef.id;
}

export async function updateAIGenerationLog(id: string, updates: Partial<AIGenerationLog>): Promise<void> {
  if (!db) {
    throw new Error('Firebase is not configured');
  }

  const docRef = doc(db, 'aiGenerationLogs', id);
  await updateDoc(docRef, updates);
}
