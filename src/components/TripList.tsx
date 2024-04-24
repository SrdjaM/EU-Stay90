import React, { useEffect, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { useUser } from "../contexts/UserContext";

import { formatDate } from "../custom/utils/dateUtils";
import classes from "../styles/TripList.module.scss";
import { months } from "../common/constants/constants";
import Loader from "./Loader";

const DAYS_AVAILABLE_IN_EU = 90;

export interface Trip {
  startDate: Date;
  endDate: Date;
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

  const getTotalDays = () => {
    return trips.reduce((total, trip) => {
      return total + countDays(trip);
    }, 0);
  };

  const listItems = () => {
    return trips.map((trip, index) => (
      <li key={index} className={classes["trip__list"]}>
        <div className={classes["trip__container"]}>
          <span className={classes["trip__start-date"]}>
            {formatDate(trip.startDate, months)}
          </span>
          <span className={classes["trip__total-days"]}>{`${countDays(
            trip
          )} days`}</span>
          <span className={classes["trip_end-date"]}>
            {formatDate(trip.endDate, months)}
          </span>
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
          });
        });
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
      return <Loader loading={loading} />;
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

  console.log(trips);
  console.log(loading);

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
        <div className={classes["trips-refill"]}>
          <span className={classes["trips-refill--date"]}>27 March 2025</span>
          <div>Next full 90 days on</div>
        </div>
      </div>
      <h3 className={classes["trip-list__header"]}>Your trips</h3>
      <div className={classes["trip-list__container"]}>{renderTripList()}</div>
    </div>
  );
};

export default TripList;
