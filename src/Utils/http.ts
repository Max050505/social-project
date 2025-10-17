import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import {
  registerUser,
  signInUser,
  singOutUser,
  currentUser,
} from "./authService";
import { doc, setDoc, serverTimestamp, getDoc } from "firebase/firestore";
import {
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";
import {
  getDownloadURL,
  listAll,
  ref,
  uploadBytes,
} from "firebase/storage";
import { storage, db, auth } from "../firebase";
import { useDispatch } from "react-redux";
import { setName } from "../store/nameSlice";
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
      const user = auth.currentUser;
      if (!user) throw new Error("No authenticated user");
      const userDocRef = doc(db, "UsersName", user.uid);
      const fullNameToLowerCase = (firstName + ' ' + lastName).toLowerCase();
      await setDoc(
        userDocRef,
        {
          firstName,
          lastName,
          email,
          uid: user.uid,
          createdAt: serverTimestamp(),
          fullNameToLowerCase
        },
        { merge: true }
      );
      return userDocRef;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["currentUser"] }),
    onError: (error) => {
      console.error("sendName mutation failed:", error);
    },
  });
};

interface ChangePassword {
  email: string;
  oldPassword: string;
  newPassword: string;
}

export const useChangePassword = () => {
  return useMutation({
    mutationFn: async ({ email, oldPassword, newPassword }: ChangePassword) => {
      try {
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

interface ChangeName {
  firstName: string;
  lastName: string;
}

export const useChangeName = () => {
  const dispatch = useDispatch();
  return useMutation({
    mutationFn: async ({ firstName, lastName }: ChangeName) => {
      try {
        const user = auth.currentUser;
        if (!user) {
          throw new Error("No authenticated user");
        }
        const userDocRef = doc(db, "UsersName", user.uid);
        await setDoc(userDocRef, { firstName, lastName }, { merge: true });
        return { firstName, lastName };
      } catch (error: any) {
        const message = error?.code || error?.message || "name-update-failed";
        throw new Error(message);
      }
    },
    onSuccess: (data) => {
      console.log("New name:", data); 
      dispatch(setName(data))
    }
  });
};

export function useAvatarAdd() {
   const user = auth.currentUser;
  return useMutation({
    mutationFn: async ({ file }: { file: File }) => {
      if (!user) throw new Error("No authenticated user");
      const timestamp = Date.now();
      const storageRef = ref(
        storage,
        `images/Avatar/${user.uid}/${timestamp}_${file.name}`
      );
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      await setDoc(doc(db, "avatars", user.uid), {  
        downloadURL,
        uploadedAt: serverTimestamp(),
      });
      return { snapshot, downloadURL };
    },
    onSuccess: () => {
     
      queryClient.invalidateQueries({ queryKey: ["avatar", user?.uid] });
    },
  });
}

export function useLoadingAvatar({ userId }: { userId?: string } = {}) {

  const user = auth.currentUser;
  const targetUid = userId || user?.uid;
  return useQuery({
    queryKey: ["avatar", userId || user?.uid],
    staleTime: 1000 * 60 * 5, 
    queryFn: async () => {
      if (!targetUid) throw new Error("No user!");
const docRef = doc(db, "avatars", targetUid);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) return null;

      const data = docSnap.data();
      return `${data.downloadURL}?t=${Date.now()}`;
    },
    enabled: !!auth.currentUser,
  });
}

export async function fetchAvatarByUid(uid: string): Promise<string> {
  const avatarRef = ref(storage, `images/Avatar/${uid}/`);
  const res = await listAll(avatarRef);

  const sortedItems = res.items.sort((a, b) => {
    if (a.name > b.name) return -1;
    if (a.name < b.name) return 1;
    return 0;
  });

  const lastAddedFile = sortedItems[0];
  if (!lastAddedFile) throw new Error("No avatar files found");

  return await getDownloadURL(lastAddedFile);
}
