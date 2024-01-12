// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyBqfVxYU8TAEeqxSn9Cd7QofSIad_DhjGs',
  authDomain: 'mywatchlist-c6085.firebaseapp.com',
  projectId: 'mywatchlist-c6085',
  storageBucket: 'mywatchlist-c6085.appspot.com',
  messagingSenderId: '508832012320',
  appId: '1:508832012320:web:9960ed8221224bb4698445',
  measurementId: 'G-4V1SSKBQQ8',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

export default app;
