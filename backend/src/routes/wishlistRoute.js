import express from 'express';
import { authenticate } from '../middlewares/authMiddleware';
import { getWishlist, addToWishlist, removeFromWishlist, checkWishlistStatus } from '../controllers/wishlistController';
const router = express.Router();
router.use(authenticate);
router.get('/', getWishlist);
router.post('/', addToWishlist);
router.delete('/:productId', removeFromWishlist);
router.get('/:productId/check', checkWishlistStatus);
export default router;
//# sourceMappingURL=wishlistRoute.js.map