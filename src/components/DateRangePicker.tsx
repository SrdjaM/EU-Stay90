import React from "react";
import classes from "../styles/DateRangePicker.module.scss";
import { useMonthYear } from "../custom/hooks/useMonthYear";
import { useDateSelection } from "../custom/hooks/useDateSelection";
import {
  faAngleLeft,
  faAngleRight,
  faX,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
import RoundButton from "../custom/components/RoundButton";
import { formatDate } from "../custom/utils/dateUtils";

import { db } from "../firebase";
import { addDoc, collection } from "firebase/firestore";
import { useUser } from "../contexts/UserContext";

interface NewTrip {
  userId: string;
  startDate: string;
  endDate: string;
}

const FIRST_DAY_OF_WEEK_INDEX = 0;
const LAST_DAY_OF_WEEK_INDEX = 7;
const OFFSET_TO_MONDAY = 2;
const TO_PREVIOUS_MONTH = -1;
const TO_NEXT_MONTH = 1;

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

  const { currentMonth, currentYear, changeMonth, getNextMonthAndYear } =
    useMonthYear();
  const {
    startDate,
    endDate,
    selectedDay,
    handleDayClick,
    cancelSelectedDated,
  } = useDateSelection();

  const { userId } = useUser();

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

    if (startingDayIndex === FIRST_DAY_OF_WEEK_INDEX) {
      startingDayIndex = LAST_DAY_OF_WEEK_INDEX;
    }

    if (includePreviousMonthDays) {
      const daysInPreviousMonth = lastDayOfPreviousMonth.getDate();

      for (
        let dayIndex =
          daysInPreviousMonth - startingDayIndex + OFFSET_TO_MONDAY;
        dayIndex <= daysInPreviousMonth;
        dayIndex++
      ) {
        days.push({ date: null, dayOfMonth: dayIndex });
      }
    }

    for (let dayIndex = 1; dayIndex <= lastDayOfMonth.getDate(); dayIndex++) {
      const date = new Date(year, month, dayIndex);
      days.push({ date, dayOfMonth: dayIndex });
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

  const { month: nextMonth, year: nextYear } = getNextMonthAndYear();

  const formattedStartDate = startDate ? formatDate(startDate, months) : "";
  const formattedEndDate = endDate ? formatDate(endDate, months) : "";

  const renderDaysGrid = (days: Day[]) => {
    return days.map((day, index) => {
      const onDayClick = () => handleDayClick(day.date);

      const dayClasses = [
        classes["days-grid__day"],
        day.date === null && classes["days-grid__day--previous-month"],
        day.isInRange && classes["in-range"],
        day.date &&
          selectedDay &&
          day.date.getTime() === selectedDay.getTime() &&
          classes["selected-day"],
        selectedDay &&
          day.date &&
          day.date < selectedDay &&
          classes["disabled-day"],
      ]
        .filter(Boolean)
        .join(" ");

      return (
        <div
          key={day.date ? day.date.getTime() : `empty-${index}`}
          className={dayClasses}
          onClick={onDayClick}
        >
          {day.dayOfMonth}
        </div>
      );
    });
  };

  const handlePreviousMonth = () => {
    changeMonth(TO_PREVIOUS_MONTH);
  };

  const handleNextMonth = () => {
    changeMonth(TO_NEXT_MONTH);
  };

  const renderDaysOfWeek = () => {
    return daysOfWeek.map((day) => (
      <div key={day} className={classes["days-of-week__day"]}>
        {day}
      </div>
    ));
  };

  const handleConfirmDates = async () => {
    try {
      if (startDate && endDate) {
        const newTrip: NewTrip = {
          userId: userId || "",
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        };

        await addDoc(collection(db, "trips"), newTrip);

        cancelSelectedDated();
      }
    } catch (error) {
      console.error("Error adding trip:", error);
    }
  };

  return (
    <div className={classes["date-range"]}>
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
        <div className={classes["btn-container"]}>
          <RoundButton
            onButtonClick={handleConfirmDates}
            icon={faCheck}
            ariaLabel="Confirm dates"
          />
        </div>
        <div className={classes["btn-container"]}>
          <RoundButton
            onButtonClick={cancelSelectedDated}
            icon={faX}
            ariaLabel="Cancel dates"
          />
        </div>
      </div>
      <div className={classes["date-range__days"]}>
        <div>
          <div className={classes["date-range__current-month"]}>
            <RoundButton
              onButtonClick={handlePreviousMonth}
              icon={faAngleLeft}
              ariaLabel="Go to previous month"
              className={classes.left}
            />
            {`${months[currentMonth]} ${currentYear}`}
          </div>
          <div className={classes["days-of-week"]}>{renderDaysOfWeek()}</div>
          <div className={classes["days-grid"]}>
            {renderDaysGrid(
              generateDaysInMonth(currentYear, currentMonth, true)
            )}
          </div>
        </div>
        <div>
          <div className={classes["date-range__next-month"]}>
            {`${months[nextMonth]} ${nextYear}`}
            <RoundButton
              onButtonClick={handleNextMonth}
              icon={faAngleRight}
              ariaLabel="Go to next month"
              className={classes.right}
            />
          </div>

          <div className={classes["days-of-week"]}>{renderDaysOfWeek()}</div>
          <div className={classes["days-grid"]}>
            {renderDaysGrid(
              generateDaysInMonth(currentYear, currentMonth + 1, true)
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DateRangePicker;
