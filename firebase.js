// Firebase configuration and initialization
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getAuth, onAuthStateChanged, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, GoogleAuthProvider, signInWithPopup } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { getDatabase, ref, get, set } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js';

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: window.FIREBASE_CONFIG?.apiKey,
  authDomain: window.FIREBASE_CONFIG?.authDomain,
  databaseURL: window.FIREBASE_CONFIG?.databaseURL,
  projectId: window.FIREBASE_CONFIG?.projectId,
  storageBucket: window.FIREBASE_CONFIG?.storageBucket,
  messagingSenderId: window.FIREBASE_CONFIG?.messagingSenderId,
  appId: window.FIREBASE_CONFIG?.appId,
  measurementId: window.FIREBASE_CONFIG?.measurementId
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

// Export functions for use in app.js
export function initFirebase() {
  return app;
}

export function onAuthChange(callback) {
  return onAuthStateChanged(auth, callback);
}

export function signOutUser() {
  return signOut(auth);
}

export async function fetchTeamsFromFirebase() {
  try {
    const teamsRef = ref(database, 'teams');
    console.log('Fetching from Firebase path: teams');
    const snapshot = await get(teamsRef);
    console.log('Firebase snapshot exists:', snapshot.exists());
    if (snapshot.exists()) {
      const data = snapshot.val();
      console.log('Firebase data:', data);
      return data;
    }
    console.log('No data found at Firebase path: teams');
    return null;
  } catch (error) {
    console.error('Error fetching teams from Firebase:', error);
    throw error;
  }
}

export async function saveTeamsToFirebase(teamsData) {
  try {
    const teamsRef = ref(database, 'teams');
    await set(teamsRef, teamsData);
    return true;
  } catch (error) {
    console.error('Error saving teams to Firebase:', error);
    throw error;
  }
}

export async function signInEmailPassword(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error('Error signing in with email/password:', error);
    throw error;
  }
}

export async function signInWithGoogle() {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    console.error('Error signing in with Google:', error);
    throw error;
  }
}

export async function signUpWithEmail(email, password, displayName) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, { displayName });
    return userCredential.user;
  } catch (error) {
    console.error('Error creating account:', error);
    throw error;
  }
}