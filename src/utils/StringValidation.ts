interface StringValidationResult {
  status: "success" | "error";
  data?: string;
}

const StringValidation = (text: unknown): StringValidationResult => {
  if (typeof text !== "string" || !text.trim()) {
    return {
      status: "error",
    };
  }

  return {
    status: "success",
    data: text.trim(),
  };
};

export default StringValidation;