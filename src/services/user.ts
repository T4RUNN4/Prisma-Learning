import { Router, Request, Response } from "express";
import bcrypt from "bcrypt";
import prisma from "../lib/prisma";
import jwt from "jsonwebtoken";
import validateToken from "../middleware.ts/JWTAuth";

const router = Router();

router.post("/register", async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      status: "error",
      message: "Name, email and password are required",
    });
  }

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return res.status(409).json({
      status: "error",
      message: "Email already registered",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  res.json({
    status: "success",
    message: "User created successfully",
    data: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  });
});

router.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      status: "error",
      message: "Email and password are required",
    });
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user || user.isDeleted) {
    return res.status(404).json({
      status: "error",
      message: "User not found",
    });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(401).json({
      status: "error",
      message: "Invalid password",
    });
  }

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    process.env.JWT_SECRET!,
    {
      expiresIn: "7d",
    },
  );

  res.json({
    status: "success",
    message: "User authenticated successfully",
    data: {
      id: user.id,
      name: user.name,
      email: user.email,
      token,
    },
  });
});

router.patch("/update", async (req: Request, res: Response) => {
  const validationResult = validateToken(req.headers.authorization!);

  if(typeof validationResult === "string") {
    return res.status(401).json({
      status: "error",
      message: validationResult,
    });
  }

  const { name, email } = req.body;
  if(!name && !email) {
    return res.status(404).json({
      status: "error",
      message: '"Either name or email is required',
    });
  }

  const updatedUser = await prisma.user.update({
    where: { id: validationResult.id },
    data: { name, email },
  });

  res.json({
    status: "success",
    message: "User updated successfully",
    data: {
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
    },
  });
});

router.delete("/delete", async (req: Request, res: Response) => {
  const validationResult = validateToken(req.headers.authorization!);

  if (typeof validationResult === "string") {
    return res.status(401).json({
      status: "error",
      message: validationResult,
    });
  }

  await prisma.user.update({
    where: { id: validationResult.id },
    data: { isDeleted: true },
  });

  res.json({
    status: "success",
    message: "User deleted successfully",
  });
});

export default router
