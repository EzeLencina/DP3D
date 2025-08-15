// Declaración de tipo para variables de entorno Vite
interface ImportMetaEnv {
  VITE_FIREBASE_API_KEY: string;
}
interface ImportMeta {
  env: ImportMetaEnv;
}
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "cacl3d.firebaseapp.com",
  projectId: "cacl3d",
  storageBucket: "cacl3d.appspot.com",
  messagingSenderId: "1097071640807",
  appId: "1:1097071640807:web:90b84ee5cdb2c12f426242"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
