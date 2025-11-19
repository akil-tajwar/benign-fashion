import { Request, Response, NextFunction } from "express";
import * as reviewService from "../services/review.service";
import { z } from "zod";
import { promises } from "dns";

const ReviewSchema = z.object({
  productId: z.number(),
  rating: z.number().min(1).max(5),
  comment: z.string().max(500).optional(),
});

// ✅ POST /reviews

export const addReviewController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { productId, rating, comment } = ReviewSchema.parse(req.body);

    if (!req.user || !req.user.userId) {
      res
        .status(401)
        .json({ status: "error", message: "Unauthorized: user not found" });
      return; // 👈 stop execution
    }

    const userId = req.user.userId;

    const review = await reviewService.addReview(
      userId,
      productId,
      rating,
      comment
    );

    res.json({ status: "success", data: review });
  } catch (err) {
    next(err);
  }
};

// ✅ GET /products/:id/reviews
export const getReviewsByProductController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const productId = Number(req.params.id);
    const reviews = await reviewService.getReviewsByProduct(productId);

    res.json({ status: "success", data: reviews });
  } catch (err) {
    next(err);
  }
};

// ✅ DELETE /reviews/:id
export const deleteReviewController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const reviewId = Number(req.params.id);
    const userId = req.user?.userId;
    const isAdmin =
      req.user &&
      typeof req.user.role === "string" &&
      req.user.role === "admin";

    if (typeof userId !== "number") {
      res
        .status(401)
        .json({ status: "error", message: "Unauthorized: user not found" });
      return; // 👈 stop here instead of returning res
    }

    await reviewService.deleteReview(reviewId, userId, isAdmin);

    res.json({ status: "success", message: "Review deleted" });
  } catch (err) {
    next(err);
  }
};