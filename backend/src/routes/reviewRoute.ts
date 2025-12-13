import express from 'express';
import {
    createReview,
    getReviewsByProduct,
    getMyReviews,
    updateReview,
    deleteReview
} from '../controllers/reviewController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { validate as validateRequest } from '../middlewares/validate';
import {
    createReviewSchema,
    updateReviewSchema,
    reviewIdParamSchema,
    productIdParamSchema,
    searchReviewsSchema,
    userReviewsSchema
} from '../validators/reviewValidator';
import { uploadReviews } from '../config/multer';

const router = express.Router();

// Public routes
router.get(
    '/product/:productId',
    validateRequest(productIdParamSchema, 'params'),
    validateRequest(searchReviewsSchema, 'query'),
    getReviewsByProduct
);


// Protected routes (require authentication)
router.post(
    '/',
    authMiddleware,
    uploadReviews.array('media', 5),
    validateRequest(createReviewSchema, 'body'),
    createReview
);

router.get(
    '/my',
    authMiddleware,
    validateRequest(userReviewsSchema, 'query'),
    getMyReviews
);

router.put(
    '/:id',
    authMiddleware,
    validateRequest(reviewIdParamSchema, 'params'),
    validateRequest(updateReviewSchema, 'body'),
    updateReview
);

router.delete(
    '/:id',
    authMiddleware,
    validateRequest(reviewIdParamSchema, 'params'),
    deleteReview
);



export default router;
