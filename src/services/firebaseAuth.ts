import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
  signOut as firebaseSignOut,
  updateProfile,
  type User,
  type UserCredential,
} from 'firebase/auth';
import { auth } from '../firebase';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

export type AuthUser = {
  id: string;
  email: string;
  name?: string;
  token: string;
};

// Convert Firebase User to our AuthUser type
async function convertFirebaseUser(user: User): Promise<AuthUser> {
  const token = await user.getIdToken();
  return {
    id: user.uid,
    email: user.email || '',
    name: user.displayName || undefined,
    token,
  };
}

// Create or update user document in Firestore
async function createUserDocument(user: User) {
  if (!db) return;
  
  const userRef = doc(db, 'users', user.uid);
  const userSnap = await getDoc(userRef);
  
  if (!userSnap.exists()) {
    await setDoc(userRef, {
      email: user.email,
      name: user.displayName,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }
}

export async function signUpWithEmail(email: string, password: string, name: string): Promise<AuthUser> {
  if (!auth) {
    throw new Error('Firebase is not configured');
  }

  const userCredential: UserCredential = await createUserWithEmailAndPassword(auth, email, password);
  
  // Update the user's display name
  if (name) {
    await updateProfile(userCredential.user, { displayName: name });
  }
  
  // Create user document in Firestore
  await createUserDocument(userCredential.user);
  
  return convertFirebaseUser(userCredential.user);
}

export async function signInWithEmail(email: string, password: string): Promise<AuthUser> {
  if (!auth) {
    throw new Error('Firebase is not configured');
  }

  const userCredential: UserCredential = await signInWithEmailAndPassword(auth, email, password);
  return convertFirebaseUser(userCredential.user);
}

export async function signInWithGoogle(): Promise<AuthUser> {
  if (!auth) {
    throw new Error('Firebase is not configured');
  }

  const userCredential: UserCredential = await signInWithPopup(auth, googleProvider);
  
  // Create user document in Firestore if it doesn't exist
  await createUserDocument(userCredential.user);
  
  return convertFirebaseUser(userCredential.user);
}

export async function signInWithGithub(): Promise<AuthUser> {
  if (!auth) {
    throw new Error('Firebase is not configured');
  }

  const userCredential: UserCredential = await signInWithPopup(auth, githubProvider);
  
  // Create user document in Firestore if it doesn't exist
  await createUserDocument(userCredential.user);
  
  return convertFirebaseUser(userCredential.user);
}

export async function signOut(): Promise<void> {
  if (!auth) {
    throw new Error('Firebase is not configured');
  }

  await firebaseSignOut(auth);
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  if (!auth || !auth.currentUser) {
    return null;
  }

  return convertFirebaseUser(auth.currentUser);
}
