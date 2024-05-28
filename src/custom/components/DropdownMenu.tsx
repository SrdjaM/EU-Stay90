import React, { KeyboardEvent, ReactNode, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition, faEllipsisV } from "@fortawesome/free-solid-svg-icons";

import classes from "../../styles/DropdownMenu.module.scss";

interface DropdownMenuItem {
  icon: IconDefinition;
  text: string;
  action: () => void;
}

interface DropdownMenuProps {
  items: DropdownMenuItem[];
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ items }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleKeyDown = (
    e: KeyboardEvent<HTMLDivElement>,
    action: () => void
  ) => {
    if (e.key === "Enter") {
      action();
    }
  };

  return (
    <div className={classes["dropdown_container"]}>
      <div
        className={classes["dropdown_toggle"]}
        onClick={toggleMenu}
        tabIndex={0}
        onKeyDown={(e) => handleKeyDown(e, toggleMenu)}
      >
        <FontAwesomeIcon icon={faEllipsisV} />
      </div>
      {isOpen && (
        <div className={classes["dropdown_menu"]}>
          {items.map((item, index) => (
            <div
              className={classes["dropdown_item"]}
              key={index}
              onClick={item.action}
              tabIndex={0}
              onKeyDown={(e) => handleKeyDown(e, item.action)}
            >
              <span className={classes["item_text"]}>{item.text}</span>
              <FontAwesomeIcon
                icon={item.icon as any}
                className={classes["dropdown_icon"]}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;
