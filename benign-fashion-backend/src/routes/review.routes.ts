import { Router } from "express";
import {
  addReviewController,
  getReviewsByProductController,
  deleteReviewController,
} from "../controllers/review.controller";
import { authenticateUser } from "../middlewares/auth.middleware";


const router = Router();

// POST /reviews
router.post("/create-reviews", authenticateUser, addReviewController);

// GET /products/:id/reviews
router.get("/products/:id/reviews", getReviewsByProductController);

// DELETE /reviews/:id
router.delete("/delete-reviews/:id", authenticateUser, deleteReviewController);

export default router;
