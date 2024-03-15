import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDP7AUjDNeIyHApyrD88WI7qbS2OUd0zEU",
  authDomain: "eu-stay90.firebaseapp.com",
  projectId: "eu-stay90",
  storageBucket: "eu-stay90.appspot.com",
  messagingSenderId: "881647858114",
  appId: "1:881647858114:web:19c3ad04c7bd438d9da65b",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { app, db };
