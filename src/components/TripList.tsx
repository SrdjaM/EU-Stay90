import React, { useEffect, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { useUser } from "../contexts/UserContext";
import ReactCountryFlag from "react-country-flag";

import { formatDate } from "../custom/utils/dateUtils";
import classes from "../styles/TripList.module.scss";
import { months } from "../common/constants/constants";
import Loader from "../custom/components/Loader";
import { schengenCountries } from "./CountrySelect";

const DAYS_AVAILABLE_IN_EU = 90;

export interface Trip {
  startDate: Date;
  endDate: Date;
  country: string;
}

const TripList: React.FC = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const { userId } = useUser();

  const countDays = (trip: Trip) => {
    return Math.ceil(
      (trip.endDate.getTime() - trip.startDate.getTime()) / (1000 * 3600 * 24)
    );
  };

  const filterTripsLast180Days = () => {
    if (trips.length === 0) return [];

    const lastTrip = trips[0];
    const last180DaysDate = new Date(lastTrip.endDate);
    last180DaysDate.setDate(lastTrip.endDate.getDate() - 180);

    return trips.filter(
      (trip) =>
        trip.startDate >= last180DaysDate && trip.endDate <= lastTrip.endDate
    );
  };

  const getTotalDays = () => {
    const last180DaysTrips = filterTripsLast180Days();
    return last180DaysTrips.reduce((total, trip) => total + countDays(trip), 0);
  };

  const listItems = () => {
    const last180DaysTrips = filterTripsLast180Days();
    return last180DaysTrips.map((trip, index) => (
      <li key={index} className={classes["trip__list"]}>
        <div className={classes["trip__container"]}>
          <div className={classes["trip_country"]}>
            <div className={classes["trip_flag"]}>
              <ReactCountryFlag
                countryCode={
                  schengenCountries.find(
                    (country) => country.name === trip.country
                  )?.code || ""
                }
                svg
              />
            </div>
            <div className={classes["trip_country-name"]}>{trip.country}</div>
          </div>
          <div className={classes["trip_date"]}>
            <span className={classes["trip__start-date"]}>
              {formatDate(trip.startDate, months)}
            </span>
            -
            <span className={classes["trip_end-date"]}>
              {formatDate(trip.endDate, months)}
            </span>
          </div>

          <span className={classes["trip__total-days"]}>{`${countDays(
            trip
          )} days`}</span>
        </div>
      </li>
    ));
  };

  const daysLeft = DAYS_AVAILABLE_IN_EU - getTotalDays();

  const renderDaysLeft = () => {
    if (daysLeft >= 0) {
      return daysLeft;
    } else {
      return (
        <div className={classes["trips-left--exceeded"]}>
          You have exceeded the number of days by {Math.abs(daysLeft)}
        </div>
      );
    }
  };

  useEffect(() => {
    setLoading(true);
    const q = query(collection(db, "trips"), where("userId", "==", userId));
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const tripsData: Trip[] = [];
        querySnapshot.forEach((doc) => {
          const tripData = doc.data();
          tripsData.push({
            startDate: new Date(tripData.startDate),
            endDate: new Date(tripData.endDate),
            country: tripData.country,
          });
        });
        tripsData.sort((a, b) => b.startDate.getTime() - a.startDate.getTime());

        setTrips(tripsData);
        setLoading(false);
      },
      (error) => {
        console.error("Error listening to trips updates:", error);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, [userId]);

  const renderTripList = () => {
    if (loading) {
      return <Loader />;
    } else if (trips.length > 0) {
      return <ul className={classes["trip-list__list"]}>{listItems()}</ul>;
    } else {
      return (
        <div className={classes["trip-list--empty"]}>
          You don't have any trips yet!
        </div>
      );
    }
  };

  const getNextFull90Days = () => {
    if (trips.length === 0) return new Date();

    const lastTrip = trips[0];
    const resetDate = new Date(lastTrip.endDate);
    resetDate.setDate(resetDate.getDate() + 180);

    return resetDate;
  };

  const renderNextFull90Days = () => {
    const nextFull90Days = getNextFull90Days();
    return (
      <div className={classes["trips-refill"]}>
        <span className={classes["trips-refill--date"]}>
          {formatDate(nextFull90Days, months)}
        </span>
        <div>Next full 90 days date</div>
      </div>
    );
  };

  return (
    <div className={classes["trip-list__count"]}>
      <div className={classes["trip-list__total-trips"]}>
        <div className={classes["trips-spent"]}>
          <span className={classes["trips-spent--total-days"]}>
            {getTotalDays()}
          </span>
          <span
            className={classes["trips-spent--text"]}
          >{` days spent in EU`}</span>
        </div>
        <div className={classes["trips-left"]}>
          <span className={classes["trips-spent--total-days"]}>
            {renderDaysLeft()}
          </span>
          <span className={classes["trips-spent--text"]}>
            {daysLeft >= 0 && ` days left`}
          </span>
        </div>
        {renderNextFull90Days()}
      </div>
      <h3 className={classes["trip-list__header"]}>
        Your trips in last 180 days
      </h3>
      <div className={classes["trip-list__container"]}>{renderTripList()}</div>
    </div>
  );
};

export default TripList;
