import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { app } from "../../firebase";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { useAuth } from "../../contexts/AuthContext";

interface AuthData {
  email: string;
  password: string;
  username?: string;
}

export const useAuthentication = () => {
  const { login } = useAuth();

  const signIn = async (data: AuthData, onSuccess: () => void) => {
    try {
      const auth = getAuth(app);
      const userCredentials = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      const token = await userCredentials.user.getIdToken();
      login(token);
      onSuccess();
    } catch (error: any) {
      throw new Error(error.code);
    }
  };

  const signUp = async (data: AuthData, onSuccess: () => void) => {
    try {
      const auth = getAuth(app);
      await createUserWithEmailAndPassword(auth, data.email, data.password);
      await addDoc(collection(db, "users"), {
        username: data.username,
        email: data.email,
        password: data.password,
      });
      onSuccess();
    } catch (error: any) {
      throw Error(error.code);
    }
  };

  return { signIn, signUp };
};
