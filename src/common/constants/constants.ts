export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 6,
};

export const ERROR_MESSAGES = {
  USERNAME_REQUIRED: "Username is required",
  EMAIL_REQUIRED: "Email is required",
  INVALID_EMAIL: "Invalid email",
  PASSWORD_REQUIRED: "Password is required",
  PASSWORD_MIN_LENGTH: `Password must be at least ${VALIDATION.PASSWORD_MIN_LENGTH} characters`,
  PASSWORDS_MUST_MATCH: "Passwords must match",
  CONFIRM_PASSWORD_REQUIRED: "Confirm password is required",
};
