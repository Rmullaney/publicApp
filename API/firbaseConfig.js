import { initializeApp } from "firebase/app";
import 'firebase/compat/auth';
import { getAnalytics } from "firebase/analytics";
import { getFirestore, setDoc, doc } from 'firebase/firestore'
import { getAuth } from "firebase/auth";
import firebase from 'firebase/app';
import 'firebase/storage';
import { getStorage } from "firebase/storage";


const firebaseConfig = {
  apiKey: "",
  authDomain: "raider-rides-app.firebaseapp.com",
  projectId: "raider-rides-app",
  storageBucket: "raider-rides-app.appspot.com",
  messagingSenderId: "496230665639",
  appId: "",
  measurementId: "G-9ES8QSEZTC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const storage = getStorage(app);

//initialize storage for pictures


export const sendDataToFirebase = async (uid, email) => {
  const firestore = getFirestore();

  await setDoc(doc(firestore, 'users', `${uid}`), {
    email
  })
}

