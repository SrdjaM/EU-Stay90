import { ActionTypes } from "../common/enums/ActionTypes";

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

export type Action =
  | { type: typeof ActionTypes.SET_AUTH_DATA; payload: AuthData }
  | { type: typeof ActionTypes.SET_ERRORS; payload: FormError[] }
  | { type: typeof ActionTypes.SET_ERROR_MESSAGE; payload: string | null }
  | { type: typeof ActionTypes.SET_IS_SUCCESS; payload: boolean }
  | { type: ActionTypes.SET_TOUCHED; payload: { [key: string]: boolean } };
