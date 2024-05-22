import { faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import React from "react";
import classNames from "classnames";
import classes from "../styles/BasicToast.module.scss";

interface ToastProps {
  message: string;
  type: string;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  return (
    <div className={classNames(classes.toast, classes[type])}>
      <span>{message}</span>
      <button onClick={onClose} className={classes.closeButton}>
        <FontAwesomeIcon icon={faX} />
      </button>
    </div>
  );
};

export default Toast;
