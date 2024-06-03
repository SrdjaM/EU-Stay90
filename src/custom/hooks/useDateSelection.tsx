import React, { useState } from "react";

export function useDateSelection() {
  const [selection, setSelection] = useState<{
    startDate: Date | null;
    endDate: Date | null;
    selectedDay: Date | null;
  }>({
    startDate: null,
    endDate: null,
    selectedDay: null,
  });

  const handleDayClick = (date: Date | null) => {
    setSelection((prevState) => {
      if (!prevState.startDate && !prevState.endDate) {
        return { ...prevState, startDate: date, selectedDay: date };
      } else if (
        prevState.startDate &&
        !prevState.endDate &&
        date &&
        date > prevState.startDate
      ) {
        return { ...prevState, endDate: date, selectedDay: date };
      } else {
        return {
          ...prevState,
          startDate: date,
          endDate: null,
          selectedDay: date,
        };
      }
    });
  };

  const cancelSelectedDates = () => {
    setSelection({
      startDate: null,
      endDate: null,
      selectedDay: null,
    });
  };

  return {
    ...selection,
    handleDayClick,
    cancelSelectedDates,
  };
}
