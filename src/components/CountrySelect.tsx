import React, { useState, FC } from "react";
import Flag from "react-country-flag";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";

import classes from "../styles/CountrySelect.module.scss";

export const schengenCountries = [
  { code: "AT", name: "Austria" },
  { code: "BE", name: "Belgium" },
  { code: "CZ", name: "Czech Republic" },
  { code: "DK", name: "Denmark" },
  { code: "EE", name: "Estonia" },
  { code: "FI", name: "Finland" },
  { code: "FR", name: "France" },
  { code: "DE", name: "Germany" },
  { code: "GR", name: "Greece" },
  { code: "HU", name: "Hungary" },
  { code: "IS", name: "Iceland" },
  { code: "IT", name: "Italy" },
  { code: "LV", name: "Latvia" },
  { code: "LI", name: "Liechtenstein" },
  { code: "LT", name: "Lithuania" },
  { code: "LU", name: "Luxembourg" },
  { code: "MT", name: "Malta" },
  { code: "NL", name: "Netherlands" },
  { code: "NO", name: "Norway" },
  { code: "PL", name: "Poland" },
  { code: "PT", name: "Portugal" },
  { code: "SK", name: "Slovakia" },
  { code: "SI", name: "Slovenia" },
  { code: "ES", name: "Spain" },
  { code: "SE", name: "Sweden" },
  { code: "CH", name: "Switzerland" },
];

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
