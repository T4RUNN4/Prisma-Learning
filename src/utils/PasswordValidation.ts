import StringValidation from "./StringValidation";

interface PasswordValidationResult {
  status: "success" | "error";
  data?: string;
}

const PasswordValidation = (text: unknown): PasswordValidationResult => {
  const stringValidatedPassword = StringValidation(text);

  if (stringValidatedPassword.status === "error" || stringValidatedPassword.data.length < 6) {
    return {
      status: "error",
    };
  }

  return {
    status: "success",
    data: stringValidatedPassword.data,
  };
};

export default PasswordValidation;
