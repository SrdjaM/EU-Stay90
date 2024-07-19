import React, { useEffect, useRef } from "react";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { db } from "../firebase";
import { addDoc, collection } from "firebase/firestore";
import { useUser } from "../contexts/UserContext";
import classNames from "classnames";

import Button from "./Button";
import { useDate } from "../contexts/DateContext";
import RoundButton from "../custom/components/RoundButton";
import { months, daysOfWeek } from "../common/constants/constants";
import { UI_TEXT } from "../common/constants/constants";
import { useDateRangePicker } from "../custom/hooks/useDateRangePicker";
import SaveButton from "./SaveButton";
import classes from "../styles/DateRangePicker.module.scss";

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

interface DateRangePickerProps {
  initialStartDate?: string;
  initialEndDate?: string;
  isInEdit?: boolean;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  initialStartDate,
  initialEndDate,
  isInEdit,
}) => {
  const { setStartDate, setEndDate, startDate, endDate } = useDate();

  const startDateRef = useRef<HTMLInputElement>(null);
  const endDateRef = useRef<HTMLInputElement>(null);

  const { userId } = useUser();

  useEffect(() => {
    if (initialStartDate) setStartDate(new Date(initialStartDate));
    if (initialEndDate) setEndDate(new Date(initialEndDate));
  }, [initialStartDate, initialEndDate]);

  const {
    state,
    handleDateChange,
    handleDateBlur,
    cancelSelectedDates,
    changeMonth,
    currentMonth,
    currentYear,
    getNextMonthAndYear,
    handleDayClick,
    generateDaysInMonth,
    isValidDate,
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

      const isSelectedDate =
        (day.date && startDate && day.date.getTime() === startDate.getTime()) ||
        (day.date && endDate && day.date.getTime() === endDate.getTime());

      const dayClasses = classNames(classes["days-grid__day"], {
        [classes["days-grid__day--previous-month"]]: day.date === null,
        [classes["in-range"]]: day.isInRange,
        [classes["selected-day"]]: isSelectedDate,
        [classes["disabled-day"]]:
          !isSelectedDate && startDate && day.date && day.date < startDate,
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
    }
  };

  const currentMonthDays = generateDaysInMonth(currentYear, currentMonth, true);
  const nextMonthDays = generateDaysInMonth(nextYear, nextMonth, true);

  const dateRangeClass = classNames(classes["date-range"], {
    [classes.modal]: isInEdit,
  });

  const handleCancelDates = () => {
    cancelSelectedDates();
    if (startDateRef.current) startDateRef.current.value = "";
    if (endDateRef.current) endDateRef.current.value = "";
  };

  return (
    <div className={dateRangeClass}>
      <div className={classes["picked-date"]}>
        {state.inputStartDate && (
          <span className={classes["picked-date__start-day--span"]}>
            start date
          </span>
        )}
        <input
          type="date"
          value={state.inputStartDate}
          ref={startDateRef}
          placeholder="Start Date"
          className={classes["picked-date__start-day"]}
          onChange={(e) => handleDateChange(e, "SET_START_DATE")}
          onBlur={() => handleDateBlur(state.inputStartDate)}
        />

        {state.inputEndDate && (
          <span className={classes["picked-date__end-day--span"]}>
            end date
          </span>
        )}
        <input
          type="date"
          value={state.inputEndDate}
          ref={endDateRef}
          placeholder="End Date"
          className={classes["picked-date__end-day"]}
          onChange={(e) => handleDateChange(e, "SET_END_DATE")}
          onBlur={() => handleDateBlur(state.inputEndDate)}
        />
      </div>
      <div className={classes["input-error"]}>
        {state.inputDateError && <span>{state.inputDateError}</span>}
      </div>
      <div className={classes["btn-action"]}>
        {!isInEdit && (
          <>
            <div className={classes["btn-container"]}>
              <SaveButton
                onClick={handleConfirmDates}
                variant="primary"
                isDisabled={!state.inputStartDate || !state.inputEndDate}
                onComplete={cancelSelectedDates}
                onSuccess={"Trip added successfully!"}
                onError={"Failed to add trip"}
              >
                {UI_TEXT.CONFIRM}
              </SaveButton>
            </div>
            <div className={classes["btn-container"]}>
              <Button onClick={handleCancelDates} variant="primary">
                {UI_TEXT.CANCEL}
              </Button>
            </div>
          </>
        )}
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
