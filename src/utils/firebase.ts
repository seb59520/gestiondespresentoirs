import { initializeApp } from 'firebase/app';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';

const getFirebaseConfig = () => {
  const config = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
  };

  // Validate required config values
  const requiredFields = ['apiKey', 'authDomain', 'projectId', 'appId'];
  const missingFields = requiredFields.filter(field => !config[field]);

  if (missingFields.length > 0) {
    throw new Error(
      `Configuration Firebase manquante : ${missingFields.join(', ')}`
    );
  }

  return config;
};

// Initialize Firebase
let app;
let auth;
let db;

try {
  app = initializeApp(getFirebaseConfig());
  auth = getAuth(app);
  db = getFirestore(app);

  // Set persistence to LOCAL
  setPersistence(auth, browserLocalPersistence)
    .then(() => {
      console.log('Firebase Auth persistence set to LOCAL');
    })
    .catch((error) => {
      console.error('Error setting persistence:', error);
    });

  // Enable offline persistence for Firestore
  enableIndexedDbPersistence(db, {
    synchronizeTabs: true
  }).catch((err) => {
    if (err.code === 'failed-precondition') {
      console.warn('Multiple tabs open, persistence enabled in first tab only');
    } else if (err.code === 'unimplemented') {
      console.warn('Browser doesn\'t support persistence');
    } else {
      console.error('Persistence initialization failed:', err);
    }
  });
} catch (error) {
  console.error('Firebase initialization error:', error);
  throw new Error('Erreur d\'initialisation de Firebase. Veuillez réessayer.');
}

// Collection names
export const COLLECTIONS = {
  USERS: 'users',
  DOMAINS: 'domains',
  DISPLAYS: 'displays',
  POSTERS: 'posters',
  PUBLICATIONS: 'publications',
  MAINTENANCE_ALERTS: 'maintenanceAlerts',
  MAINTENANCE_CYCLES: 'maintenanceCycles',
  ALERT_SETTINGS: 'alertSettings'
} as const;

// Export initialized services
export { app, auth, db };