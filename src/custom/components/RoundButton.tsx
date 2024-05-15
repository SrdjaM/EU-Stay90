import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classes from "../../styles/RoundButton.module.scss";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import classNames from "classnames";

interface RoundButtonProps {
  onButtonClick: () => void;
  icon: IconProp;
  ariaLabel: string;
  className?: string;
  iconStyle?: string;
}

const RoundButton: React.FC<RoundButtonProps> = ({
  onButtonClick,
  icon,
  ariaLabel,
  className,
  iconStyle,
}) => {
  const buttonClasses = classNames(classes["btn-round"], className);
  return (
    <button
      onClick={onButtonClick}
      className={buttonClasses}
      aria-label={ariaLabel}
    >
      <FontAwesomeIcon icon={icon} className={iconStyle} />
    </button>
  );
};

export default RoundButton;
