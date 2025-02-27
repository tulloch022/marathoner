// src/services/authService.ts

import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, User } from "firebase/auth";
import { firebaseConfig } from './firebaseConfig';  // Import firebaseConfig
import { FirebaseError } from 'firebase/app';  // Import FirebaseError

// Initialize Firebase app with the imported config
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Sign up function
export const signUp = async (email: string, password: string): Promise<User | null> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    if (error instanceof FirebaseError) {
      throw new Error(error.message);  // Handle Firebase errors
    } else {
      throw new Error('An unexpected error occurred');
    }
  }
};

// Sign in function
export const signIn = async (email: string, password: string): Promise<User | null> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    if (error instanceof FirebaseError) {
      throw new Error(error.message);  // Handle Firebase errors
    } else {
      throw new Error('An unexpected error occurred');
    }
  }
};

// Sign out function
export const logOut = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    if (error instanceof FirebaseError) {
      throw new Error(error.message);  // Handle Firebase errors
    } else {
      throw new Error('An unexpected error occurred');
    }
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
