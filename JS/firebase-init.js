// Firebase initialization (ES module)
// Replace the placeholders in firebaseConfig with your Firebase project values.
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile
} from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js';
import { getAnalytics } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-analytics.js';

const firebaseConfig = {
  apiKey: "AIzaSyDx7TZ0RX-N4iTyvzf2jUdq1fdRuQcb93A",
  authDomain: "promngt.firebaseapp.com",
  projectId: "promngt",
  storageBucket: "promngt.firebasestorage.app",
  messagingSenderId: "205276467430",
  appId: "1:205276467430:web:7c8d53ee3195bd86b3eb27",
  measurementId: "G-SSB7KH45Z0"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const analytics = getAnalytics ? getAnalytics(app) : null;

export { app, auth, analytics, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile };
