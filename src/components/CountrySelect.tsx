import React, { useState, FC } from "react";
import countries from "i18n-iso-countries";
import enLocale from "i18n-iso-countries/langs/en.json";
import Flag from "react-country-flag";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";

import classes from "../styles/CountrySelect.module.scss";

countries.registerLocale(enLocale);

const schengenCountries = [
  "AT",
  "BE",
  "CZ",
  "DK",
  "EE",
  "FI",
  "FR",
  "DE",
  "GR",
  "HU",
  "IS",
  "IT",
  "LV",
  "LI",
  "LT",
  "LU",
  "MT",
  "NL",
  "NO",
  "PL",
  "PT",
  "SK",
  "SI",
  "ES",
  "SE",
  "CH",
];

const countryOptions = schengenCountries.map((code) => ({
  value: code,
  label: countries.getName(code, "en"),
}));

interface CountryDropdownProps {
  onChange: (countryCode: string) => void;
  value: string | null;
}

const CountryDropdown: React.FC<CountryDropdownProps> = ({
  onChange,
  value,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => setIsOpen(!isOpen);

  const handleSelect = (countryCode: string) => {
    onChange(countryCode);
    setIsOpen(false);
  };

  return (
    <div className={classes.dropdown}>
      <div className={classes["dropdown-container"]}>
        <div className={classes["dropdown-toggle"]}>
          {value ? (
            <>
              <div className={classes["dropdown-flag"]}>
                <Flag countryCode={value} svg />
              </div>
              {countries.getName(value, "en")}
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
          {countryOptions.map((country) => (
            <li
              key={country.value}
              onClick={() => handleSelect(country.value)}
              className={classes["dropdown-item"]}
            >
              <div className={classes["dropdown-flag"]}>
                <Flag countryCode={country.value} svg />
              </div>

              {country.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CountryDropdown;
