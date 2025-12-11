import { Router } from "express";
import {
  createReview,
  getAllReviews,
  getReviewById,
  getReviewsByProduct,
  getMyReviews,
  updateReview,
  deleteReview,
} from "../controllers/reviewController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { validate } from "../middlewares/validate";
import {
  createReviewSchema,
  updateReviewSchema,
  reviewIdParamSchema,
  productIdParamSchema,
  searchReviewsSchema,
} from "../validators/reviewValidator";

const router = Router();

// Public routes (no authentication required)
// Get reviews for a specific product - PUBLIC
router.get(
  "/product/:productId",
  validate(productIdParamSchema, "params"),
  validate(searchReviewsSchema, "query"),
  getReviewsByProduct
);

// Get all reviews with optional filtering - PUBLIC (for browsing)
router.get("/", validate(searchReviewsSchema, "query"), getAllReviews);

// Get specific review by ID - PUBLIC
router.get("/:id", validate(reviewIdParamSchema, "params"), getReviewById);

// Protected routes (authentication required)
// Create a new review - REQUIRES AUTH
router.post("/", authMiddleware, validate(createReviewSchema), createReview);

// Get reviews by current user - REQUIRES AUTH
router.get("/my", authMiddleware, validate(searchReviewsSchema, "query"), getMyReviews);

// Update a review (only review owner) - REQUIRES AUTH
router.put("/:id", authMiddleware, validate(reviewIdParamSchema, "params"), validate(updateReviewSchema), updateReview);

// Delete a review (review owner or admin) - REQUIRES AUTH
router.delete("/:id", authMiddleware, validate(reviewIdParamSchema, "params"), deleteReview);

export default router;
