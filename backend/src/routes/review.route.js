import express from "express";
import {
  createOrUpdateReview,
  getProductReviews,
  deleteReview,
} from "../controllers/review.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Public: get reviews for a product
router.get("/:productId", protectRoute, getProductReviews);

// Private: create/update a review
router.post("/:productId", protectRoute, createOrUpdateReview);

// Private: delete review (user or admin)
router.delete("/:reviewId", protectRoute, deleteReview);

export default router;
