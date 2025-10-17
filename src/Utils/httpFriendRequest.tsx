import { useMutation, useQuery } from "@tanstack/react-query";
import { auth, db } from "../firebase";
import {
  doc,
  setDoc,
  getDoc,
  collection,
  getDocs,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { queryClient } from "./http";
import { message } from "antd";

export const useSendRequestToFriend = ({
  messageApi,
}: {
  messageApi?: any;
}) => {
  const user = auth.currentUser;
  return useMutation({
    mutationFn: async ({ userId }: { userId: string }) => {
      if (!user) throw new Error("no authenticated user!");
      const sentRef = doc(db, "friendRequest", user.uid, "sent", userId);
      const receivedRef = doc(
        db,
        "friendRequest",
        userId,
        "received",
        user.uid
      );
      const friendRef = doc(db, "friendsFolder", user.uid, "friends", userId);
      const friendSnap = await getDoc(friendRef);
      if (friendSnap.exists()) throw new Error("You are already friends");
      const existingSent = await getDoc(sentRef);
      const existingReceived = await getDoc(receivedRef);
      if (existingSent.exists() || existingReceived.exists()) {
        throw new Error("Friend request already sent!");
      }
      const fromId = user.uid;
      const fromUserSnap = await getDoc(doc(db, "UsersName", user.uid));
      const fromUser = fromUserSnap.data();
      const fromUserAvatarSnap = await getDoc(doc(db, "avatars", user.uid));
      const fromUserAvatar = fromUserAvatarSnap.data();
      const toId = userId;
      const toUserSnap = await getDoc(doc(db, "UsersName", userId));
      const toUser = toUserSnap.data();
      const toUserAvatarSnap = await getDoc(doc(db, "avatars", userId));
      const toUserAvatar = toUserAvatarSnap.data();

      const data = {
        fromId: fromId,
        fromName: fromUser?.fullNameToLowerCase || "",
        fromAvatar: fromUserAvatar?.downloadURL || "",
        toId: toId,
        toName: toUser?.fullNameToLowerCase || "",
        toAvatar: toUserAvatar?.downloadURL || "",
        date: serverTimestamp(),
      };

      await Promise.all([
        setDoc(sentRef, data, { merge: true }),
        setDoc(receivedRef, data, { merge: true }),
      ]);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["requestedFriend", user?.uid]  });
      messageApi?.success("Friend request sent.");
    },
    onError: (error: any) => {
      messageApi?.error(error.message || "Sending went wrong");
    },
  });
};

export const useSendToFriends = () => {
  const user = auth.currentUser;
  return useMutation({
    mutationFn: async ({ userId }: { userId: string }) => {
      if (!user) throw new Error("no authenticated user!");
      const ref = doc(db, "friendsFolder", user.uid, "friends", userId);
      const ref1 = doc(db, "friendsFolder", userId, "friends", user.uid);
      const fromId = user.uid;
      const fromUserSnap = await getDoc(doc(db, "UsersName", user.uid));
      const fromUser = fromUserSnap.data();
      const fromUserAvatarSnap = await getDoc(doc(db, "avatars", user.uid));
      const fromUserAvatar = fromUserAvatarSnap.data();
      const toId = userId;
      const toUserSnap = await getDoc(doc(db, "UsersName", userId));
      const toUser = toUserSnap.data();
      const toUserAvatarSnap = await getDoc(doc(db, "avatars", userId));
      const toUserAvatar = toUserAvatarSnap.data();
      const friendData = {
        fromId: fromId,
        fromName: fromUser?.fullNameToLowerCase || "",
        fromAvatar: fromUserAvatar?.downloadURL || "",
        toId: toId,
        toName: toUser?.fullNameToLowerCase || "",
        toAvatar: toUserAvatar?.downloadURL || "",
        date: serverTimestamp(),
      };
      await Promise.all([
        deleteDoc(doc(db, "friendRequest", user.uid, "sent", userId)),
        deleteDoc(doc(db, "friendRequest", userId, "received", user.uid)),
      ]);
      await Promise.all([
        setDoc(ref, friendData, { merge: true }),
        setDoc(ref1, friendData, { merge: true }),
      ]);
      return toId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sendToFriend", user?.uid] });
      queryClient.invalidateQueries({ queryKey: ["friend", user?.uid] });
      queryClient.invalidateQueries({ queryKey: ["authorAndPost", user?.uid] });
      message.success("Friend request sent.");
    },
    onError: (error: any) => {
      message.error(error.message || "Sending went wrong");
    },
  });
};

