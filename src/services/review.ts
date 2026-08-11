import { Router, Request, Response } from "express";
import prisma from "../lib/prisma";
import validateToken from "../middleware/JWTAuth";
import StringValidation from "../utils/StringValidation";

const router = Router();

router.post("/review", async (req: Request, res: Response) => {
  const validationResult = validateToken(req.headers.authorization!);

  if (typeof validationResult === "string") {
    return res.status(401).json({
      status: "error",
      message: validationResult,
    });
  } 

  const { productId, review } = req.body;

  const validatedID = StringValidation(productId);
  if (validatedID.status === "error") {
    return res.status(400).json({
      status: "error",
      message: "Invalid Product Id",
    });
  }

  const validatedReview = StringValidation(review);
  if (validatedReview.status === "error") {
    return res.status(400).json({
      status: "error",
      message: "Invalid Review",
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

  const ret = await prisma.review.create({
    data: {
        review: validatedReview.data,
        customerId: validationResult.id,
        productId: validatedID.data
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

router.get("/review/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  const validatedID = StringValidation(id);
  if (validatedID.status === "error") {
    return res.status(400).json({
      status: "error",
      message: "Invalid Review Id",
    });
  }

  const review = await prisma.review.findUnique({
    where: {
      id: validatedID.data
    }
  })

  if(!review || review.isDeleted) {
    return res.status(400).json({
      status: "error",
      message: "Review Not found",
    });
  }

  res.json({
    status: "success",
    message: "Review fetch successfull",
    data: review,
  });
})

router.patch("/review", async (req: Request, res: Response) => {
  const validationResult = validateToken(req.headers.authorization!);

  if (typeof validationResult === "string") {
    return res.status(401).json({
      status: "error",
      message: validationResult,
    });
  }

  const { id, review } = req.body;

  const validatedID = StringValidation(id);
  if (validatedID.status === "error") {
    return res.status(400).json({
      status: "error",
      message: "Invalid Product Id",
    });
  }

  const validatedReview = StringValidation(review);
  if (validatedReview.status === "error") {
    return res.status(400).json({
      status: "error",
      message: "Invalid Review",
    });
  }

  const currreview = await prisma.review.findUnique({
    where: {
      id: validatedID.data,
    },
  });

  if (!currreview || currreview.isDeleted) {
    return res.status(400).json({
      status: "error",
      message: "Review Not found",
    });
  }

  if (validationResult.id !== currreview.customerId) {
    return res.status(401).json({
      status: "error",
      message: "Unauthorized Action",
    });
  }

  const updatedReveiew = await prisma.review.update({
    where: { id: validatedID.data },
    data: { review: validatedReview.data },
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

router.delete("/review", async (req: Request, res: Response) => {
  const validationResult = validateToken(req.headers.authorization!);

  if (typeof validationResult === "string") {
    return res.status(400).json({
      status: "error",
      message: validationResult,
    });
  }

  const { id } = req.body;

  const validatedID = StringValidation(id);
  if (validatedID.status === "error") {
    return res.status(400).json({
      status: "error",
      message: "Invalid Product Id",
    });
  }

  const review = await prisma.review.findUnique({
    where: {
      id: validatedID.data
    }
  })

  if(!review || review.isDeleted) {
    return res.status(400).json({
      status: "error",
      message: "Review Not found",
    });
  }

  if (validationResult.id !== review.customerId) {
    return res.status(401).json({
      status: "error",
      message: "Unauthorized Action",
    });
  }

  await prisma.review.update({
    where: { id: validatedID.data },
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