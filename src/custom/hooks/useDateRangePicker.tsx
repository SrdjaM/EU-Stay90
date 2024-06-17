import { useEffect, useReducer } from "react";
import * as yup from "yup";

import { useMonthYear } from "./useMonthYear";
import { useToast } from "../../contexts/ToastContext";
import { useDate } from "../../contexts/DateContext";

const FIRST_DAY_OF_WEEK_INDEX = 0;
const LAST_DAY_OF_WEEK_INDEX = 7;
const OFFSET_TO_MONDAY = 2;

interface State {
  inputStartDate: string;
  inputEndDate: string;
  inputDateError: string | null;
  successMessage: string | null;
}
interface Day {
  date: Date | null;
  dayOfMonth: number;
  isInRange?: boolean;
}

type Action =
  | { type: "SET_START_DATE"; payload: string }
  | { type: "SET_END_DATE"; payload: string }
  | { type: "SET_DATE_ERROR"; payload: string | null }
  | { type: "SET_SUCCESS_MESSAGE"; payload: string | null }
  | { type: "RESET" };

const initialState: State = {
  inputStartDate: "",
  inputEndDate: "",
  inputDateError: null,
  successMessage: null,
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_START_DATE":
      return { ...state, inputStartDate: action.payload };
    case "SET_END_DATE":
      return { ...state, inputEndDate: action.payload };
    case "SET_DATE_ERROR":
      return { ...state, inputDateError: action.payload };
    case "SET_SUCCESS_MESSAGE":
      return { ...state, successMessage: action.payload };
    case "RESET":
      return initialState;
    default:
      return state;
  }
};

const dateSchema = yup
  .string()
  .matches(
    /^\d{4}-(0[1-9]|1[0-2])-(0?[1-9]|[12][0-9]|3[01])$/,
    "Date must be in format DD.MM.YYYY, e.g., 22.05.1987!"
  );

const isValidDate = (dateStr: string) => {
  const regex = /^(20[0-9]{2}|2100)-\d{2}-\d{2}$/;
  if (!dateStr.match(regex)) {
    return false;
  }

  const [year, month, day] = dateStr.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  const hasCorrectMonth = date.getMonth() + 1 === month;
  const hasCorrectDay = date.getDate() === day;
  const hasCorrectYear = date.getFullYear() === year;

  return hasCorrectYear && hasCorrectMonth && hasCorrectDay;
};

export const useDateRangePicker = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { currentMonth, currentYear, changeMonth, getNextMonthAndYear } =
    useMonthYear();
  const {
    startDate,
    endDate,
    selectedDay,
    handleDayClick,
    cancelSelectedDates,
  } = useDate();
  const addToast = useToast();

  useEffect(() => {
    dispatch({
      type: "SET_START_DATE",
      payload: startDate ? startDate.toISOString().split("T")[0] : "",
    });
    dispatch({
      type: "SET_END_DATE",
      payload: endDate ? endDate.toISOString().split("T")[0] : "",
    });
  }, [startDate, endDate]);

  const handleDateChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "SET_START_DATE" | "SET_END_DATE"
  ) => {
    const value = e.target.value;
    const date = new Date(value);
    dispatch({ type: type, payload: value });

    if (!isNaN(date.getTime()) && isValidDate(value)) {
      handleDayClick(date);
    }
  };

  const handleDateBlur = (dateString: string) => {
    try {
      dateSchema.validateSync(dateString);
      dispatch({ type: "SET_DATE_ERROR", payload: null });
    } catch (error) {
      addToast((error as yup.ValidationError).message, "error");
    }
  };

  const generateDaysInMonth = (
    year: number,
    month: number,
    includePreviousMonthDays: boolean = false
  ): Day[] => {
    const days: Day[] = [];
    const firstDayOfMonth = new Date(Date.UTC(year, month, 1));
    const lastDayOfMonth = new Date(Date.UTC(year, month + 1, 0));
    const lastDayOfPreviousMonth = new Date(Date.UTC(year, month, 0));

    let startingDayIndex = firstDayOfMonth.getUTCDay();

    if (startingDayIndex === FIRST_DAY_OF_WEEK_INDEX) {
      startingDayIndex = LAST_DAY_OF_WEEK_INDEX;
    }

    if (includePreviousMonthDays) {
      const daysInPreviousMonth = lastDayOfPreviousMonth.getUTCDate();

      for (
        let dayIndex =
          daysInPreviousMonth - startingDayIndex + OFFSET_TO_MONDAY;
        dayIndex <= daysInPreviousMonth;
        dayIndex++
      ) {
        days.push({ date: null, dayOfMonth: dayIndex });
      }
    }

    for (
      let dayIndex = 1;
      dayIndex <= lastDayOfMonth.getUTCDate();
      dayIndex++
    ) {
      const date = new Date(Date.UTC(year, month, dayIndex));
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

  return {
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
    selectedDay,
    isValidDate,
  };
};
