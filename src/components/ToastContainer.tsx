import React, {
  useState,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from "react";
import { v4 as uuidv4 } from "uuid";
import BasicToast from "./BasicToast";

interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info" | "warning";
}

export interface ToastContainerRef {
  addToast: (
    message: string,
    type: "success" | "error" | "info" | "warning"
  ) => void;
}

const ToastContainer = forwardRef<ToastContainerRef>((props, ref) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback(
    (message: string, type: "success" | "error" | "info" | "warning") => {
      const id = uuidv4();
      setToasts((prevToasts) => [...prevToasts, { id, message, type }]);
      setTimeout(() => {
        setToasts((currentToasts) =>
          currentToasts.filter((toast) => toast.id !== id)
        );
      }, 3500);
    },
    []
  );

  useImperativeHandle(ref, () => ({
    addToast,
  }));

  return (
    <div>
      {toasts.map((toast) => (
        <BasicToast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() =>
            setToasts((currentToasts) =>
              currentToasts.filter((t) => t.id !== toast.id)
            )
          }
        />
      ))}
    </div>
  );
});

export default ToastContainer;
