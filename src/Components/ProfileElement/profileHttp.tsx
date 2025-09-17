import { useMutation, useQuery } from "@tanstack/react-query";
import { storage, db, auth } from "../../firebase";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import {
  serverTimestamp,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { queryClient } from "../../Utils/http";

type Item = { id: string; downloadURL: string; storagePath: string };

export const fetchPost = () => {
  const user = auth.currentUser;
  return useMutation({
    mutationFn: async ({ file }: { file: File }) => {
      if (!user) throw new Error("No authenticated user");
      const timestamp = Date.now();
      const storageRef = ref(
        storage,
        `images/Posts/${user.uid}/${timestamp}_${file.name}`
      );
      const snapshot = await uploadBytes(storageRef, file);
      const storagePath = snapshot.ref.fullPath;
      const downloadURL = await getDownloadURL(snapshot.ref);
      await addDoc(collection(db, "posts", user.uid, "items"), {
        storagePath,
        downloadURL,
        uploadedAt: serverTimestamp(),
        ownerUid: user.uid,
      });
      return { snapshot, downloadURL };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["post", user?.uid] });
    },
  });
};

export const useLoadingPost = () => {
  const user = auth.currentUser;
  return useQuery({
    queryKey: ["post", user?.uid],
    enabled: !!user,
    staleTime: 1000 * 60 * 10,
    queryFn: async () => {
      if (!user) throw new Error("No user");
      const postsRef = collection(db, "posts", user.uid, "items"); 
      const snapshot = await getDocs(postsRef);
      const items = snapshot.docs
        .map((d) => ({ id: d.id, downloadURL: d.data().downloadURL, storagePath: d.data().storagePath, }))
        .filter((d): d is Item => typeof d.downloadURL === "string" && typeof d.storagePath === "string");

      return items;
    },
  });
};


export const useRemovePost = () => {
  const user = auth.currentUser;
  return useMutation({
    mutationFn: async ({ id, storagePath }: { id: string; storagePath: string }) => {
      if (!user) throw new Error("No authenticated user");
      
      if (!storagePath) {
        throw new Error("Invalid downloadURL: cannot extract storage path");
      }
      const fileRef = ref(storage, storagePath);
      await deleteObject(fileRef);
      await deleteDoc(doc(db, "posts", user.uid, "items", id));
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["post", user?.uid] });
    },
  });
};
