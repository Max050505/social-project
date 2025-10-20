import { useQuery } from "@tanstack/react-query";
import { db} from "../firebase";
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
       


          const snapshot = await Promise.all( friendsId.map((friends)=>  getDocs(collection(db, "posts", friends, "items"))))
          const allPosts = snapshot.flatMap(snap =>
            snap.docs.map(doc => ({
              id: doc.id,
              ...doc.data(),
            } as any))
          );
        
        return allPosts.sort((a,b) => (b.uploadedAt?.seconds || 0) - (a.uploadedAt?.seconds || 0));
    },
    enabled: !!user && !loading,
    staleTime: 1000 * 60 * 3,
    refetchOnWindowFocus: false,
  });
  
};
