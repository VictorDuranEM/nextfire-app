import { getApp, initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { collection, DocumentSnapshot, getDocs, getFirestore, limit, query, where } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB62LVYoZ7f8tqCFlXoK1cGpZihgXW5qUY",
  authDomain: "my-first-app-794d7.firebaseapp.com",
  projectId: "my-first-app-794d7",
  storageBucket: "my-first-app-794d7.appspot.com",
  messagingSenderId: "853298624340",
  appId: "1:853298624340:web:59cc6146c0d638bb137ac1",
  measurementId: "G-35BWFBPCRB"
};

function createFirebaseApp(config: any) {
  try {
    return getApp();
  } catch {
    return initializeApp(config);
  }
}

// Initialize Firebase
const firebaseApp = createFirebaseApp(firebaseConfig);

// Auth exports
export const auth = getAuth(firebaseApp);
export const googleAuthProvider = new GoogleAuthProvider();

/**
 * Gets a users/{uid} document with username 
 * @param {string} username 
 * @returns userDoc
 */
export async function getUserWithUsername(username: string) {
  const q = query(
    collection(getFirestore(), 'users'),
    where('username', '==', username),
    limit(1)
  )
  const userDoc = (await getDocs(q)).docs[0];
  return userDoc;
}

/**
 * Converts a firestore document to JSON
 * @param {DocumentSnapshot} doc 
 * @returns JSON
 */
export function postToJSON(doc: DocumentSnapshot) {
  const data = doc.data();
  return {
    ...data,
    // Gotcha! firestore timestamp NOT serializable to JSON. Must convert to milliseconds
    createdAt: data?.createdAt.toMillis() || 0,
    updatedAt: data?.updatedAt.toMillis() || 0,
  };
}