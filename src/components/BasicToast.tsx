import {
  faX,
  faCheckCircle,
  faExclamationTriangle,
  faInfoCircle,
  faXmarkCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import classNames from "classnames";

import React from "react";
import classes from "../styles/BasicToast.module.scss";

type ToastType = "success" | "error" | "info" | "warning";

interface BasicToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
}

const iconMap: Record<ToastType, IconDefinition> = {
  success: faCheckCircle,
  error: faXmarkCircle,
  info: faInfoCircle,
  warning: faExclamationTriangle,
};

const BasicToast: React.FC<BasicToastProps> = ({ message, type, onClose }) => {
  return (
    <div className={classNames(classes.toast, classes[type])}>
      <FontAwesomeIcon icon={iconMap[type]} className={classes.icon} />
      <span>{message}</span>
      <button onClick={onClose} className={classes.closeButton}>
        <FontAwesomeIcon icon={faX} />
      </button>
    </div>
  );
};

export default BasicToast;
