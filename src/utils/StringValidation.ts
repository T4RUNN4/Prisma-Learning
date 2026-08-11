type StringValidationResult =
  | {
      status: "success";
      data: string;
    }
  | {
      status: "error";
    };

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
