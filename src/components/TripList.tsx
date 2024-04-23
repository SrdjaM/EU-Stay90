import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { useUser } from "../contexts/UserContext";

import { formatDate } from "../custom/utils/dateUtils";
import classes from "../styles/TripList.module.scss";
import { months } from "../common/constants/constants";

const DAYS_AVAILABLE_IN_EU = 90;

export interface Trip {
  startDate: Date;
  endDate: Date;
}

const TripList: React.FC = () => {
  const [trips, setTrips] = useState<Trip[]>([
    { startDate: new Date("2023-01-01"), endDate: new Date("2023-01-10") },
    { startDate: new Date("2023-02-15"), endDate: new Date("2023-02-25") },
    { startDate: new Date("2023-03-05"), endDate: new Date("2023-03-15") },
    { startDate: new Date("2023-04-20"), endDate: new Date("2023-04-30") },
    { startDate: new Date("2023-05-10"), endDate: new Date("2023-05-20") },
    { startDate: new Date("2023-06-01"), endDate: new Date("2023-06-11") },
    { startDate: new Date("2023-01-01"), endDate: new Date("2023-01-10") },
    { startDate: new Date("2023-05-10"), endDate: new Date("2023-05-20") },
    { startDate: new Date("2023-06-01"), endDate: new Date("2023-06-11") },
  ]);
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

  //   useEffect(() => {
  //     const fetchTrips = async () => {
  //       try {
  //         const q = query(collection(db, "trips"), where("userId", "==", userId));
  //         const querySnapshot = await getDocs(q);
  //         const tripsData: Trip[] = [];
  //         querySnapshot.forEach((doc) => {
  //           const tripData = doc.data();
  //           tripsData.push({
  //             startDate: new Date(tripData.startDate),
  //             endDate: new Date(tripData.endDate),
  //           });
  //         });
  //         setTrips(tripsData);
  //       } catch (error) {
  //         console.error("Error fetching trips for user:", error);
  //       }
  //     };
  //     fetchTrips();
  //   }, [userId, trips]);

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
      <div className={classes["trip-list__container"]}>
        {trips.length > 0 ? (
          <ul className={classes["trip-list__list"]}>{listItems()}</ul>
        ) : (
          <div className={classes["trip-list--empty"]}>
            You don't have any trips yet!
          </div>
        )}
      </div>
    </div>
  );
};

export default TripList;
