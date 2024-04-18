import { AuthFormState, Action } from "../../utils/types";
import { ActionTypes } from "../enums/ActionTypes";

export const initialState: AuthFormState = {
  authData: { email: "", password: "" },
  errors: [],
  errorMessage: null,
  isSuccess: false,
};

export const reducer = (state: AuthFormState, action: Action): AuthFormState => {
  switch (action.type) {
    case ActionTypes.SET_AUTH_DATA:
      return { ...state, authData: action.payload };
    case ActionTypes.SET_ERRORS:
      return { ...state, errors: action.payload };
    case ActionTypes.SET_ERROR_MESSAGE:
      return { ...state, errorMessage: action.payload };
    case ActionTypes.SET_IS_SUCCESS:
      return { ...state, isSuccess: action.payload };
    default:
      return state;
  }
};