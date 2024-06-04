import React, { useEffect, useState, useRef, KeyboardEvent } from "react";
import { createPortal } from "react-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition, faEllipsisV } from "@fortawesome/free-solid-svg-icons";

import { Position } from "../../common/enums/Position";
import classes from "../../styles/DropdownMenu.module.scss";

interface DropdownMenuItem {
  icon: IconDefinition;
  text: string;
  action: () => void;
}

interface DropdownMenuProps {
  items: DropdownMenuItem[];
  isOpen: boolean;
  onToggle: () => void;
  position: Position;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({
  items,
  isOpen,
  onToggle,
  position,
}) => {
  const toggleRef = useRef<HTMLDivElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const [style, setStyle] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (isOpen && toggleRef.current && menuRef.current) {
      const toggleRect = toggleRef.current.getBoundingClientRect();
      const menuRect = menuRef.current.getBoundingClientRect();

      let top = 0;
      let left = 0;

      switch (position) {
        case Position.TopLeft:
          top = toggleRect.top - menuRect.height;
          left = toggleRect.left - menuRect.width;
          break;
        case Position.TopRight:
          top = toggleRect.top - menuRect.height;
          left = toggleRect.right;
          break;
        case Position.BottomLeft:
          top = toggleRect.bottom;
          left = toggleRect.left - menuRect.width;
          break;
        case Position.BottomRight:
          top = toggleRect.bottom;
          left = toggleRect.right;
          break;
        default:
          break;
      }

      setStyle({ top, left });
    }
  }, [isOpen, position]);

  const handleKeyDown = (
    e: KeyboardEvent<HTMLDivElement>,
    action: () => void
  ) => {
    if (e.key === "Enter") {
      action();
    }
  };

  const dropdownMenu = (
    <div
      className={classes["dropdown_menu"]}
      ref={menuRef}
      style={{ top: style.top, left: style.left }}
    >
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
  );

  return (
    <div className={classes["dropdown_container"]}>
      <div
        ref={toggleRef}
        className={classes["dropdown_toggle"]}
        onClick={onToggle}
        tabIndex={0}
        onKeyDown={(e) => handleKeyDown(e, onToggle)}
      >
        <FontAwesomeIcon icon={faEllipsisV} />
      </div>
      {isOpen && createPortal(dropdownMenu, document.body)}
    </div>
  );
};

export default DropdownMenu;
