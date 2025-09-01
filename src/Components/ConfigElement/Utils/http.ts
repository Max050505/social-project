import { EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import { auth } from "../../../firebase";


export async function handleVerify(email: string, password: string): Promise<void> {
    const user = auth.currentUser;
    if (!user) {
        throw new Error("No authenticated user");
    }

    try {
        const credential = EmailAuthProvider.credential(email, password);
        await reauthenticateWithCredential(user, credential);
 
    } catch (err) {
        throw err;
    }
}