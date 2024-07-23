import React, { useState } from "react";
import { useToast } from "../contexts/ToastContext";

import Button from "./Button";

interface SaveButtonProps {
  children: React.ReactNode;
  variant: "primary" | "secondary";
  isDisabled: boolean;
  onClick: () => Promise<void>;
  onComplete: () => void;
  onSuccess?: string;
  onError?: string;
}

const SaveButton: React.FC<SaveButtonProps> = ({
  children,
  variant,
  isDisabled,
  onClick,
  onComplete,
  onSuccess,
  onError,
}) => {
  const [loading, setLoading] = useState(false);

  const addToast = useToast();

  const handleClick = async () => {
    setLoading(true);
    try {
      await onClick();
      if (onSuccess) {
        addToast(onSuccess, "success");
      }
      onComplete();
    } catch (error: any) {
      let errorMessage = onError || "An error occured!";
      if (error instanceof Error && error.message) {
        errorMessage += `: ${error.message}`;
      }
      addToast(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant={variant}
      onClick={handleClick}
      disabled={isDisabled || loading}
    >
      {loading ? "Processing..." : children}
    </Button>
  );
};

export default SaveButton;
