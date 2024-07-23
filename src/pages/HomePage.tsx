import React, { useState } from "react";
import AddTrip from "../components/AddTrip";
import TripList from "../components/TripList";
import classes from "../styles/HomePage.module.scss";
import RoundButton from "../custom/components/RoundButton";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { faCalendarPlus } from "@fortawesome/free-regular-svg-icons";
import { useDate } from "../contexts/DateContext";

const HomePage: React.FC = () => {
  const [openDateRange, setOpenDateRange] = useState(false);

  const { cancelSelectedDates } = useDate();

  const openDateRangeHandler = () => {
    setOpenDateRange(true);
    cancelSelectedDates();
  };
  const closeDateRangeHandler = () => {
    setOpenDateRange(false);
    cancelSelectedDates();
  };
  const addVisibleClass = () => openDateRange && classes.visible;

  return (
    <div className={classes["home-page__container"]}>
      <RoundButton
        onButtonClick={openDateRangeHandler}
        icon={faCalendarPlus}
        ariaLabel="Add trip"
        className={classes["btn_add"]}
        iconStyle={classes["btn_add--icon-style"]}
      />
      <div className={`${classes["btn_close"]} ${addVisibleClass()}`}>
        <RoundButton
          onButtonClick={closeDateRangeHandler}
          icon={faX}
          ariaLabel="Close calendar"
          iconStyle={classes["btn_close--icon-style"]}
        />
      </div>

      <div className={`${classes["home-page__picker"]} ${addVisibleClass()}`}>
        <AddTrip />
      </div>
      <div className={classes["home-page__trips"]}>
        <TripList />
      </div>
    </div>
  );
};

export default HomePage;
