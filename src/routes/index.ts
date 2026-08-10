import { Router } from "express";
import users from "../services/user";

const router = Router();

router.use("/", users);

export default router;