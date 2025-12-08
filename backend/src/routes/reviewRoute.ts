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

// All routes require authentication
router.use(authMiddleware);

// Create a new review
router.post("/", validate(createReviewSchema), createReview);

// Get all reviews with optional filtering (admin route)
router.get("/", validate(searchReviewsSchema, "query"), getAllReviews);

// Get reviews by current user
router.get("/my", validate(searchReviewsSchema, "query"), getMyReviews);

// Get reviews for a specific product
router.get(
  "/product/:productId",
  validate(productIdParamSchema, "params"),
  validate(searchReviewsSchema, "query"),
  getReviewsByProduct
);

// Get specific review by ID
router.get("/:id", validate(reviewIdParamSchema, "params"), getReviewById);

// Update a review (only review owner)
router.put("/:id", validate(reviewIdParamSchema, "params"), validate(updateReviewSchema), updateReview);

// Delete a review (review owner or admin)
router.delete("/:id", validate(reviewIdParamSchema, "params"), deleteReview);

export default router;
