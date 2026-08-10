import { Router, Request, Response } from "express";
import prisma from "../lib/prisma";
import validateToken from "../middleware/JWTAuth";
import adminvalidation from "../middleware/AdminValidation";

const router = Router();

router.post("/add-order", async (req: Request, res: Response) => {
  const validationResult = validateToken(req.headers.authorization!);

  if (typeof validationResult === "string") {
    return res.status(401).json({
      status: "error",
      message: validationResult,
    });
  }

  const { productId, quantity } = req.body;
  if (!productId || !quantity || quantity < 1) {
    return res.status(404).json({
      status: "error",
      message: "Product Id, Quantity is required",
    });
  }

  const ret = await prisma.order.create({
    data: {
      customerId: validationResult.id,
      productId,
      quantity
    },
  });

  return res.status(202).json({
    status: "success",
    message: "Order created successfully",
    data: {
      id: ret.id,
      customerId: ret.customerId,
      productId: ret.productId,
      quantity: ret.quantity,
    },
  });
});

router.get("/orders", async (req: Request, res: Response) => {
  const orders = await prisma.order.findMany({
    where: {
      isDeleted: false,
    },
  });

  res.json({
    status: "success",
    message: "Orders fetch successfull",
    data: orders,
  });
});

router.patch("/update-order", async (req: Request, res: Response) => {
  const validationResult = await adminvalidation(req.headers.authorization!);

  if (typeof validationResult === "string") {
    return res.status(401).json({
      status: "error",
      message: validationResult,
    });
  }

  const { id, status } = req.body;

  if (
    !id ||
    (status !== "Ordered" && status !== "Processing" && status !== "Delivered")
  ) {
    return res.status(400).json({
      status: "error",
      message: "Invalid order status",
    });
  }

  const updatedOrder = await prisma.order.update({
    where: { id: id },
    data: { status },
  });

  res.json({
    status: "success",
    message: "Review updated successfully",
    data: {
      id: updatedOrder.id,
      status: updatedOrder.status,
    },
  });
});

router.delete("/delete-order", async (req: Request, res: Response) => {
  const validationResult = validateToken(req.headers.authorization!);

  if (typeof validationResult === "string") {
    return res.status(400).json({
      status: "error",
      message: validationResult,
    });
  }

  const { id, customerId } = req.body;

  if (!id || !customerId) {
    return res.status(400).json({
      status: "error",
      message: "Order id and Customer id is required",
    });
  }

  if (validationResult.id !== customerId || validationResult.role !== "ADMIN") {
    return res.status(401).json({
      status: "error",
      message: "Unauthorized Action",
    });
  }

  await prisma.order.update({
    where: { id },
    data: {
      isDeleted: true,
    },
  });

  res.json({
    status: "success",
    message: "Order deleted successfully",
  });
});

export default router