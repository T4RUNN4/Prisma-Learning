import StringValidation from "./StringValidation";

interface EmailValidationResult {
  status: "success" | "error";
  email?: string;
}

const EmailValidation = (email: unknown): EmailValidationResult => {
  const stringValidatedEmail = StringValidation(email);

  if (stringValidatedEmail.status === "error") {
    return {
      status: "error",
    };
  }

  const normalizedEmail = stringValidatedEmail.data.toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(normalizedEmail)) {
    return {
      status: "error",
    };
  }

  return {
    status: "success",
    email: normalizedEmail,
  };
};

export default EmailValidation;
