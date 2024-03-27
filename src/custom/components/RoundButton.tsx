import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classes from "../../styles/RoundButton.module.scss";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

interface RoundButtonProps {
  onButtonClick: () => void;
  icon: IconProp;
  ariaLabel: string;
  className?: string;
}

const RoundButton: React.FC<RoundButtonProps> = ({
  onButtonClick,
  icon,
  ariaLabel,
  className,
}) => {
  return (
    <button
      onClick={onButtonClick}
      className={`${classes["btn-round"]} ${className}`}
      aria-label={ariaLabel}
    >
      <FontAwesomeIcon icon={icon} />
    </button>
  );
};

export default RoundButton;
