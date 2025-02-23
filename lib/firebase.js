import { initializeApp } from "firebase/app";
import { getDatabase, ref, push, set, get, child } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyA0M3izSlIsD3awirjs8oqZqa6dFxoyTUI",
  authDomain: "pdf-e05f9.firebaseapp.com",
  databaseURL: "https://pdf-e05f9-default-rtdb.firebaseio.com",
  projectId: "pdf-e05f9",
  storageBucket: "pdf-e05f9.appspot.com",
  messagingSenderId: "366520821310",
  appId: "1:366520821310:web:44c050059e46bdc263136f"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db, ref, push, set, get, child };
