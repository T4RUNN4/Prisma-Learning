import { Router } from "express";

import users from "../services/user";
import products from "../services/product"
import review from "../services/review"

const router = Router();

router.use("/", users);
router.use("/", products);
router.use("/", review);

export default router;