import React, { useState } from "react";
import classes from "../styles/DateRangePicker.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";

interface Day {
  date: Date | null;
  dayOfMonth: number;
}

const DateRangePicker: React.FC = () => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const generateDaysInMonth = (
    year: number,
    month: number,
    includePreviousMonthDays: boolean = false
  ): Day[] => {
    const days: Day[] = [];
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const lastDayOfPreviousMonth = new Date(year, month, 0);

    if (includePreviousMonthDays) {
      const daysInPreviousMonth = lastDayOfPreviousMonth.getDate();
      for (
        let i = daysInPreviousMonth - firstDayOfMonth.getDay() + 1;
        i <= daysInPreviousMonth;
        i++
      ) {
        const date = new Date(year, month - 1, i);
        days.push({ date: null, dayOfMonth: i });
      }
    }

    for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
      const date = new Date(year, month, i);
      days.push({ date, dayOfMonth: i });
    }

    return days;
  };

  const changeMonth = (increment: number) => {
    let newMonth = currentMonth + increment;
    let newYear = currentYear;

    if (newMonth < 0) {
      newMonth = 11;
      newYear--;
    } else if (newMonth > 11) {
      newMonth = 0;
      newYear++;
    }

    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
  };

  return (
    <div className={classes["date-range"]}>
      <div className={classes["date-range__days"]}>
        <div>
          <div className={classes["date-range__current-month"]}>
            <button
              onClick={() => changeMonth(-1)}
              className={classes["date-range__btn-months"]}
            >
              <FontAwesomeIcon icon={faAngleLeft} />
            </button>
            {`${months[currentMonth]} ${currentYear}`}
          </div>
          <div className={classes["days-of-week"]}>
            {daysOfWeek.map((day) => (
              <div key={day} className={classes["days-of-week__day"]}>
                {day}
              </div>
            ))}
          </div>
          <div className={classes["days-grid"]}>
            {generateDaysInMonth(currentYear, currentMonth, true).map(
              (day, index) => (
                <div
                  key={day.date ? day.date.getTime() : `empty-${index}`}
                  className={`${classes["days-grid__day"]} ${
                    day.date === null
                      ? classes["days-grid__day--previous-month"]
                      : ""
                  }`}
                >
                  {day.dayOfMonth}
                </div>
              )
            )}
          </div>
        </div>
        <div>
          <div className={classes["date-range__next-month"]}>
            {`${months[currentMonth + 1]} ${currentYear}`}{" "}
            <button
              onClick={() => changeMonth(1)}
              className={`${classes["date-range__btn-months"]} ${classes.right}`}
            >
              <FontAwesomeIcon icon={faAngleRight} />
            </button>
          </div>

          <div className={classes["days-of-week"]}>
            {daysOfWeek.map((day) => (
              <div key={day} className={classes["days-of-week__day"]}>
                {day}
              </div>
            ))}
          </div>
          <div className={classes["days-grid"]}>
            {generateDaysInMonth(currentYear, currentMonth + 1, true).map(
              (day, index) => (
                <div
                  key={day.date ? day.date.getTime() : `empty-${index}`}
                  className={`${classes["days-grid__day"]} ${
                    day.date === null
                      ? classes["days-grid__day--previous-month"]
                      : ""
                  }`}
                >
                  {day.dayOfMonth}
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DateRangePicker;
