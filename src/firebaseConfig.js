// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyB5Zai26tXBytn6RiA_m4GqSizoBsN49i4',
  authDomain: 'arpbackend-df561.firebaseapp.com',
  databaseURL: 'https://arpbackend-df561.firebaseio.com',
  projectId: 'arpbackend-df561',
  storageBucket: 'arpbackend-df561.appspot.com',
  messagingSenderId: '291422297894',
  appId: '1:291422297894:web:80dff218bb204efeac2be7',
  measurementId: 'G-0RJQLXV6FQ'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get a reference to the storage service, which is used to create references in your storage bucket
export const storage = getStorage(app);

// Get a reference to the Firebase firestore
export const db = getFirestore(app);

// Get a reference to the Firebase Auth
export const auth = getAuth(app);
