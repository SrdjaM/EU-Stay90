import React, { useEffect, useState } from "react";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { app } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";
import { object, string } from "yup";
import { useAuth } from "../contexts/AuthContext";
import classes from "../styles/AuthForm.module.scss";
import { FieldNames } from "../common/enums/FieldNames";
import { ErrorMessage } from "../common/constants/errorMessage";
import { ERROR_MESSAGES } from "../common/constants/constants";

interface AuthFormProps {
  isSignIn: boolean;
  setIsSignIn: (value: boolean) => void;
}

interface AuthData {
  username?: string;
  email: string;
  password: string;
  confirmPassword?: string;
}

type FormError = {
  fieldName: keyof AuthData;
  message: string;
};

const AuthForm: React.FC<AuthFormProps> = ({ isSignIn, setIsSignIn }) => {
  const [authData, setAuthData] = useState<AuthData>({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<FormError[]>([]);
  const [error, setError] = useState<string>("");

  const { login } = useAuth();

  useEffect(() => {
    setAuthData({
      email: "",
      password: "",
      username: "",
      confirmPassword: "",
    });
    setErrors([]);
    setError("");
  }, [isSignIn]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAuthData({ ...authData, [name]: value });
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
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
                .min(6, ERROR_MESSAGES.PASSWORD_MIN_LENGTH)
                .required(ERROR_MESSAGES.PASSWORD_REQUIRED)
            : string(),
        confirmPassword:
          !isSignIn && name === FieldNames.ConfirmPassword
            ? string()
                .oneOf([authData.password], ERROR_MESSAGES.PASSWORDS_MUST_MATCH)
                .required(ERROR_MESSAGES.CONFIRM_PASSWORD_REQUIRED)
            : string(),
      });

      fieldSchema.validateSyncAt(name, { [name]: value });
      setErrors((errors) => errors.filter((error) => error.fieldName !== name));
    } catch (error: any) {
      setErrors((errors) => [
        ...errors.filter((err) => err.fieldName !== name),
        { fieldName: name as keyof AuthData, message: error.message },
      ]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const schema = object().shape({
        username: !isSignIn
          ? string().required("Username is required")
          : string().notRequired(),
        email: string().email("Invalid email").required("Email is required"),
        password: string().min(6, "Password must be at least 6 characters"),
        confirmPassword: !isSignIn
          ? string()
              .oneOf([authData.password], "Passwords must match")
              .required("Confirm password is required")
          : string().notRequired(),
      });

      await schema.validate(authData, { abortEarly: false });

      const auth = getAuth(app);

      if (isSignIn) {
        await signInWithEmailAndPassword(
          auth,
          authData.email,
          authData.password
        );
        login();
      } else {
        await createUserWithEmailAndPassword(
          auth,
          authData.email,
          authData.password
        );
        await addDoc(collection(db, "users"), {
          username: authData.username,
          email: authData.email,
          password: authData.password,
        });

        setIsSignIn(true);
      }

      setAuthData({
        email: "",
        password: "",
        username: "",
        confirmPassword: "",
      });
    } catch (error: any) {
      if (error.code === "auth/invalid-credential") {
        setError("Invalid email or password!");
      } else if (error.code === "auth/too-many-requests") {
        setError("Too many requests, try again later!");
      } else {
        const validationErrors: FormError[] = error.inner.map((err: any) => ({
          fieldName: err.path as keyof AuthData,
          message: err.message,
        }));
        setErrors(validationErrors);
      }
    }
  };

  const isFormValid = () => {
    if (isSignIn) {
      return authData.email && authData.password && errors.length === 0;
    } else {
      return (
        authData.email &&
        authData.password &&
        authData.username &&
        authData.confirmPassword &&
        errors.length === 0
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
    const error = errors.find((error) => error.fieldName === fieldName);
    if (error) {
      return renderErrorMessage(fieldName, error.message);
    }
    return null;
  };
  return (
    <form onSubmit={handleSubmit} className={classes.form}>
      {!isSignIn && (
        <div>
          <input
            type="text"
            id="username"
            name="username"
            placeholder="Username"
            value={authData.username}
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
          id="email"
          name="email"
          placeholder="Email"
          value={authData.email}
          onChange={handleInputChange}
          onBlur={handleBlur}
          className={classes["form-input"]}
        />
        {renderFieldErrorMessage("email")}
      </div>
      <div>
        <input
          type="password"
          id="password"
          name="password"
          placeholder="Password"
          value={authData.password}
          onChange={handleInputChange}
          onBlur={handleBlur}
          className={classes["form-input"]}
        />
        {renderFieldErrorMessage("password")}
      </div>
      <div>
        {!isSignIn && (
          <div>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={authData.confirmPassword}
              onChange={handleInputChange}
              onBlur={handleBlur}
              className={classes["form-input"]}
            />
            {renderFieldErrorMessage("confirmPassword")}
          </div>
        )}
      </div>
      <button
        type="submit"
        className={classes["form-btn__submit"]}
        disabled={!isFormValid()}
      >
        {isSignIn ? "Sign In" : "Sign Up"}
      </button>
      {error && <div className={classes["form-input__error"]}>{error}</div>}
    </form>
  );
};

export default AuthForm;
