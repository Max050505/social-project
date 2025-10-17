import { useQuery } from "@tanstack/react-query";
import { auth, db } from "../../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

type SearchPerson = {
  id:string,
  firstName: string,
  lastName: string,
}

export const useSearchName = (searchResult: string) => {
  const user = auth.currentUser;
  return useQuery({
    queryKey: ["search-name", user?.uid, searchResult],
    enabled: !!user?.uid && searchResult.length > 0,
    queryFn: async () => {
      if (!user) throw new Error("No authenticated user");
      const userRef = collection(db, "UsersName");
 
      const queryName = query(
        userRef,
        where("fullNameToLowerCase", ">=", searchResult),
        where("fullNameToLowerCase", "<=", searchResult + "\uf8ff")
      );
      const snaps = await getDocs(queryName);
      const result = snaps.docs.map((doc) => {
        const data: any = doc.data();
        if (!data?.firstName || !data?.lastName) return null;
        return {
          id: doc.id,
          firstName: data.firstName,
          lastName: data.lastName,
        };
      });
      return result.filter((item): item is SearchPerson => item !== null); 
    },
  });
};
