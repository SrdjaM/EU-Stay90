import React from "react";
import { Trip } from "./TripList";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

import Button from "./Button";
import classes from "../styles/EditTripModal.module.scss";
import DateRangePicker from "./DateRangePicker";
import { useDate } from "../contexts/DateContext";
import SaveButton from "./SaveButton";

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

  const handleOnClose = () => {
    onClose();
    cancelSelectedDates();
  };

  const handleSave = async () => {
    const tripRef = doc(db, "trips", tripId);

    await updateDoc(tripRef, {
      startDate: startDate && startDate.toISOString(),
      endDate: endDate && endDate.toISOString(),
    });
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
          <SaveButton
            variant="primary"
            onClick={handleSave}
            isDisabled={!startDate || !endDate}
            onComplete={handleOnClose}
            onSuccess={"Trip edited successfully!"}
            onError={"Failed to edit trip!"}
          >
            Save
          </SaveButton>
          <Button variant="primary" onClick={handleOnClose}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditTripModal;
