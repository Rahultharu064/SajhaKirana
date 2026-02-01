import type { Request, Response } from 'express';
import { wishlistService } from '../services/wishlistService';

export const getWishlist = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.userId;
        const result = await wishlistService.getUserWishlist(userId);
        res.status(200).json(result);
    } catch (error) {
        console.error('getWishlist error:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch wishlist' });
    }
};

export const addToWishlist = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.userId;
        const { productId } = req.body;

        if (!productId) {
            return res.status(400).json({ success: false, error: 'Product ID is required' });
        }

        const result = await wishlistService.addToWishlist(userId, parseInt(productId));
        res.status(200).json(result);
    } catch (error) {
        console.error('addToWishlist error:', error);
        res.status(500).json({ success: false, error: 'Failed to add to wishlist' });
    }
};

export const removeFromWishlist = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.userId;
        const { productId } = req.params;

        if (!productId) {
            return res.status(400).json({ success: false, error: 'Product ID is required' });
        }

        const result = await wishlistService.removeFromWishlist(userId, parseInt(productId));
        res.status(200).json(result);
    } catch (error) {
        console.error('removeFromWishlist error:', error);
        res.status(500).json({ success: false, error: 'Failed to remove from wishlist' });
    }
};

export const checkWishlistStatus = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.userId;
        const { productId } = req.params;

        if (!productId) {
            return res.status(400).json({ success: false, error: 'Product ID is required' });
        }

        const result = await wishlistService.checkIsWishlisted(userId, parseInt(productId));
        res.status(200).json({ success: true, ...result });
    } catch (error) {
        console.error('checkWishlistStatus error:', error);
        res.status(500).json({ success: false, error: 'Failed to check wishlist status' });
    }
};
