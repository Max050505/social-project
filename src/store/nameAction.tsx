
import { auth } from '../firebase';
import { setName } from './nameSlice';
import {setEmail} from './emailSlice'
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';


export const fetchName = () => {
  return async (dispatch: any) => {
    const user = auth.currentUser;
    if (!user) return;

    const snapshot = await getDoc(doc(db, 'UsersName', user.uid));
    if (snapshot.exists()) {
      const data = snapshot.data() as { firstName?: string; lastName?: string };
      const fullName = [data.firstName, data.lastName].filter(Boolean).join(' ');
      dispatch(setName(fullName));
    }
  };
};

export const fetchEmail = () => {
    return async (dispatch: any) => {
        const user = auth.currentUser
        if (!user) return;

        const snapshot = await getDoc(doc(db, 'UsersName', user.uid));
        if(snapshot.exists()){
            const data = snapshot.data() as {email?: string};
            const email = data.email ?? '';
            dispatch(setEmail(email));
        }
    }
}