export const useGetFromRequestUser = ({ userId }: { userId: string }) => {
  const user = auth.currentUser;
  return useQuery({
    queryKey: ["requestedFriend", user?.uid, userId],
    enabled: !!user,
    queryFn: async () => {
      if (!user) throw new Error("no authenticated user!");
      const ref = collection(db, "friendRequest", user?.uid, "received");
      const snap = await getDocs(ref);
      const users = snap.docs.map((user) => ({
        id: user.data().fromId,
        name: user.data().fromName,
        avatar: user.data().fromAvatar,
      }));
      return users;
    },
  });
};

export const useGetFriendsUser = ({ userId }: { userId: string }) => {
  const user = auth.currentUser;
  return useQuery({
    queryKey: ["friend", user?.uid, userId],
    enabled: !!user,
    queryFn: async () => {
      if (!user) throw new Error("no authenticated user!");
      const refFriend = collection(db, "friendsFolder", user.uid, "friends");
      const snapFriend = await getDocs(refFriend);
      const friends = snapFriend.docs.map((friend) => {
        const data = friend.data();
        const itsMe = data.fromId === user.uid;
      
      return{
        id: itsMe ? data.toId : data.fromId,
        name: itsMe ? data.toName : data.fromName,
        avatar: itsMe ? data.toAvatar : data.fromAvatar,

      }
      });
      return friends;
    },
  });
};

export const useGetSentFriendRequests = () => {
  const user = auth.currentUser;
  return useQuery({
    queryKey: ["requestedFriend", user?.uid],
    enabled: !!user,
    queryFn: async () => {
      if (!user) throw new Error("no authenticated user!");
      const ref = collection(db, "friendRequest", user?.uid, "sent");
      const snap = await getDocs(ref);
      const users = snap.docs.map((user) => ({
        id: user.data().toId,
        name: user.data().toName,
        avatar: user.data().toAvatar,
      }));
      return users;
    },
  });
};

export const useRemoveRequestToFriends = () => {
  const user = auth.currentUser;
  if (!user) throw new Error("no authenticated user!");
  return useMutation({
    mutationFn: async (userId: string) => {
      const sentRef = doc(db, "friendRequest", user.uid, "sent", userId);
      const receivedRef = doc(
        db,
        "friendRequest",
        userId,
        "received",
        user.uid
      );
      await Promise.all([deleteDoc(sentRef), deleteDoc(receivedRef)]);
      return userId;
    },
    onSuccess: (userId) => {
      queryClient.setQueryData<any>(
        ["requestedFriend", user?.uid],
        (oldData: any) => {
          if (!oldData) return [];
          return oldData.filter((user: any) => user.id !== userId);
        }
      );
      message.success("Removed from requests.");
    },
    onError: (error: any) => {
      message.error(error.message || "Removing went wrong");
    },
  });
};
export const useRemoveFromFriends = () => {
  const user = auth.currentUser;
  return useMutation({
    mutationFn: async (userId: string) => {
      if (!user) throw new Error("no authenticated user!");
      const myRef = doc(db, "friendsFolder", user.uid, "friends", userId);
      const freindRef = doc(db, "friendsFolder", userId, "friends", user.uid);
      await Promise.all([deleteDoc(myRef), deleteDoc(freindRef)]);
      return userId;
    },
    onSuccess: (userId) => {
      queryClient.setQueryData<any>(
        ["friend", user?.uid, userId],
        (oldFriend: any) => {
          if (!oldFriend) return [];
          return oldFriend.filter((user: any) => user.id !== userId);
        }
      );
      queryClient.invalidateQueries({ queryKey: ["authorAndPost", user?.uid] });
      message.success("Removed from friend.");
    },
    onError: (error: any) => {
      message.error(error.message || "Removing went wrong");
    },
  });
};
