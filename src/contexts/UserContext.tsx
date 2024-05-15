import {
  ReactNode,
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";
import { db, auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

interface UserContexProps {
  children: ReactNode;
}

interface User {
  userId: string;
}

const UserContex = createContext<User | undefined>(undefined);

export const useUser = (): User => {
  const context = useContext(UserContex);
  if (context === undefined) {
    throw new Error("useUser must be used within an UserProvider");
  }
  return context;
};

export const UserProvider = ({ children }: UserContexProps) => {
  const [userId, setUserId] = useState<string>("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        await getDoc(doc(db, "users", authUser.uid));
        const email = authUser.email;
        setUserId(authUser.uid);
      } else {
        setUserId("");
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <UserContex.Provider value={{ userId }}>{children}</UserContex.Provider>
  );
};
