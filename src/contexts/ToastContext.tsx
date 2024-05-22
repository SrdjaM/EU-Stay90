// contexts/ToastContext.tsx
import React, { createContext, useContext, useRef, ReactNode } from "react";
import ToastContainer, {
  ToastContainerRef,
} from "../components/ToastContainer";

interface ToastContextType {
  addToast: (
    message: string,
    type: "success" | "error" | "info" | "warning"
  ) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const toastRef = useRef<ToastContainerRef>(null);

  const addToast = (
    message: string,
    type: "success" | "error" | "info" | "warning"
  ) => {
    toastRef.current?.addToast(message, type);
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <ToastContainer ref={toastRef} />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context.addToast;
};
