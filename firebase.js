// Firebase initialization and helpers (modular SDK via ESM)
// This file is an ES module and is intended to be imported with `type="module"` in the browser.

import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js';
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged
} from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js';
import {
  getDatabase,
  ref,
  get,
  set
} from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js';

const firebaseConfig = {
  apiKey: "AIzaSyDwydE5BFNWY99KAAlltP8ph30UTLT6Fpk",
  authDomain: "wgys-ls.firebaseapp.com",
  databaseURL: "https://wgys-ls-default-rtdb.firebaseio.com",
  projectId: "wgys-ls",
  storageBucket: "wgys-ls.firebasestorage.app",
  messagingSenderId: "115058670356",
  appId: "1:115058670356:web:f4e216241b8b534b74e001",
  measurementId: "G-CK303BGJZG"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

const TEAM_BUDGETS_DB_PATH = '/team-budgets'; // stored at /team-budgets.json

export function initFirebase() {
  return { app, auth, db };
}

export function signInEmailPassword(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

export function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider);
}

export function signOutUser() {
  return firebaseSignOut(auth);
}

export function onAuthChange(cb) {
  return onAuthStateChanged(auth, cb);
}

export async function fetchTeamsFromFirebase() {
  try {
    const snap = await get(ref(db, TEAM_BUDGETS_DB_PATH));
    if (snap.exists()) {
      return snap.val();
    }
    return null;
  } catch (err) {
    console.error('fetchTeamsFromFirebase error', err);
    throw err;
  }
}

export async function saveTeamsToFirebase(data) {
  try {
    await set(ref(db, TEAM_BUDGETS_DB_PATH), data);
    return true;
  } catch (err) {
    console.error('saveTeamsToFirebase error', err);
    throw err;
  }
}