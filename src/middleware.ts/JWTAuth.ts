import jwt from "jsonwebtoken";

const validateToken = (authHeader: string) => {
  if (!authHeader) {
    return "Authorization header missing";
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return "Token missing";
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    return decoded;
  } catch (err) {
    return "Invalid token";
  }
};

export default validateToken;