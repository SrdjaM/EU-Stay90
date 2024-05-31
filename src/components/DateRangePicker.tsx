import React from "react";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { db } from "../firebase";
import { addDoc, collection } from "firebase/firestore";
import { useUser } from "../contexts/UserContext";
import classNames from "classnames";

import Button from "./Button";
import RoundButton from "../custom/components/RoundButton";
import { months, daysOfWeek } from "../common/constants/constants";
import { UI_TEXT } from "../common/constants/constants";
import { useToast } from "../contexts/ToastContext";
import classes from "../styles/DateRangePicker.module.scss";
import { useDateRangePicker } from "../custom/hooks/useDateRangePicker";

const TO_PREVIOUS_MONTH = -1;
const TO_NEXT_MONTH = 1;
const NEXT_DAY = 1;
const PREVIOUS_DAY = -1;
const NEXT_7_DAYS = 7;
const PREVIOUS_7_DAYS = -7;

interface Day {
  date: Date | null;
  dayOfMonth: number;
  isInRange?: boolean;
}

const DateRangePicker: React.FC = () => {
  const addToast = useToast();

  const { userId } = useUser();
  const {
    state,
    handleStartDateChange,
    handleEndDateChange,
    handleStartDateBlur,
    handleEndDateBlur,
    cancelSelectedDates,
    changeMonth,
    currentMonth,
    currentYear,
    getNextMonthAndYear,
    handleDayClick,
    generateDaysInMonth,
    selectedDay,
    isValidDate,
    dispatch,
  } = useDateRangePicker();

  const { month: nextMonth, year: nextYear } = getNextMonthAndYear();

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
            moveFocus(adjustedIndex, NEXT_DAY);
            break;
          case "ArrowLeft":
            event.preventDefault();
            moveFocus(adjustedIndex, PREVIOUS_DAY);
            break;
          case "ArrowDown":
            event.preventDefault();
            moveFocus(adjustedIndex, NEXT_7_DAYS);
            break;
          case "ArrowUp":
            event.preventDefault();
            moveFocus(adjustedIndex, PREVIOUS_7_DAYS);
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

  const renderDaysOfWeek = () => {
    return daysOfWeek.map((day) => (
      <div key={day} className={classes["days-of-week__day"]}>
        {day}
      </div>
    ));
  };

  const handleConfirmDates = async () => {
    try {
      if (state.inputStartDate && state.inputEndDate) {
        const isValidStartDate = isValidDate(state.inputStartDate);
        const isValidEndDate = isValidDate(state.inputEndDate);

        if (!isValidStartDate || !isValidEndDate) {
          throw new Error("Wrong date input");
        }

        const startDateISO = new Date(state.inputStartDate).toISOString();
        const endDateISO = new Date(state.inputEndDate).toISOString();

        const newTrip = {
          userId: userId || "",
          startDate: startDateISO,
          endDate: endDateISO,
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
        {state.inputStartDate && (
          <span className={classes["picked-date__start-day--span"]}>
            start date
          </span>
        )}
        <input
          type="date"
          value={state.inputStartDate}
          placeholder="Start Date"
          className={classes["picked-date__start-day"]}
          onChange={handleStartDateChange}
          onBlur={handleStartDateBlur}
        />

        {state.inputEndDate && (
          <span className={classes["picked-date__end-day--span"]}>
            end date
          </span>
        )}
        <input
          type="date"
          value={state.inputEndDate}
          placeholder="End Date"
          className={classes["picked-date__end-day"]}
          onChange={handleEndDateChange}
          onBlur={handleEndDateBlur}
        />
      </div>
      <div className={classes["input-error"]}>
        {state.inputDateError && <span>{state.inputDateError}</span>}
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
              onButtonClick={() => changeMonth(TO_PREVIOUS_MONTH)}
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
              onButtonClick={() => changeMonth(TO_NEXT_MONTH)}
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
