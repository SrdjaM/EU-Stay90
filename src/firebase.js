import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyANlTOVpWHfpcXWlS-D2hTxY-PxvlKSO9c",
  authDomain: "eu-stay90-91880.firebaseapp.com",
  projectId: "eu-stay90-91880",
  storageBucket: "eu-stay90-91880.appspot.com",
  messagingSenderId: "711001072597",
  appId: "1:711001072597:web:04f19f63bc93395ce6d35c"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };
