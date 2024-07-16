import React from "react";
import { Trip } from "./TripList";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

import { useToast } from "../contexts/ToastContext";
import Button from "./Button";
import classes from "../styles/EditTripModal.module.scss";
import DateRangePicker from "./DateRangePicker";
import { useDate } from "../contexts/DateContext";

interface EditTripModalProps {
  trip: Trip;
  tripId: string;
  onClose: () => void;
}

const EditTripModal: React.FC<EditTripModalProps> = ({
  trip,
  tripId,
  onClose,
}) => {
  const { startDate, endDate, cancelSelectedDates } = useDate();

  const toLocalDateString = (date: Date) => {
    const localDate = new Date(date);

    localDate.setMinutes(
      localDate.getMinutes() - localDate.getTimezoneOffset()
    );
    return localDate.toISOString().split("T")[0];
  };

  const addToast = useToast();

  const handleOnClose = () => {
    onClose();
    cancelSelectedDates();
  };

  const handleSave = async () => {
    try {
      if (!startDate || !endDate) {
        addToast("Start date and end date cannot be empty.", "error");
        return;
      }

      const tripRef = doc(db, "trips", tripId);

      await updateDoc(tripRef, {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      });

      handleOnClose();
      addToast("Trip edited successfully ", "success");
    } catch (error: any) {
      if (error instanceof Error) {
        addToast(`Failed to edit trip: ${error.message}`, "error");
      } else {
        addToast("Failed to edit trip due to an unknown error.", "error");
      }
    }
  };

  return (
    <div className={classes.modal}>
      <div className={classes["modal_content"]}>
        <h2 className={classes["modal_heading"]}>Edit Trip</h2>
        <DateRangePicker
          initialStartDate={toLocalDateString(trip.startDate)}
          initialEndDate={toLocalDateString(trip.endDate)}
          isInEdit
        />
        <div className={classes["modal-content_separator"]}></div>
        <div className={classes["btn_container"]}>
          <Button variant="primary" onClick={handleSave}>
            Save
          </Button>
          <Button variant="primary" onClick={handleOnClose}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditTripModal;
