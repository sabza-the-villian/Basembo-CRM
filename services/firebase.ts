
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDw3Bp2tM5PwY9ddSnwFr8to5N3Oll4ZN4",
  authDomain: "basembo-capital-crm.firebaseapp.com",
  projectId: "basembo-capital-crm",
  storageBucket: "basembo-capital-crm.firebasestorage.app",
  messagingSenderId: "1014368055092",
  appId: "1:1014368055092:web:0a1c4b9002b256c1673f61",
  measurementId: "G-7X2RSDCB4Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Safely initialize analytics
let analytics: any = null;

if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  }).catch(err => {
    console.warn("Firebase Analytics is not supported in this environment:", err);
  });
}

export { app, analytics };
