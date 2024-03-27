import { useState } from "react";

const MONTH_OF_DECEMBER = 11;
const MONTH_OF_JANUARY = 0;

export function useMonthYear(
  initialMonth = new Date().getMonth(),
  initialYear = new Date().getFullYear()
) {
  const [currentMonth, setCurrentMonth] = useState(initialMonth);
  const [currentYear, setCurrentYear] = useState(initialYear);

  const changeMonth = (increment: number) => {
    let newMonth = currentMonth + increment;
    let newYear = currentYear;

    if (newMonth < MONTH_OF_JANUARY) {
      newMonth = MONTH_OF_DECEMBER;
      newYear--;
    } else if (newMonth > MONTH_OF_DECEMBER) {
      newMonth = MONTH_OF_JANUARY;
      newYear++;
    }

    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
  };

  const getNextMonthAndYear = () => {
    let newMonth = currentMonth + 1;
    let newYear = currentYear;
    if (newMonth > MONTH_OF_DECEMBER) {
      newMonth = MONTH_OF_JANUARY;
      newYear++;
    }
    return { month: newMonth, year: newYear };
  };

  return { currentMonth, currentYear, changeMonth, getNextMonthAndYear };
}
