import prisma from "../lib/prisma";
import validateToken from "./JWTAuth";

const adminvalidation = async (authHeader: string) => {
  const jwtValidation = validateToken(authHeader);

  if (typeof jwtValidation === "string") {
    return jwtValidation;
  }

  const user = await prisma.user.findUnique({
    where: {
      id: jwtValidation.id,
    },
  });

  if (!user || user.isDeleted) {
    return "User not found";
  }

  if (user.role !== "ADMIN") {
    return "Unauthorized Operations";
  }
};

export default adminvalidation;
