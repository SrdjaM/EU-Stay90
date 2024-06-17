import { ActionTypes, TripListActionTypes } from "../common/enums/ActionTypes";
import { Trip } from "../components/TripList";

export interface AuthData {
  username?: string;
  email: string;
  password: string;
  confirmPassword?: string;
}

export type FormError = {
  fieldName: keyof AuthData;
  message: string;
};

export type AuthFormState = {
  authData: AuthData;
  errors: FormError[];
  errorMessage: string | null;
  isSuccess: boolean;
  touched: { [key: string]: boolean };
};

export type TripListState = {
  trips: Trip[];
  loading: boolean;
  editTripId: string | null;
  openDropdownId: string | null;
};

export type Action =
  | { type: typeof ActionTypes.SET_AUTH_DATA; payload: AuthData }
  | { type: typeof ActionTypes.SET_ERRORS; payload: FormError[] }
  | { type: typeof ActionTypes.SET_ERROR_MESSAGE; payload: string | null }
  | { type: typeof ActionTypes.SET_IS_SUCCESS; payload: boolean }
  | { type: ActionTypes.SET_TOUCHED; payload: { [key: string]: boolean } };

export type TripListAction =
  | { type: TripListActionTypes.SET_TRIPS; payload: Trip[] }
  | { type: TripListActionTypes.SET_LOADING; payload: boolean }
  | {
      type: TripListActionTypes.SET_EDIT_TRIP_ID;
      payload: string | null;
    }
  | {
      type: TripListActionTypes.SET_OPEN_DROPDOWN_ID;
      payload: string | null;
    };
