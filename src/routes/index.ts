import { Router } from "express";
import users from "../services/user";
import products from "../services/product"

const router = Router();

router.use("/", users);
router.use("/", products);

export default router;