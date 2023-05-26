import { initializeApp } from 'firebase/app';
// import { getDatabase } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
// Initialize Firebase
const firebaseConfig = {
  apiKey: 'AIzaSyCfa5W46ThT7n8salxOReGKQxK5MrE_Bnk',
  authDomain: 'diogo-app-7b9f9.firebaseapp.com',
  databaseURL: 'https://diogo-app-7b9f9-default-rtdb.firebaseio.com',
  projectId: 'diogo-app-7b9f9',
  storageBucket: 'diogo-app-7b9f9.appspot.com',
  messagingSenderId: '416704034483',
  appId: '1:416704034483:web:2da47462b439ebd84a22c6',
  measurementId: 'G-FDV0XKQNRE'
};

export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_DB = getFirestore(FIREBASE_APP);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const FIREBASE_STORAGE = getStorage(FIREBASE_APP);
// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase
