import { Router, Request, Response } from "express";
import prisma from "../lib/prisma";
import validateToken from "../middleware/JWTAuth";

const router = Router();

router.post("/add-review", async (req: Request, res: Response) => {
  const validationResult = validateToken(req.headers.authorization!);

  if (typeof validationResult === "string") {
    return res.status(401).json({
      status: "error",
      message: validationResult,
    });
  } 

  const { productId, review } = req.body;
  if(!productId || !review) {
    return res.status(404).json({
      status: "error",
      message: "Product Id, Customer Id and Review is required",
    });
  }

  const ret = await prisma.review.create({
    data: {
        review,
        customerId: validationResult.id,
        productId
    }
  });

  return res.status(202).json({
    status: "success",
    message: "Review created successfully",
    data: {
      id: ret.id,
      review: ret.review,
      customerId: ret.customerId,
      productId: ret.productId,
    },
  });
})

router.get("/reviews", async (req: Request, res: Response) => {
  const reviews = await prisma.review.findMany({
    where: {
      isDeleted: false,
    },
  });

  res.json({
    status: "success",
    message: "reviews fetch successfull",
    data: reviews,
  });
});

router.patch("/update-review", async (req: Request, res: Response) => {
  const validationResult = validateToken(req.headers.authorization!);

  if (typeof validationResult === "string") {
    return res.status(401).json({
      status: "error",
      message: validationResult,
    });
  }

  const { id, customerId, review } = req.body;

  if (!id || !customerId|| !review) {
    return res.status(400).json({
      status: "error",
      message: "Review Id and Review is required",
    });
  }

  if (validationResult.id !== customerId) {
    return res.status(401).json({
      status: "error",
      message: "Unauthorized Action",
    });
  }

  const updatedReveiew = await prisma.review.update({
    where: { id: id },
    data: { review },
  });

  res.json({
    status: "success",
    message: "Review updated successfully",
    data: {
      id: updatedReveiew.id,
      review: updatedReveiew.review,
    },
  });
});

router.delete("/delete-review", async (req: Request, res: Response) => {
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
      message: "Review Id and Customer Id is required",
    });
  }

  if (validationResult.id !== customerId) {
    return res.status(401).json({
      status: "error",
      message: "Unauthorized Action",
    });
  }

  await prisma.review.update({
    where: { id },
    data: {
      isDeleted: true,
    },
  });

  res.json({
    status: "success",
    message: "Review deleted successfully",
  });
});

export default router