import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDlbphupyfLU7ul46LWnK-bjFq8sOotcPw",
    authDomain: "",
    projectId: "marathoner-d9bf9",
    storageBucket: "",
    messagingSenderId: "",
    appId: "",
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

