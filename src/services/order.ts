import { Router, Request, Response } from "express";
import prisma from "../lib/prisma";
import validateToken from "../middleware/JWTAuth";
import adminvalidation from "../middleware/AdminValidation";
import StringValidation from "../utils/StringValidation";

const router = Router();

router.post("/order", async (req: Request, res: Response) => {
  const validationResult = validateToken(req.headers.authorization!);

  if (typeof validationResult === "string") {
    return res.status(401).json({
      status: "error",
      message: validationResult,
    });
  }

  const { productId, quantity } = req.body;

  const validatedID = StringValidation(productId);
  if (validatedID.status === "error") {
    return res.status(400).json({
      status: "error",
      message: "Invalid Product Id",
    });
  }

  const validateQuantity = Numbervalidation(quantity);
  if (validateQuantity.status === "error") {
    return res.status(400).json({
      status: "error",
      message:
        "Invalid Quantity amount. Must be bigger than or equal to 1",
    });
  }

  const product = await prisma.product.findUnique({
    where: {
      id: validatedID.data,
    },
  });

  if (!product || product.isDeleted) {
    return res.status(404).json({
      status: "error",
      message: "Product not found",
    });
  }

  const ret = await prisma.order.create({
    data: {
      customerId: validationResult.id,
      productId: validatedID.data,
      quantity: validateQuantity.number
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
  const validationResult = await adminvalidation(req.headers.authorization!);

  if (typeof validationResult === "string") {
    return res.status(401).json({
      status: "error",
      message: validationResult,
    });
  }

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

router.get("/order/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  const validatedID = StringValidation(id);
  if (validatedID.status === "error") {
    return res.status(400).json({
      status: "error",
      message: "Invalid Review Id",
    });
  }
  
  const validationResult = validateToken(req.headers.authorization!);

  if(typeof validationResult === "string") {
    return res.status(401).json({
      status: "error",
      message: "Unauthorized action",
    });
  }

  const adminValidationResult = adminvalidation(req.headers.authorization!);

  const order = await prisma.order.findUnique({
    where: {
      id: validatedID.data,
      isDeleted: false
    }
  })

  const isAdmin = typeof adminValidationResult !== "string";
  const isOwner = validationResult.id === order!.customerId;

  if (!order || (!isOwner && !isAdmin)) {
    return res.status(401).json({
      status: "error",
      message: "Unauthorized action",
    });
  }

  res.json({
    status: "success",
    message: "Orders fetch successfull",
    data: order,
  });
})

router.get("/my-order", async (req: Request, res: Response) => {
  const validationResult = validateToken(req.headers.authorization!);

  if (typeof validationResult === "string") {
    return res.status(401).json({
      status: "error",
      message: validationResult,
    });
  }

  const orders = await prisma.order.findMany({
    where: {
      customerId: validationResult.id,
      isDeleted: false
    }
  })

  res.json({
    status: "success",
    message: "Orders fetch successfull",
    data: orders,
  });
})

router.patch("/order", async (req: Request, res: Response) => {
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

router.delete("/order", async (req: Request, res: Response) => {
  const validationResult = validateToken(req.headers.authorization!);

  if (typeof validationResult === "string") {
    return res.status(400).json({
      status: "error",
      message: validationResult,
    });
  }

  const adminValidationResult = adminvalidation(req.headers.authorization!);

  const { id } = req.body;

  const validatedID = StringValidation(id);
  if (validatedID.status === "error") {
    return res.status(400).json({
      status: "error",
      message: "Invalid Review Id",
    });
  }

  const order = await prisma.order.findUnique({
    where: {
      id: validatedID.data,
      isDeleted: false
    },
  });

  const isAdmin = typeof adminValidationResult !== "string";
  const isOwner = validationResult.id === order!.customerId;

  if (!order || (!isOwner && !isAdmin)) {
    return res.status(401).json({
      status: "error",
      message: "Unauthorized action",
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