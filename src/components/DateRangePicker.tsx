import React from "react";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { db } from "../firebase";
import { addDoc, collection } from "firebase/firestore";
import { useUser } from "../contexts/UserContext";
import classNames from "classnames";

import Button from "./Button";
import { useMonthYear } from "../custom/hooks/useMonthYear";
import { useDateSelection } from "../custom/hooks/useDateSelection";
import RoundButton from "../custom/components/RoundButton";
import { formatDate } from "../custom/utils/dateUtils";
import { months, daysOfWeek } from "../common/constants/constants";
import { UI_TEXT } from "../common/constants/constants";
import { useToast } from "../contexts/ToastContext";
import classes from "../styles/DateRangePicker.module.scss";

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
  const { currentMonth, currentYear, changeMonth, getNextMonthAndYear } =
    useMonthYear();
  const {
    startDate,
    endDate,
    selectedDay,
    handleDayClick,
    cancelSelectedDates,
  } = useDateSelection();
  const addToast = useToast();

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

  const renderDaysGrid = (days: Day[], startingIndex: number = 0) => {
    return days.map((day, index) => {
      const adjustedIndex = index + startingIndex;

      const onDayClick = () => {
        if (day.date) handleDayClick(day.date);
      };

      const tabIndex = index === 0 ? 0 : -1;

      const handleKeyDown = (event: React.KeyboardEvent) => {
        switch (event.key) {
          case "Enter":
            event.preventDefault();
            if (day.date) {
              handleDayClick(day.date);
            }
            break;
          case "ArrowRight":
            event.preventDefault();
            moveFocus(adjustedIndex, 1);
            break;
          case "ArrowLeft":
            event.preventDefault();
            moveFocus(adjustedIndex, -1);
            break;
          case "ArrowDown":
            event.preventDefault();
            moveFocus(adjustedIndex, 7);
            break;
          case "ArrowUp":
            event.preventDefault();
            moveFocus(adjustedIndex, -7);
            break;
          default:
            break;
        }
      };

      const dayClasses = classNames(classes["days-grid__day"], {
        [classes["days-grid__day--previous-month"]]: day.date === null,
        [classes["in-range"]]: day.isInRange,
        [classes["selected-day"]]:
          day.date &&
          selectedDay &&
          day.date.getTime() === selectedDay.getTime(),
        [classes["disabled-day"]]:
          selectedDay && day.date && day.date < selectedDay,
      });

      return (
        <div
          key={day.date ? day.date.getTime() : `empty-${index}`}
          className={dayClasses}
          tabIndex={tabIndex}
          onClick={onDayClick}
          onKeyDown={handleKeyDown}
        >
          {day.dayOfMonth}
        </div>
      );
    });
  };

  const moveFocus = (currentIndex: number, moveBy: number) => {
    const newFocusIndex = currentIndex + moveBy;
    const allDays = document.querySelectorAll("." + classes["days-grid__day"]);
    const targetElement = allDays[newFocusIndex] as HTMLElement;

    targetElement?.focus();
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

        addToast("Trip added successfully!", "success");

        cancelSelectedDates();
      }
    } catch (error) {
      if (error instanceof Error) {
        addToast(`Failed to add trip: ${error.message}`, "error");
      } else {
        addToast("Failed to add trip due to an unknown error.", "error");
      }
    }
  };

  const currentMonthDays = generateDaysInMonth(currentYear, currentMonth, true);
  const nextMonthDays = generateDaysInMonth(nextYear, nextMonth, true);

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
          tabIndex={-1}
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
          tabIndex={-1}
        />
      </div>
      <div className={classes["btn-action"]}>
        <div className={classes["btn-container"]}>
          <Button onClick={handleConfirmDates} variant="primary">
            {UI_TEXT.CONFIRM}
          </Button>
        </div>
        <div className={classes["btn-container"]}>
          <Button onClick={cancelSelectedDates} variant="primary">
            {UI_TEXT.CANCEL}
          </Button>
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
            {renderDaysGrid(currentMonthDays)}
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
            {renderDaysGrid(nextMonthDays, currentMonthDays.length)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DateRangePicker;
