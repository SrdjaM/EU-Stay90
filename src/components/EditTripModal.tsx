import React, { useState } from "react";
import { Trip } from "./TripList";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

import Button from "./Button";
import classes from "../styles/EditTripModal.module.scss";

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
  const toLocalDateString = (date: Date) => {
    const localDate = new Date(date);

    localDate.setMinutes(
      localDate.getMinutes() - localDate.getTimezoneOffset()
    );
    return localDate.toISOString().split("T")[0];
  };

  const [startDate, setStartDate] = useState(toLocalDateString(trip.startDate));
  const [endDate, setEndDate] = useState(toLocalDateString(trip.endDate));

  const handleSave = async () => {
    try {
      const tripRef = doc(db, "trips", tripId);

      const startUTCDate = new Date(startDate);
      startUTCDate.setMinutes(
        startUTCDate.getMinutes() + startUTCDate.getTimezoneOffset()
      );

      const endUTCDate = new Date(endDate);
      endUTCDate.setMinutes(
        endUTCDate.getMinutes() + endUTCDate.getTimezoneOffset()
      );

      await updateDoc(tripRef, {
        startDate: startUTCDate.toISOString(),
        endDate: endUTCDate.toISOString(),
      });

      onClose();
      //TODO: set success message in toast notification
    } catch (error) {
      //TODO: set error message in toast notification
      console.error("Error updating document: ", error);
    }
  };

  return (
    <div className={classes.modal}>
      <div className={classes["modal_content"]}>
        <h2 className={classes["modal_heading"]}>Edit Trip</h2>
        <label className={classes["edit-input_label"]}>
          Start Date
          <input
            className={classes["edit-input"]}
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </label>
        <label className={classes["edit-input_label"]}>
          End Date
          <input
            className={classes["edit-input"]}
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </label>
        <Button variant="primary" onClick={handleSave}>
          Save
        </Button>
        <Button variant="primary" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default EditTripModal;
