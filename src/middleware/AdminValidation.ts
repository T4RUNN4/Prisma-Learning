import prisma from "../lib/prisma";
import validateToken from "./JWTAuth";

const adminvalidation = async (authHeader: string) => {
  const jwtValidation = validateToken(authHeader);

  if (typeof jwtValidation === "string") {
    return jwtValidation;
  }

  const user = await prisma.user.findFirst({
    where: { id: jwtValidation.id },
  });

  if (!user) {
    return "User not found";
  }

  if (user.role === "USER") {
    return "Unauthorized Operations";
  }
};

export default adminvalidation;