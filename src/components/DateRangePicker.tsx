import React, { useState } from "react";
import classes from "../styles/DateRangePicker.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";

interface Day {
  date: Date | null;
  dayOfMonth: number;
  isInRange?: boolean;
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

  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const [selectedDay, setSelectedDay] = useState<Date | null>(null);

  const formatDate = (date: Date) => {
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    return `${day} ${month} ${year}`;
  };

  const generateDaysInMonth = (
    year: number,
    month: number,
    includePreviousMonthDays: boolean = false
  ): Day[] => {
    const days: Day[] = [];
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const lastDayOfPreviousMonth = new Date(year, month, 0);

    let startingDayIndex = firstDayOfMonth.getDay();

    if (startingDayIndex === 0) {
      startingDayIndex = 7;
    }

    if (includePreviousMonthDays) {
      const daysInPreviousMonth = lastDayOfPreviousMonth.getDate();
      for (
        let i = daysInPreviousMonth - startingDayIndex + 2;
        i <= daysInPreviousMonth;
        i++
      ) {
        days.push({ date: null, dayOfMonth: i });
      }
    }

    for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
      const date = new Date(year, month, i);
      days.push({ date, dayOfMonth: i });
    }

    days.forEach((day) => {
      if (startDate && endDate && day.date) {
        day.isInRange = day.date >= startDate && day.date <= endDate;
      } else {
        day.isInRange = false;
      }
    });

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

  const handleDayClick = (date: Date | null) => {
    if (!startDate && !endDate) {
      setStartDate(date);
    } else if (startDate && !endDate && date && date > startDate) {
      setEndDate(date);
    } else {
      setStartDate(date);
      setEndDate(null);
    }
    setSelectedDay(date);
  };

  const getNextMonthAndYear = (month: number, year: number) => {
    const newMonth = month + 1;
    if (newMonth > 11) {
      return { month: 0, year: year + 1 };
    }

    return { month: newMonth, year };
  };

  const formattedStartDate = startDate ? formatDate(startDate) : "";
  const formattedEndDate = endDate ? formatDate(endDate) : "";

  const { month: nextMonth, year: nextYear } = getNextMonthAndYear(
    currentMonth,
    currentYear
  );

  return (
    <div className={classes["date-range"]}>
      <div className={classes["date-range__days"]}>
        <div>
          <div className={classes["date-range__current-month"]}>
            <button
              onClick={() => changeMonth(-1)}
              className={classes["date-range__btn-months"]}
              aria-label="Go to previous month"
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
                  } ${day.isInRange ? classes["in-range"] : ""} ${
                    day.date &&
                    selectedDay &&
                    day.date.getTime() === selectedDay.getTime()
                      ? classes["selected-day"]
                      : ""
                  }`}
                  onClick={() => handleDayClick(day.date)}
                >
                  {day.dayOfMonth}
                </div>
              )
            )}
          </div>
        </div>
        <div>
          <div className={classes["date-range__next-month"]}>
            {`${months[nextMonth]} ${nextYear}`}
            <button
              onClick={() => changeMonth(1)}
              className={`${classes["date-range__btn-months"]} ${classes.right}`}
              aria-label="Go to next month"
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
                  } ${day.isInRange ? classes["in-range"] : ""} ${
                    day.date &&
                    selectedDay &&
                    day.date.getTime() === selectedDay.getTime()
                      ? classes["selected-day"]
                      : ""
                  }`}
                  onClick={() => handleDayClick(day.date)}
                >
                  {day.dayOfMonth}
                </div>
              )
            )}
          </div>
        </div>
      </div>
      <div className={classes["picked-date"]}>
        {startDate && (
          <span className={classes["picked-date__start-day--span"]}>
            start date
          </span>
        )}
        <input
          type="text"
          value={formattedStartDate}
          placeholder="Start Date"
          className={classes["picked-date__start-day"]}
          readOnly
        />

        {endDate && (
          <span className={classes["picked-date__end-day--span"]}>
            end date
          </span>
        )}
        <input
          type="text"
          value={formattedEndDate}
          placeholder="End Date"
          className={classes["picked-date__end-day"]}
          readOnly
        />
      </div>
    </div>
  );
};

export default DateRangePicker;
