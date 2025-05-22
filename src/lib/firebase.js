
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {getAuth, GithubAuthProvider, signInWithPopup, signOut} from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyAFocePCinB4c8Q8M69gEBuspsupg9zPBY",
    authDomain: "clickerweb-f1b6f.firebaseapp.com",
    projectId: "clickerweb-f1b6f",
    storageBucket: "clickerweb-f1b6f.firebasestorage.app",
    messagingSenderId: "39900726495",
    appId: "1:39900726495:web:a4b3a914c29ab54e75956a",
    measurementId: "G-0W7Y1EDTHK"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
export const githubProvider = new GithubAuthProvider();

export const loginWithGitHub = () => signInWithPopup(auth, githubProvider);
export const logout = () => signOut(auth);
export { db, auth };
