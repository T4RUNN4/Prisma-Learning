import { Router, Request, Response } from "express";
import prisma from "../lib/prisma";
import validateToken from "../middleware/JWTAuth";
import adminvalidation from "../middleware/AdminValidation";

const router = Router();

export default router