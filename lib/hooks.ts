import { doc, getFirestore, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase";

export function useUserData() {
  const [user] = useAuthState(auth);
  const [username, setUsername] = useState(null);
  
  useEffect(() => {
    // turn off realtime subscription
    let unsubscribe;

    if (user) {
      const documentRef = doc(getFirestore(), 'users', user.uid);
      unsubscribe = onSnapshot(documentRef, (doc) => {
        setUsername(doc.data()?.username);
      });
    } else {
      setUsername(null);
    }
  }, [user])

  return { user, username };
}