import { useMutation, useQuery } from "@tanstack/react-query";
import { storage, db, auth } from "../firebase";
import { fetchName } from "../store/nameAction";
import { useAuthUser } from "./authService";
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

  updateDoc,
  increment,
 
} from "firebase/firestore";
import { queryClient } from "./http";

type Item = {
  id: string;
  downloadURL: string;
  storagePath: string;
  ownerUid: string;
  likesCount: number;
  uploadedAt: { seconds: number; nanoseconds: number };
};
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
      const snapAvatar = await getDoc(doc(db, "avatars", user.uid));
      const snapAuthorFullName = await getDoc(doc(db, "UsersName", user.uid));
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
      queryClient.invalidateQueries({ queryKey: ["user-post", user?.uid] });
    },
  });
};

export const useLoadingPost = ({ userId }: { userId?: string }) => {
  const { user, loading } = useAuthUser();

  const targetUid = userId || user?.uid;
  return useQuery({
    queryKey: ["user-post", targetUid],
    enabled: !!targetUid && !loading,
    staleTime: 1000 * 60 * 10,
    queryFn: async () => {
      if (!targetUid) throw new Error("No user");
      const postsRef = collection(db, "posts", targetUid, "items");
      const snapshot = await getDocs(postsRef);
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Item[];
    },
    select: (posts) =>
      posts.sort(
        (a, b) => (b.uploadedAt.seconds || 0) - (a.uploadedAt.seconds || 0)
      ),
    refetchOnWindowFocus: false,
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
      const likeRef = doc(
        db,
        "posts",
        ownerUid,
        "items",
        postId,
        "likes",
        user.uid
      );
      const likeSnap = await getDoc(likeRef);
      if (!likeSnap.exists()) {
        await setDoc(likeRef, { likedAt: serverTimestamp(), userId: user.uid });
        const postRef = doc(db, "posts", ownerUid, "items", postId);
        await updateDoc(postRef, { likesCount: increment(1) });
      }
      return { postId, ownerUid };
    },
    onMutate: async ({ postId, ownerUid }) => {
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
        "likes-count",
        postId,
        ownerUid,
      ]);
      const prevPosts = queryClient.getQueryData<Item[]>(["user-post"]);

      queryClient.setQueryData(
        ["user-likes", auth.currentUser?.uid],
        (old: string[] = []) =>
          old.includes(postId) ? old : [...old, postId]
      );
      queryClient.setQueryData<number>(
        ["likes-count", postId, ownerUid],
        (prevLikesCount ?? 0) + 1
      );

      // Optimistically update the posts list
      queryClient.setQueryData<Item[]>(["user-post"], (old = []) =>
        old.map((post) =>
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
        queryClient.setQueryData(["user-post"], (context as any).prevPosts);
      }
      console.error("sendName mutation failed:", error);
    },
    onSuccess: ({ postId, ownerUid }) => {
      queryClient.invalidateQueries({
        queryKey: ["likes-count", postId, ownerUid],
        refetchType: "active",
      });
      queryClient.invalidateQueries({
        queryKey: ["user-like", postId, ownerUid],
        refetchType: "active",
      });
      queryClient.invalidateQueries({
        queryKey: ["user-likes", auth.currentUser?.uid],
        refetchType: "active",
      });
      queryClient.invalidateQueries({
        queryKey: ["user-post"],
        refetchType: "active",
      });
      queryClient.invalidateQueries({
        queryKey: ["authorAndPost"],
        refetchType: "active",
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
      const likeRef = doc(
        db,
        "posts",
        ownerUid,
        "items",
        postId,
        "likes",
        user.uid
      );
      const likeSnap = await getDoc(likeRef);
      if (likeSnap.exists()) {
        await deleteDoc(likeRef);
        const postRef = doc(db, "posts", ownerUid, "items", postId);
        await updateDoc(postRef, { likesCount: increment(-1) });
      }
      return { postId, ownerUid };
    },
    onMutate: async ({ postId, ownerUid }) => {
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
        "likes-count",
        postId,
        ownerUid,
      ]);
      const prevPosts = queryClient.getQueryData<Item[]>(["user-post"]);

      queryClient.setQueryData<string[]>(
        ["user-likes", auth.currentUser?.uid],
        (old) => (old ?? []).filter((id) => id !== postId)
      );

      queryClient.setQueryData<number>(
        ["likes-count", postId, ownerUid],
        Math.max((prevLikesCount ?? 0) - 1, 0)
      );

      // Optimistically update the posts list
      queryClient.setQueryData<Item[]>(["user-post"], (old = []) =>
        old.map((post) =>
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
        queryClient.setQueryData(["user-post"], (context as any).prevPosts);
      }
      console.error("sendName mutation failed:", error);
    },
    onSuccess: ({ postId, ownerUid }) => {
      queryClient.invalidateQueries({
        queryKey: ["likes-count", postId, ownerUid],
        refetchType: "active",
      });
      queryClient.invalidateQueries({
        queryKey: ["user-like", postId, ownerUid],
        refetchType: "active",
      });
      queryClient.invalidateQueries({
        queryKey: ["user-likes", auth.currentUser?.uid],
        refetchType: "active",
      });
      queryClient.invalidateQueries({
        queryKey: ["user-post"],
        refetchType: "active",
      });
      queryClient.invalidateQueries({
        queryKey: ["authorAndPost"],
        refetchType: "active",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["user-likes", auth.currentUser?.uid],
      });
    },
  });
};

export const useIsPostLiked = (postId: string, ownerUid: string) => {
  const { user, loading } = useAuthUser();

  return useQuery({
    queryKey: ["user-like", postId, ownerUid, user?.uid],
    enabled: Boolean(postId && ownerUid && user) && !loading,
    queryFn: async () => {
      if (!user) throw new Error("No authenticated user");
      const likeRef = doc(db, "posts", ownerUid, "items", postId, "likes", user.uid);
      const likeSnap = await getDoc(likeRef);
      return likeSnap.exists();
    },
    staleTime: 1000 * 60 * 2,
    refetchOnWindowFocus: false,
  });
};

export const useUserLikedPostIds = () => {
  const { user, loading } = useAuthUser();

  return useQuery({
    queryKey: ["user-likes", user?.uid],
    enabled: !!user && !loading,
    queryFn: async () => {
      if (!user) throw new Error("No authenticated user");
      return [] as string[];
    },
    staleTime: 1000 * 60 * 2,
    refetchOnWindowFocus: false,
  });
};

export const useGetLikesCount = (postId?: string, ownerUid?: string) => {
  const { loading } = useAuthUser();
  return useQuery({
    queryKey: ["likes-count", postId, ownerUid],
    enabled: Boolean(postId && ownerUid) && !loading,
    queryFn: async () => {
      if (!postId || !ownerUid) return 0;
      const likeRef = doc(db, "posts", ownerUid, "items", postId);
      const postSnap = await getDoc(likeRef);

      if (postSnap.exists()) {
        return Number(postSnap.data().likesCount) || 0;
      }

      return 0;
    },
    staleTime: 1000 * 60 * 2,
    refetchOnWindowFocus: false,
  });
};

export const useGetOtherName = (userId?: string) => {
  const { loading } = useAuthUser();
  return useQuery({
    queryKey: ["other-name", userId],
    queryFn: async () => {
      const thunk = fetchName(userId);
      const result = await thunk(() => {});
      return result ?? { firstName: "", lastName: "" };
    },
    staleTime: 1000 * 60 * 2,
    refetchOnWindowFocus: false,
    enabled: !!userId && !loading,
  });
};
