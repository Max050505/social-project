import { auth } from "../firebase";
import { setFirstName, setLastName } from "./nameSlice";
import { setEmail } from "./emailSlice";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

export const fetchName = (userId?: string) => {
  return async (dispatch: any) => {
    const currentUser = auth.currentUser;
    const targetUid = userId || currentUser?.uid;
    if (!targetUid) return;

    const snapshot = await getDoc(doc(db, "UsersName", targetUid));
    if (snapshot.exists()) {
      const data = snapshot.data() as {
        firstName?: string;
        lastName?: string;
        email: string;
      };

      if (!userId) {
        if (data.firstName) {
          dispatch(setFirstName(data.firstName));
        }
        if (data.lastName) {
          dispatch(setLastName(data.lastName));
        }
        if (data.email) {
          dispatch(setEmail(data.email));
        }
      }
      return {
        firstName: data.firstName || '',
        lastName: data.lastName || '',
      }
    }
    return null;
  };
};
