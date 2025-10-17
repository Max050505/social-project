import { useQuery } from "@tanstack/react-query";
import { db, auth } from "../firebase";
import { useAuthUser } from "./authService";
import {
  getDocs,
  collection,
} from "firebase/firestore";

export const useGetFriendsPosts = () => {
  const {user, loading} = useAuthUser();
  
  return useQuery({
    queryKey: ["authorAndPost", user?.uid],
    queryFn: async () => {
      if (!user) throw new Error("No authenticated user");
        const friendsDoc = await getDocs(
          collection(db, "friendsFolder", user.uid, "friends")
        );

        const friendsId = friendsDoc.docs.map((snapFriend) => {
          const data = snapFriend.data();
          if(data.fromId === user.uid) return data.toId as string;
          if(data.toId === user.uid) return data.fromId as string;
          return null;
        }).filter(Boolean) as string[];
        if (friendsId.length === 0) return [];
        console.log('friend:', friendsId)
        const allPosts: any[] = [];

        for (const fid of friendsId) {
          const postsRef = collection(db, 'posts', fid, 'items');
          const snapshot = await getDocs(postsRef);
          snapshot.forEach((doc) => allPosts.push({id: doc.id, ...doc.data()}));
          
        }
        
        console.log('allpost:',allPosts)
        return allPosts.sort((a,b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
    },
    enabled: !!user || !!loading,
    staleTime: 1000 * 60 * 3,

  });
  
};
