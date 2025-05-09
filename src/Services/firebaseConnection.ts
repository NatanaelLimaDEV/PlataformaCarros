import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyAdEMZMB-Onddc-BU0BXc-j_Iozsa4cuh8",
  authDomain: "tickets-f3a7c.firebaseapp.com",
  projectId: "tickets-f3a7c",
  storageBucket: "tickets-f3a7c.firebasestorage.app",
  messagingSenderId: "18055629190",
  appId: "1:18055629190:web:ef2ce0b7f69ea22863c407",
  measurementId: "G-W748LG9NVC"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app)
const auth = getAuth(app)
const storage = getStorage(app)

export { db, auth, storage }