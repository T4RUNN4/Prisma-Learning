import { Router, Request, Response } from "express";
import prisma from "../lib/prisma";
import adminvalidation from "../middleware/AdminValidation";

const router = Router();

router.post("/product", async (req: Request, res: Response) => {
  const validationResult = await adminvalidation(req.headers.authorization!);

  if (typeof validationResult === "string") {
    return res.status(401).json({
      status: "error",
      message: validationResult,
    });
  }

  const { title, description, stock, price } = req.body;
  if (!title || !stock || !price) {
    return res.status(400).json({
      status: "error",
      message: "Title, Stock and Price are required",
    });
  }

  const product = await prisma.product.create({
    data: {
      title,
      description,
      stock,
      price,
    },
  });

  res.json({
    status: "success",
    message: "Product created successfully",
    data: {
      id: product.id,
      title: product.title,
      stock: product.stock,
      price: product.price,
    },
  });
});

router.get("/products", async (req: Request, res: Response) => {
  const products = await prisma.product.findMany({
    where: {
      isDeleted: false,
    },
  });

  res.json({
    status: "success",
    message: "Products fetch successfull",
    data: products,
  });
});

router.patch("/product", async (req: Request, res: Response) => {
  const validationResult = await adminvalidation(req.headers.authorization!);

  if (typeof validationResult === "string") {
    return res.status(401).json({
      status: "error",
      message: validationResult,
    });
  }

  const { id, title, description, stock, price } = req.body;

  if (!id) {
    return res.status(400).json({
      status: "error",
      message: "Product Id is required",
    });
  }

  if (
    title === undefined &&
    description === undefined &&
    stock === undefined &&
    price === undefined
  ) {
    return res.status(400).json({
      status: "error",
      message: "At least one property is required",
    });
  }

  const updatedProduct = await prisma.product.update({
    where: { id: id },
    data: { title, description, stock, price },
  });

  res.json({
    status: "success",
    message: "Product updated successfully",
    data: {
      id: updatedProduct.id,
      title: updatedProduct.title,
      description: updatedProduct.description,
      stock: updatedProduct.stock,
      price: updatedProduct.price,
    },
  });
});

router.delete("/product", async (req: Request, res: Response) => {
  const validationResult = await adminvalidation(req.headers.authorization!);

  if (typeof validationResult === "string") {
    return res.status(400).json({
      status: "error",
      message: validationResult,
    });
  }

  const { id } = req.body;
  if (!id) {
    return res.status(400).json({
      status: "error",
      message: "Atlest one property is required",
    });
  }

  await prisma.product.update({
    where: { id },
    data: {
      isDeleted: true,
    },
  });

  res.json({
    status: "success",
    message: "Product deleted successfully",
  });
});

export default router