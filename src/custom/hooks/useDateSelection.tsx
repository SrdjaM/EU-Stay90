import React, { useState } from "react";

export function useDateSelection() {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);

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

  return { startDate, endDate, selectedDay, handleDayClick };
}
