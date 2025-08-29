// src/firebase.js
import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD6Eu7myGVxMiy2cJRmBVtMtBszdMNpTrs",
  authDomain: "credito-express-644a6.firebaseapp.com",
  projectId: "credito-express-644a6",
  storageBucket: "credito-express-644a6.appspot.com",
  messagingSenderId: "678450846454",
  appId: "1:678450846454:web:a92c296f486f36b2116ad7"
};

export const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

console.log("WEB projectId =", app.options.projectId);