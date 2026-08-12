import { Router, Request, Response } from "express";
import prisma from "../lib/prisma";
import adminvalidation from "../middleware/AdminValidation";
import StringValidation from "../utils/StringValidation";

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

  const validatedTitle = StringValidation(title);
  if (validatedTitle.status === "error") {
    return res.status(400).json({
      status: "error",
      message: "Invalid name",
    });
  }

  const validateStock = Numbervalidation(stock);
  if (validateStock.status === "error") {
    return res.status(400).json({
      status: "error",
      message: "Invalid Stock amount. Stock must be a number and bigger than or equal to 0",
    });
  }
  
  const validatePrice = Numbervalidation(price);
  if (validatePrice.status === "error") {
    return res.status(400).json({
      status: "error",
      message: "Invalid Price amount. Price must be a number and bigger than or equal to 0",
    });
  }

  const product = await prisma.product.create({
    data: {
      title: validatedTitle.data,
      description: description,
      stock: validateStock.number,
      price: validatePrice.number,
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

router.get("/product/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const validatedID = StringValidation(id);

  if (validatedID.status === "error") {
    return res.status(400).json({
      status: "error",
      message: "Invalid Product ID",
    });
  }

  const product = await prisma.product.findUnique({
    where: { id: validatedID.data },
  });

  if (!product || product.isDeleted) {
    return res.status(404).json({
      status: "error",
      message: "product not found",
    });
  }

  res.json({
    status: "success",
    message: "Product fetch successfully",
    data: product,
  });
})

router.patch("/product", async (req: Request, res: Response) => {
  const validationResult = await adminvalidation(req.headers.authorization!);

  if (typeof validationResult === "string") {
    return res.status(401).json({
      status: "error",
      message: validationResult,
    });
  }

  const { id, title, description, stock, price } = req.body;
  
  const validateID = StringValidation(id);
  if (validateID.status === "error") {
    return res.status(400).json({
      status: "error",
      message: "Invalid ID",
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

  const product = await prisma.product.findUnique({
    where: { id: validateID.data },
  });

  if (!product || product.isDeleted) {
    return res.status(404).json({
      status: "error",
      message: "Product not found",
    });
  }

  const updatedProduct = await prisma.product.update({
    where: { id: validateID.data },
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
  const validateID = StringValidation(id);

  if (validateID.status === "error") {
    return res.status(400).json({
      status: "error",
      message: "Invalid ID",
    });
  }

  await prisma.product.update({
    where: { id: validateID.data },
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