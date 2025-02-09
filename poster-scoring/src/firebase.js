import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc, updateDoc } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAidYso4MoB2SHQhbXYgsPEJ98dn2u6Q20",
    authDomain: "score-me-7747a.firebaseapp.com",
    projectId: "score-me-7747a",
    storageBucket: "score-me-7747a.firebasestorage.app",
    messagingSenderId: "265990731989",
    appId: "1:265990731989:web:54472fbbaf7d40bea70a5c",
    measurementId: "G-8H1C4TW0NF"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, doc, setDoc, getDoc, updateDoc };