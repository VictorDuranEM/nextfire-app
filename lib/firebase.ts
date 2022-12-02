import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB62LVYoZ7f8tqCFlXoK1cGpZihgXW5qUY",
  authDomain: "my-first-app-794d7.firebaseapp.com",
  projectId: "my-first-app-794d7",
  storageBucket: "my-first-app-794d7.appspot.com",
  messagingSenderId: "853298624340",
  appId: "1:853298624340:web:59cc6146c0d638bb137ac1",
  measurementId: "G-35BWFBPCRB"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(firebaseApp);
export const firestore = getFirestore(firebaseApp);

export default firebaseApp;