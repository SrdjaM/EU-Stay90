import React, { createContext, useContext, ReactNode, useState } from "react";
import { v4 as uuid4 } from "uuid";

import ToastContainer from "../components/ToastContainer";

interface ToastContextType {
  addToast: (
    message: string,
    type: "success" | "error" | "info" | "warning"
  ) => void;
}

interface Toast {
  id: string;
  type: "success" | "error" | "info" | "warning";
  message: string;
}

interface ToastProviderProps {
  children: ReactNode;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (
    message: string,
    type: "success" | "error" | "info" | "warning"
  ) => {
    const id = uuid4();
    setToasts((prevToasts) => [...prevToasts, { id, message, type }]);
    setTimeout(() => {
      setToasts((currentToasts) =>
        currentToasts.filter((toast) => toast.id !== id)
      );
    }, 3500);
  };

  const removeToast = (id: string) => {
    setToasts((currentToasts) =>
      currentToasts.filter((toast) => toast.id !== id)
    );
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
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
