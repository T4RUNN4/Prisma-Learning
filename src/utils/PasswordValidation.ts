import StringValidation from "./StringValidation";

type PasswordValidationResult =
  | {
      status: "success";
      password: string;
    }
  | {
      status: "error";
    };

const PasswordValidation = (text: unknown): PasswordValidationResult => {
  const stringValidatedPassword = StringValidation(text);

  if (stringValidatedPassword.status === "error" || stringValidatedPassword.data.length < 6) {
    return {
      status: "error",
    };
  }

  return {
    status: "success",
    password: stringValidatedPassword.data,
  };
};

export default PasswordValidation;
