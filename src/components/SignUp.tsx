import React, { useState } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { app } from "../firebase";
import classes from "../styles/SignUp.module.scss";
import { object, string, ValidationError } from "yup";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";

interface SignUpData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}
type FormError = {
  fieldName: keyof SignUpData;
  message: string;
};

const SignUp: React.FC = () => {
  const [signUpData, setSignUpData] = useState<SignUpData>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<FormError[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignUpData({ ...signUpData, [name]: value });
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    validateField(name, value);
  };

  const validateField = (name: string, value: string) => {
    try {
      const fieldSchema = object().shape({
        username:
          name === "username"
            ? string().required("Username is required")
            : string(),
        email:
          name === "email"
            ? string().email("Invalid email").required("Email is required")
            : string(),
        password:
          name === "password"
            ? string()
                .min(6, "Password must be at least 6 characters")
                .required("Password is required")
            : string(),
        confirmPassword:
          name === "confirmPassword"
            ? string()
                .oneOf([signUpData.password], "Passwords must match")
                .required("Confirm password is required")
            : string(),
      });

      fieldSchema.validateSyncAt(name, { [name]: value });
      setErrors((errors) => errors.filter((error) => error.fieldName !== name));
    } catch (error: any) {
      setErrors((errors) => [
        ...errors.filter((err) => err.fieldName !== name),
        { fieldName: name as keyof SignUpData, message: error.message },
      ]);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const schema = object().shape({
        username: string().required("Username is required"),
        email: string().email("Invalid email").required("Email is required"),
        password: string()
          .min(6, "Password must be at least 6 characters")
          .required("Password is required"),
        confirmPassword: string()
          .oneOf([signUpData.password], "Passwords must match")
          .required("Confirm password is required"),
      });

      await schema.validate(signUpData, { abortEarly: false });

      const auth = getAuth(app);

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        signUpData.email,
        signUpData.password
      );

      await addDoc(collection(db, "users"), {
        username: signUpData.username,
        email: signUpData.email,
        password: signUpData.password,
      });
    } catch (error: any) {
      console.error("Error during signup:", error);
      const validationErrors: FormError[] = error.inner.map((err: any) => ({
        fieldName: err.path as keyof SignUpData,
        message: err.message,
      }));
      setErrors(validationErrors);
    }
  };

  return (
    <>
      <form onSubmit={handleSignUp} className={classes.form}>
        <input
          type="text"
          id="username"
          name="username"
          placeholder="user name"
          value={signUpData.username}
          onChange={handleInputChange}
          onBlur={handleBlur}
          className={classes["form-input"]}
        />
        {errors.map(
          (error) =>
            error.fieldName === "username" && (
              <div
                key={error.fieldName}
                className={classes["form-input__error"]}
              >
                {error.message}
              </div>
            )
        )}
        <input
          type="email"
          id="email"
          name="email"
          placeholder="email"
          value={signUpData.email}
          onChange={handleInputChange}
          onBlur={handleBlur}
          className={classes["form-input"]}
        />

        {errors.map(
          (error) =>
            error.fieldName === "email" && (
              <div
                key={error.fieldName}
                className={classes["form-input__error"]}
              >
                {error.message}
              </div>
            )
        )}

        <input
          type="password"
          id="password"
          name="password"
          placeholder="password"
          value={signUpData.password}
          onChange={handleInputChange}
          onBlur={handleBlur}
          className={classes["form-input"]}
        />

        {errors.map(
          (error) =>
            error.fieldName === "password" && (
              <div
                key={error.fieldName}
                className={classes["form-input__error"]}
              >
                {error.message}
              </div>
            )
        )}

        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          placeholder="confirm password"
          value={signUpData.confirmPassword}
          onChange={handleInputChange}
          onBlur={handleBlur}
          className={classes["form-input"]}
        />

        {errors.map(
          (error) =>
            error.fieldName === "confirmPassword" && (
              <div
                key={error.fieldName}
                className={classes["form-input__error"]}
              >
                {error.message}
              </div>
            )
        )}

        <button type="submit" className={classes["form-btn__submit"]}>
          Sign up
        </button>
      </form>
    </>
  );
};

export default SignUp;
