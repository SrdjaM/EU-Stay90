import React, { ReactNode, createContext, useContext, useState } from "react";

interface DateContextProps {
  startDate: Date | null;
  endDate: Date | null;
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

  const handleDayClick = (date: Date | null) => {
    if (!date) return;

    if (!startDate) {
      setStartDate(date);
    } else if (!endDate) {
      if (date > startDate) {
        setEndDate(date);
      }
    } else {
      setStartDate(date);
      setEndDate(null);
    }
  };

  const cancelSelectedDates = () => {
    setStartDate(null);
    setEndDate(null);
  };

  return (
    <DateContext.Provider
      value={{
        startDate,
        endDate,
        setStartDate,
        setEndDate,
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
