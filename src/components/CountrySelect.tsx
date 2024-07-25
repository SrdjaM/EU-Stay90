import React, { useState, FC } from "react";
import Flag from "react-country-flag";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";

import { schengenCountries } from "../common/constants/constants";
import classes from "../styles/CountrySelect.module.scss";

interface CountryDropdownProps {
  onChange: (countryName: string) => void;
  value: string | null;
}

const CountryDropdown: FC<CountryDropdownProps> = ({ onChange, value }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => setIsOpen(!isOpen);

  const handleSelect = (countryName: string) => {
    onChange(countryName);
    setIsOpen(false);
  };

  return (
    <div className={classes.dropdown}>
      <div className={classes["dropdown-container"]}>
        <div className={classes["dropdown-toggle"]}>
          {value ? (
            <>
              <div className={classes["dropdown-flag"]}>
                <Flag
                  countryCode={
                    schengenCountries.find((country) => country.name === value)
                      ?.code || ""
                  }
                  svg
                />
              </div>
              {value}
            </>
          ) : (
            "Select a country"
          )}
        </div>
        <button onClick={handleToggle} className={classes["dropdown_btn"]}>
          <div
            className={classNames(classes["dropdown-icon"], {
              [classes.rotate]: isOpen,
            })}
          >
            <FontAwesomeIcon icon={faChevronDown} />
          </div>
        </button>
      </div>
      {isOpen && (
        <ul className={classes["dropdown-menu"]}>
          {schengenCountries.map((country) => (
            <li
              key={country.code}
              onClick={() => handleSelect(country.name)}
              className={classes["dropdown-item"]}
              aria-selected={country.name === value}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSelect(country.name);
                }
              }}
            >
              <div className={classes["dropdown-flag"]}>
                <Flag countryCode={country.code} svg />
              </div>
              {country.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CountryDropdown;
