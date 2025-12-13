import express from 'express';
import {
    getPendingReviews,
    approveReview,
    rejectReview,
    bulkApproveReviews,
    bulkRejectReviews
} from '../controllers/reviewController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { adminMiddleware } from '../middlewares/adminMiddleware';
import { validate as validateRequest } from '../middlewares/validate';
import { reviewIdParamSchema } from '../validators/reviewValidator';

const router = express.Router();

// Note: These admin routes are mounted at "/admin/reviews" in app.ts
// So the actual endpoints will be /admin/reviews/pending, /admin/reviews/:id/approve, etc.

router.get(
    '/pending',
    authMiddleware,
    adminMiddleware,
    getPendingReviews
);

router.put(
    '/:id/approve',
    authMiddleware,
    adminMiddleware,
    validateRequest(reviewIdParamSchema, 'params'),
    approveReview
);

router.put(
    '/:id/reject',
    authMiddleware,
    adminMiddleware,
    validateRequest(reviewIdParamSchema, 'params'),
    rejectReview
);

router.post(
    '/bulk-approve',
    authMiddleware,
    adminMiddleware,
    bulkApproveReviews
);

router.post(
    '/bulk-reject',
    authMiddleware,
    adminMiddleware,
    bulkRejectReviews
);

export default router;
