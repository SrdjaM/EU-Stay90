import { TripListAction, TripListState } from "../../utils/types";
import { TripListActionTypes } from "../enums/ActionTypes";

export const initialState: TripListState = {
  trips: [],
  loading: true,
  editTripId: null,
  openDropdownId: null,
};

export const reducer = (
  state: TripListState,
  action: TripListAction
): TripListState => {
  switch (action.type) {
    case TripListActionTypes.SET_TRIPS:
      return { ...state, trips: action.payload, loading: false };
    case TripListActionTypes.SET_LOADING:
      return { ...state, loading: action.payload };
    case TripListActionTypes.SET_EDIT_TRIP_ID:
      return { ...state, editTripId: action.payload };
    case TripListActionTypes.SET_OPEN_DROPDOWN_ID:
      return { ...state, openDropdownId: action.payload };
    default:
      return state;
  }
};

export {};
