import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import {
  registerUser,
  signInUser,
  singOutUser,
  currentUser,
} from "./authService";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import {
  getAuth,
  updatePassword,
  updateEmail,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../firebase";
import { db } from "../firebase";
export const queryClient = new QueryClient();

export const userRegister = () => {
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      registerUser(email, password),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["currentUser"] }),
  });
};

export const loginUser = () => {
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      signInUser(email, password),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["currentUser"] }),
  });
};

export const logOut = () => {
  return useMutation({
    mutationFn: () => singOutUser(),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["currentUser"] }),
  });
};

export const useCurrentUser = () =>
  useQuery({
    queryKey: ["currentUser"],
    queryFn: currentUser,
  });

export const sendName = () => {
  return useMutation({
    mutationFn: async ({
      firstName,
      lastName,
      email,
    }: {
      firstName: string;
      lastName: string;
      email: string;
    }) => {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) throw new Error("No authenticated user");
      const userDocRef = doc(db, "UsersName", user.uid);
      await setDoc(
        userDocRef,
        {
          firstName,
          lastName,
          email,
          uid: user.uid,
          createdAt: serverTimestamp(),
        },
        { merge: true }
      );
      console.log(userDocRef);
      return userDocRef;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["currentUser"] }),
    onError: (error) => {
      console.error("sendName mutation failed:", error);
    },
  });
};

interface ChangeEmail {
  oldEmail: string;
  password: string;
  newEmail: string;
}

interface ChangePassword {
  email: string;
  oldPassword: string;
  newPassword: string;
}

export const useChangePassword = () => {
  return useMutation({
    mutationFn: async ({ email, oldPassword, newPassword }: ChangePassword) => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;
        if (!user) throw new Error("No authenticated user");
        const credential = EmailAuthProvider.credential(email, oldPassword);
        await reauthenticateWithCredential(user, credential);
        console.log("email:", email);
        console.log("oldPassword:", oldPassword);
        console.log("newPassword:", newPassword);
        return await updatePassword(user, newPassword);
      } catch (err: any) {
        const message =
          err?.code || err?.message || "auth/password-update-failed";
        throw new Error(message);
      }
    },
  });
};

export function useChangeEmail() {
  return useMutation({
    mutationFn: async ({ oldEmail, password, newEmail }: ChangeEmail) => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;
        if (!user) throw new Error("No authenticated user");
        const credential = EmailAuthProvider.credential(oldEmail, password);
        await reauthenticateWithCredential(user, credential);
        console.log("user.email:", user?.email);
        console.log("password:", password);
        console.log("newEmail:", newEmail);
        return await updateEmail(user, newEmail);
      } catch (err: any) {
        const message = err?.code || err?.message || "auth/email-update-failed";
        throw new Error(message);
      }
    },
  });
}

export function useAvatarAdd() {
  return useMutation({
    mutationFn: async ({ file }: { file: File }) => {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) throw new Error("No authenticated user");
      const storageRef = ref(storage, `images/Avatar/${user.uid}/${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      return { snapshot, downloadURL };
    },
  });
}
