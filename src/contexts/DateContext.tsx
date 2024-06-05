import React, { ReactNode, createContext, useContext, useState } from "react";

interface DateContextProps {
  startDate: Date | null;
  endDate: Date | null;
  selectedDay: Date | null;
  setStartDate: (date: Date | null) => void;
  setEndDate: (date: Date | null) => void;
  handleDayClick: (date: Date | null) => void;
  cancelSelectedDates: () => void;
}

const DateContext = createContext<DateContextProps | undefined>(undefined);

export const DateProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);

  const handleDayClick = (date: Date | null) => {
    setStartDate((prevStartDate) => {
      if (!prevStartDate) {
        setSelectedDay(date);
        return date;
      } else if (prevStartDate && !endDate && date && date > prevStartDate) {
        setSelectedDay(date);
        setEndDate(date);
        return prevStartDate;
      } else {
        setSelectedDay(date);
        setEndDate(null);
        return date;
      }
    });
  };

  const cancelSelectedDates = () => {
    setStartDate(null);
    setEndDate(null);
    setSelectedDay(null);
  };

  return (
    <DateContext.Provider
      value={{
        startDate,
        endDate,
        setStartDate,
        setEndDate,
        selectedDay,
        handleDayClick,
        cancelSelectedDates,
      }}
    >
      {children}
    </DateContext.Provider>
  );
};

export const useDate = () => {
  const context = useContext(DateContext);
  if (!context) {
    throw new Error("useDate must be used within a DateProvider");
  }
  return context;
};
