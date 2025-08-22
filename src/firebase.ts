import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; 
import { getStorage } from "firebase/storage";
import {getFirestore} from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyBljHMlHkcGaGqb42ZmGe52f-wMBFIWhZU",
  authDomain: "social-app-f82bf.firebaseapp.com",
  projectId: "social-app-f82bf",
  storageBucket: "social-app-f82bf.firebasestorage.app",
  messagingSenderId: "880708275850",
  appId: "1:880708275850:web:59dcb3e8c068f3512c2773"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const storage = getStorage(app);

export const db = getFirestore();