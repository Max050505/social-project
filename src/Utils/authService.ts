import { auth } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onIdTokenChanged,
  onAuthStateChanged,
} from "firebase/auth";

export const registerUser = async (email: string, password: string) => {
  return await createUserWithEmailAndPassword(auth, email, password);
};

export const signInUser = async (email: string, password: string) => {
  return await signInWithEmailAndPassword(auth, email, password);
};

export const singOutUser = async () => {
  return await signOut(auth);
};

export const callIdTokenChange = () =>
  onIdTokenChanged(auth, async (user) => {
    if (user) {
      const token = await user.getIdToken();
      localStorage.setItem("token", token);
      console.log("creacted token:", token);
    } else {
      localStorage.removeItem("token");
      console.log("removed token");
    }
  });

export const currentUser = async (): Promise<null | {
  uid: string;
  email: string | null;
}> => {
  return await new Promise((resolve) => {
    const unsub = onAuthStateChanged(auth, (user) => {
      unsub();
      if (user) {
        resolve({ uid: user.uid, email: user.email });
      } else {
        resolve(null);
      }
    });
  });
};
