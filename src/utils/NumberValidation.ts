type NumberValidationResult =
  | {
      status: "success";
      number: number;
    }
  | {
      status: "error";
    };

const Numbervalidation = (number: unknown): NumberValidationResult => {
  if (typeof number !== "number" || number < 0) {
    return {
      status: "error",
    };
  }

  return {
    status: "success",
    number: number
  }
};

export default Numbervalidation;