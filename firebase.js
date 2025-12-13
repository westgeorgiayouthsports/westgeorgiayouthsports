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
// console.log('Firebase config used:', firebaseConfig);
// console.log('Firebase app name/options:', app.name, app.options);
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
    const teamsPath = 'team_budgets';
    const teamsRef = ref(database, teamsPath);
    // console.log('Fetching from Firebase path:', teamsPath);
    const snapshot = await get(teamsRef);
    console.log('Firebase snapshot exists:', snapshot.exists());
    if (snapshot.exists()) {
      let data = snapshot.val();
      // console.log('Firebase raw data:', data);
      // Normalize: if data is an object keyed by id, convert to array preserving ids
      if (data && !Array.isArray(data) && typeof data === 'object') {
        const arr = Object.keys(data).map(key => {
          const item = data[key] || {};
          if (!item.id) item.id = key;
          return item;
        });
        // console.log('Normalized Firebase data to array, length:', arr.length);
        return arr;
      }
      return data;
    }
    // console.log('No data found at Firebase path: team_budgets');
    return null;
  } catch (error) {
    // console.error('Error fetching teams from Firebase:', error, 'code:', error?.code || error?.message);
    // Provide a helpful hint for permission issues
    if (error && (error.code === 'PERMISSION_DENIED' || (error?.message && error.message.toLowerCase().includes('permission')))) {
      console.error('Permission denied when accessing Realtime Database. Possible causes:\n - Realtime Database rules deny reads for authenticated users\n - The configured `databaseURL` is incorrect (pointing to a different project)\n - The user is not authenticated or lacks required claims/roles');
    }
    throw error;
  }
}

export async function saveTeamsToFirebase(teamsData) {
  try {
    const teamsPath = 'team_budgets';
    // console.log('Saving teams to Firebase path:', teamsPath);
    // If passed an array, write each team to /team_budgets/<id> to respect per-item write rules
    if (Array.isArray(teamsData)) {
      const promises = teamsData.map(team => {
        const id = team.id || (`team-${Date.now()}-${Math.floor(Math.random() * 1000)}`);
        return set(ref(database, `${teamsPath}/${id}`), { ...team, id });
      });
      await Promise.all(promises);
      return true;
    } else if (teamsData && typeof teamsData === 'object') {
      // If object mapping provided, write each key
      const promises = Object.keys(teamsData).map(key => set(ref(database, `${teamsPath}/${key}`), teamsData[key]));
      await Promise.all(promises);
      return true;
    } else {
      // Fallback: set the entire node (not recommended with restrictive rules)
      await set(ref(database, teamsPath), teamsData);
      return true;
    }
  } catch (error) {
    console.error('Error saving teams to Firebase:', error);
    throw error;
  }
}

// Save a single team/budget under /team_budgets/<teamId>
export async function saveTeamToFirebase(teamId, teamData) {
  try {
    const teamsPath = 'team_budgets';
    if (!teamId) throw new Error('teamId is required');
    await set(ref(database, `${teamsPath}/${teamId}`), { ...teamData, id: teamId });
    return true;
  } catch (error) {
    console.error('Error saving single team to Firebase:', error);
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