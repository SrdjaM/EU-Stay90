import React, { useEffect, useState } from "react";
import DateRangePicker from "../components/DateRangePicker";
import TripList, { Trip } from "../components/TripList";
import classes from "../styles/HomePage.module.scss";
import RoundButton from "../custom/components/RoundButton";
import { faPlus, faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const HomePage: React.FC = () => {
  const [openDateRange, setOpenDateRange] = useState(false);

  const openDateRangeHandler = () => {
    setOpenDateRange(true);
  };
  const closeDateRangeHandler = () => {
    setOpenDateRange(false);
  };
  const addVisibleClass = () => openDateRange && classes.visible;

  return (
    <div className={classes["home-page__container"]}>
      <RoundButton
        onButtonClick={openDateRangeHandler}
        icon={faPlus}
        ariaLabel="Add trip"
        className={classes["btn_add"]}
        iconStyle={classes["btn_add--icon-style"]}
      />
      <div
        className={`${classes["btn_close"]} ${addVisibleClass()}`}
        onClick={closeDateRangeHandler}
      >
        <FontAwesomeIcon icon={faX} />
      </div>

      <div className={`${classes["home-page__picker"]} ${addVisibleClass()}`}>
        <DateRangePicker />
      </div>
      <div className={classes["home-page__trips"]}>
        <TripList />
      </div>
    </div>
  );
};

export default HomePage;
