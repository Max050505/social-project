import { useMutation, useQuery } from "@tanstack/react-query";
import { storage, db, auth } from "../firebase";
import { fetchName } from "../store/nameAction";
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
  getDoc,
  deleteDoc,
  doc,
  setDoc,
  collectionGroup,
  updateDoc,
  increment,
} from "firebase/firestore";
import { queryClient } from "./http";

type Item = { id: string; downloadURL: string; storagePath: string; ownerUid: string; likesCount: number };

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
      const snapAvatar = await getDoc(doc(db, 'avatars', user.uid)) ;
      const snapAuthorFullName = await getDoc(doc(db, "UsersName", user.uid)) ;
      const avatar = snapAvatar.data();
      const authorFullName = snapAuthorFullName.data();
      const storagePath = snapshot.ref.fullPath;
      const downloadURL = await getDownloadURL(snapshot.ref);
      await addDoc(collection(db, "posts", user.uid, "items"), {
        avatar: avatar?.downloadURL,
        authorFullName: authorFullName?.fullNameToLowerCase,
        storagePath,
        downloadURL,
        uploadedAt: serverTimestamp(),
        ownerUid: user.uid,
        likesCount: 0,
      });
      return { snapshot, downloadURL };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["post", user?.uid] });
    },
  });
};

export const useLoadingPost = ({userId}: {userId?: string}) => {
  const user = auth.currentUser;
  const targetUid = userId || user?.uid;
  return useQuery({
    queryKey: ["user-post", targetUid],
    enabled: !!targetUid,
    staleTime: 1000 * 60 * 10,
    queryFn: async () => {
      if (!targetUid) throw new Error("No user");
      const postsRef = collection(db, "posts", targetUid, "items");
      const snapshot = await getDocs(postsRef);
      const items = snapshot.docs
        .map((d) => ({
          id: d.id,
          downloadURL: d.data().downloadURL,
          storagePath: d.data().storagePath,
          ownerUid: d.data().ownerUid,
          likesCount: d.data().likesCount || 0,
        }))
        .filter(
          (d): d is Item =>
            typeof d.downloadURL === "string" &&
            typeof d.storagePath === "string" &&
            typeof d.ownerUid === "string" &&
            typeof d.likesCount === 'number'
        );
      console.log("items:", items.length);
      return items;
    },
  });
};

export const useRemovePost = () => {
  return useMutation({
    mutationFn: async ({
      id,
      storagePath,
    }: {
      id: string;
      storagePath: string;
    }) => {
      const user = auth.currentUser;
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
      queryClient.invalidateQueries({ queryKey: ["user-post"] });
    },
  });
};

export const useFetchLike = () => {
  return useMutation({
    mutationFn: async ({
      postId,
      ownerUid,
    }: {
      postId: string;
      ownerUid: string;
    }) => {
      const user = auth.currentUser;
      if (!user) throw new Error("No authenticated user");
      const userDocRef = doc(db, "posts", postId, "likes", user.uid);
      await setDoc(userDocRef, { likedAt: serverTimestamp() });
      const postRef = doc(db, "posts", ownerUid, "items", postId);
      await updateDoc(postRef, { likesCount: increment(1) });
      return {postId, ownerUid};
    },
    onMutate: async ({postId, ownerUid}) => {
      await queryClient.cancelQueries({
        queryKey: ["user-likes", auth.currentUser?.uid],
      });
      await queryClient.cancelQueries({
        queryKey: ["likes-count", postId, ownerUid],
      });
      await queryClient.cancelQueries({
        queryKey: ["user-post"],
      });
      const prevLikes = queryClient.getQueryData([
        "user-likes",
        auth.currentUser?.uid,
      ]);
      const prevLikesCount = queryClient.getQueryData<number>([
          'likes-count', postId, ownerUid
      ]);
      const prevPosts = queryClient.getQueryData<Item[]>(["user-post"]);
      
      queryClient.setQueryData(
        ["user-likes", auth.currentUser?.uid],
        (old: any[] = []) => [...old, postId]
      );
      queryClient.setQueryData<number>(['likes-count', postId, ownerUid],
      (prevLikesCount ?? 0) + 1
      );
      
    // Optimistically update the posts list
      queryClient.setQueryData<Item[]>(["user-post"], (old = []) =>
        old.map(post => 
          post.id === postId 
            ? { ...post, likesCount: post.likesCount + 1 }
            : post
        )
      );
      
      return { prevLikes, prevLikesCount, prevPosts };
    },
    onError: (error, _postId, context) => {
      if (context?.prevLikes) {
        queryClient.setQueryData(
          ["user-likes", auth.currentUser?.uid],
          (context as any).prevLikes
        );
      }
      if (context?.prevPosts) {
        queryClient.setQueryData(
          ["user-post"],
          (context as any).prevPosts
        );
      }
      console.error("sendName mutation failed:", error);
    },
    onSuccess: ({postId, ownerUid}) =>{

      queryClient.invalidateQueries({ queryKey: ['likes-count', postId, ownerUid]});
      queryClient.invalidateQueries({
        queryKey: ["user-likes", auth.currentUser?.uid],
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["user-likes", auth.currentUser?.uid],
      });
    },
  });
};

