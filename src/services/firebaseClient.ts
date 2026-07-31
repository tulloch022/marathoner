import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { firebaseConfig } from "../firebaseConfig";

export const firebaseApp =
  getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(firebaseApp);
