import React from "react";
import classes from "../styles/Button.module.scss";
import classNames from "classnames";

type typeOptions = "submit" | "reset" | "button";

interface ButtonProps {
  children?: React.ReactNode;
  variant: "primary" | "secondary";
  className?: string;
  type?: typeOptions;
  disabled?: boolean;
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant,
  className,
  type,
  disabled,
  onClick,
}) => {
  const buttonClass = classNames(classes.button, classes[variant], className);

  return (
    <button
      onClick={onClick}
      className={buttonClass}
      type={type}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
