import React, { useEffect, useReducer, useState } from "react";
import { object, string } from "yup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

import { FieldNames } from "../common/enums/FieldNames";
import { ActionTypes } from "../common/enums/ActionTypes";
import { useAuthentication } from "../common/hooks/AuthHooks";
import { useLocation, useNavigate } from "react-router-dom";
import { ERROR_MESSAGES, ROUTES, UI_TEXT } from "../common/constants/constants";
import { reducer, initialState } from "../common/hooks/authReducer";
import { AuthData } from "../utils/types";
import Button from "./Button";
import classes from "../styles/AuthForm.module.scss";

const PASSWORD_MIN_CHAR = 6;

const AuthForm: React.FC = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { signIn, signUp } = useAuthentication();

  const location = useLocation();
  const navigate = useNavigate();

  const isSignIn = location.pathname === ROUTES.SIGN_IN;

  useEffect(() => {
    resetFormData();
  }, [location.pathname]);

  const resetFormData = () => {
    dispatch({
      type: ActionTypes.SET_AUTH_DATA,
      payload: { email: "", password: "" },
    });
    dispatch({ type: ActionTypes.SET_ERRORS, payload: [] });
    dispatch({ type: ActionTypes.SET_ERROR_MESSAGE, payload: null });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    dispatch({
      type: ActionTypes.SET_AUTH_DATA,
      payload: { ...state.authData, [name]: value },
    });
    if (state.touched[name]) {
      validateField(name, value);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    dispatch({
      type: ActionTypes.SET_TOUCHED,
      payload: { [name]: true },
    });
    validateField(name, value);
  };

  const validateField = (name: string, value: string) => {
    try {
      const fieldSchema = object().shape({
        username:
          !isSignIn && name === FieldNames.Username
            ? string().required(ERROR_MESSAGES.USERNAME_REQUIRED)
            : string(),
        email:
          name === FieldNames.Email
            ? string()
                .email(ERROR_MESSAGES.INVALID_EMAIL)
                .required(ERROR_MESSAGES.EMAIL_REQUIRED)
            : string(),
        password:
          name === FieldNames.Password
            ? string()
                .min(PASSWORD_MIN_CHAR, ERROR_MESSAGES.PASSWORD_MIN_LENGTH)
                .required(ERROR_MESSAGES.PASSWORD_REQUIRED)
            : string(),
        confirmPassword:
          !isSignIn && name === FieldNames.ConfirmPassword
            ? string()
                .oneOf(
                  [state.authData.password],
                  ERROR_MESSAGES.PASSWORDS_MUST_MATCH
                )
                .required(ERROR_MESSAGES.CONFIRM_PASSWORD_REQUIRED)
            : string(),
      });

      fieldSchema.validateSyncAt(name, { [name]: value });
      dispatch({
        type: ActionTypes.SET_ERRORS,
        payload: state.errors.filter((error) => error.fieldName !== name),
      });
    } catch (error: any) {
      dispatch({
        type: ActionTypes.SET_ERRORS,
        payload: [
          ...state.errors.filter((error) => error.fieldName !== name),
          { fieldName: name as keyof AuthData, message: error.message },
        ],
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const onSuccess = () => {
      resetFormData();
      navigate("/");
    };

    try {
      if (isSignIn) {
        await signIn(state.authData, onSuccess);
        navigate(ROUTES.HOME);
      } else {
        await signUp(state.authData, onSuccess);
        dispatch({ type: ActionTypes.SET_IS_SUCCESS, payload: true });
        navigate(ROUTES.SIGN_IN);
      }
    } catch (error: any) {
      if (error.message === "auth/invalid-credential") {
        dispatch({
          type: ActionTypes.SET_ERROR_MESSAGE,
          payload: ERROR_MESSAGES.INVALID_EMAIL_OR_PASSWORD,
        });
      } else if (error.message === "auth/too-many-requests") {
        dispatch({
          type: ActionTypes.SET_ERROR_MESSAGE,
          payload: ERROR_MESSAGES.TO_MANY_REQUESTS,
        });
      } else if (error.message === "auth/email-already-in-use") {
        dispatch({
          type: ActionTypes.SET_ERROR_MESSAGE,
          payload: ERROR_MESSAGES.EMAIL_IN_USE,
        });
      }
    }
  };

  const isFormValid = () => {
    if (isSignIn) {
      return (
        state.authData.email &&
        state.authData.password &&
        state.errors.length === 0
      );
    } else {
      return (
        state.authData.email &&
        state.authData.password &&
        state.authData.username &&
        state.authData.confirmPassword &&
        state.errors.length === 0
      );
    }
  };

  const renderErrorMessage = (fieldName: string, message: string) => {
    return (
      <div key={fieldName} className={classes["form-input__error"]}>
        {message}
      </div>
    );
  };

  const renderFieldErrorMessage = (fieldName: string) => {
    const error = state.errors.find((error) => error.fieldName === fieldName);
    if (error) {
      return renderErrorMessage(fieldName, error.message);
    }
    return null;
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  useEffect(() => {
    resetFormData();
  }, [location.pathname]);

  return (
    <form onSubmit={handleSubmit} className={classes.form}>
      {state.isSuccess && (
        <div className={classes["success-message"]}>Successful sign up!</div>
      )}
      {!isSignIn && (
        <div>
          <input
            type="text"
            id={FieldNames.Username}
            name={FieldNames.Username}
            placeholder="Username"
            value={state.authData.username || ""}
            onChange={handleInputChange}
            onBlur={handleBlur}
            className={classes["form-input"]}
          />
          {renderFieldErrorMessage("username")}
        </div>
      )}
      <div>
        <input
          type="email"
          id={FieldNames.Email}
          name={FieldNames.Email}
          placeholder="Email"
          value={state.authData.email}
          onChange={handleInputChange}
          onBlur={handleBlur}
          className={classes["form-input"]}
        />
        {renderFieldErrorMessage("email")}
      </div>
      <div className={classes["input-password"]}>
        <input
          type={showPassword ? "text" : "password"}
          id={FieldNames.Password}
          name={FieldNames.Password}
          placeholder="Password"
          value={state.authData.password}
          onChange={handleInputChange}
          onBlur={handleBlur}
          className={classes["form-input"]}
        />
        <div className={classes["toggle-password"]}>
          <FontAwesomeIcon
            icon={showPassword ? faEyeSlash : faEye}
            onClick={togglePasswordVisibility}
          />
        </div>
      </div>
      {renderFieldErrorMessage("password")}
      <div>
        {!isSignIn && (
          <>
            <div className={classes["input-password"]}>
              <input
                type={showConfirmPassword ? "text" : "password"}
                id={FieldNames.ConfirmPassword}
                name={FieldNames.ConfirmPassword}
                placeholder="Confirm Password"
                value={state.authData.confirmPassword || ""}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={classes["form-input"]}
              />
              <div className={classes["toggle-password"]}>
                <FontAwesomeIcon
                  icon={showConfirmPassword ? faEyeSlash : faEye}
                  onClick={toggleConfirmPasswordVisibility}
                />
              </div>
            </div>
            {renderFieldErrorMessage("confirmPassword")}
          </>
        )}
      </div>
      <div className={classes["btn-container"]}>
        <Button type="submit" variant="secondary" disabled={!isFormValid()}>
          {isSignIn ? UI_TEXT.SIGN_IN : UI_TEXT.SIGN_UP}
        </Button>
      </div>
      {state.errorMessage && (
        <div className={classes["form-input__error"]}>{state.errorMessage}</div>
      )}
    </form>
  );
};

export default AuthForm;
