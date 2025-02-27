// src/services/authService.ts

import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, User } from "firebase/auth";
import { firebaseConfig } from '../firebaseConfig';  // Import the Firebase config

// Initialize Firebase app with the imported config
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Sign up function
export const signUp = async (email: string, password: string): Promise<User | null> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'An unexpected error occurred');
  }
};

// Sign in function
export const signIn = async (email: string, password: string): Promise<User | null> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'An unexpected error occurred');
  }
};

// Sign out function
export const logOut = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'An unexpected error occurred');
  }
};

// Check if the user is authenticated
export const onAuthStateChangedListener = (callback: (user: User | null) => void): void => {
  onAuthStateChanged(auth, callback);
};

// Get the current user
export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};