export const useRemoveLike = () => {
  return useMutation({
    mutationFn: async ({
      postId,
      ownerUid,
    }: {
      postId: string;
      ownerUid: string;
    }) => {
      const user = auth.currentUser;
      if (!user) throw new Error("No authenticated user");
      const likeRef = doc(db, "posts", postId, "likes", user.uid);
      await deleteDoc(likeRef);
      const postRef = doc(db, "posts", ownerUid, "items", postId);
      await updateDoc(postRef, { likesCount: increment(-1) });
      return {postId, ownerUid};
    },
    onMutate: async ({postId, ownerUid}) => {
      await queryClient.cancelQueries({
        queryKey: ["user-likes", auth.currentUser?.uid],
      });
      await queryClient.cancelQueries({
        queryKey: ["likes-count", postId, ownerUid],
      });
      await queryClient.cancelQueries({
        queryKey: ["user-post"],
      });
      const prevLikes = queryClient.getQueryData([
        "user-likes",
        auth.currentUser?.uid,
      ]);
      const prevLikesCount = queryClient.getQueryData<number>(['likes-count', postId, ownerUid]);
      const prevPosts = queryClient.getQueryData<Item[]>(["user-post"]);
      
      queryClient.setQueryData<string[]>(["user-likes", auth.currentUser?.uid], old => (old ?? []).filter(id => id !== postId));

      queryClient.setQueryData<number>(['likes-count', postId, ownerUid],
        Math.max((prevLikesCount ?? 0) - 1, 0)
      );
      
      // Optimistically update the posts list
      queryClient.setQueryData<Item[]>(["user-post"], (old = []) =>
        old.map(post => 
          post.id === postId 
            ? { ...post, likesCount: Math.max(post.likesCount - 1, 0) }
            : post
        )
      );
      
      return { prevLikes, prevLikesCount, prevPosts };
    },
    onError: (error, _postId, context) => {
      if (context?.prevLikes) {
        queryClient.setQueryData(
          ["user-likes", auth.currentUser?.uid],
          (context as any).prevLikes
        );
      }
      if (context?.prevPosts) {
        queryClient.setQueryData(
          ["user-post"],
          (context as any).prevPosts
        );
      }
      console.error("sendName mutation failed:", error);
    },
    onSuccess: ({postId, ownerUid}) =>{
      queryClient.invalidateQueries({ queryKey: ['likes-count', postId, ownerUid]});
      queryClient.invalidateQueries({
        queryKey: ["user-likes", auth.currentUser?.uid],
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["user-likes", auth.currentUser?.uid],
      });
    },
  });
};

export const useIsPostLiked = (postId: string) => {
  const user = auth.currentUser;
  return useQuery({
    queryKey: ["user-like", postId, user?.uid],
    enabled: Boolean(postId && user),
    queryFn: async () => {
      if (!user) throw new Error("No authenticated user");
      const likeRef = doc(db, "posts", postId, "likes", user.uid);
      const likeSnap = await getDoc(likeRef);
      return likeSnap.exists();
    },
  });
};

export const useUserLikedPostIds = () => {
  const user = auth.currentUser;

  return useQuery({
    queryKey: ["user-likes", user?.uid],
    enabled: !!user,
    queryFn: async () => {
      if (!user) throw new Error("No authenticated user");

      const likeSnap = await getDocs(collectionGroup(db, "likes"));
      return likeSnap.docs
        .filter((doc) => doc.id === user.uid)
        .map((doc) => doc.ref.parent.parent?.id) as string[];
    },
  });
};

export const useGetLikesCount = (postId?: string, ownerUid?: string) => {
  return useQuery({
    queryKey: ["likes-count", postId, ownerUid],
    enabled: Boolean(postId && ownerUid),
    queryFn: async () => {
      if (!postId || !ownerUid) return 0;
      const likeRef = doc(db, "posts", ownerUid, "items", postId);
      const postSnap = await getDoc(likeRef);

      if (postSnap.exists()) {
        return Number(postSnap.data().likesCount) || 0;
      }

      return 0;
    },
    refetchOnWindowFocus: false,
    
  });
  
};


export const useGetOtherName = (userId?: string) => {
  return useQuery({
    queryKey:["other-name", userId],
    queryFn: async () => {
      const thunk = fetchName(userId);
      const result = await thunk(() => {});
      return result ?? { firstName: '', lastName: '' };
    },
    enabled: !!userId,
    
  })
}
