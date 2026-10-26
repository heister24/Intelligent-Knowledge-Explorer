import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC0BZ3iDXWKzcA06Gav0e4ijUCOWSxgMbA",
  authDomain: "intelligent-knowledge-explorer.firebaseapp.com",
  projectId: "intelligent-knowledge-explorer",
  storageBucket: "intelligent-knowledge-explorer.firebasestorage.app",
  messagingSenderId: "646825723604",
  appId: "1:646825723604:web:a0f6acdbfbcb8d519a1d41",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
