import type { Request, Response, NextFunction } from "express";
import { prismaClient } from "../config/client";

// Create a new review
export const createReview = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { productId, rating, comment } = req.body;
    const userId = (req as any).user.id;

    // Convert string inputs to numbers
    const parsedProductId = parseInt(productId);
    const parsedRating = parseInt(rating);

    if (isNaN(parsedProductId) || isNaN(parsedRating)) {
      return res.status(400).json({
        success: false,
        error: {
          code: "INVALID_INPUT",
          message: "Invalid numeric values for productId or rating",
        },
      });
    }

    // Check if product exists and is active
    const product = await prismaClient.product.findFirst({
      where: {
        id: parsedProductId,
        isActive: true,
      },
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        error: {
          code: "PRODUCT_NOT_FOUND",
          message: "Product not found or inactive",
        },
      });
    }

    // Check if user has already reviewed this product
    const existingReview = await prismaClient.review.findUnique({
      where: {
        productId_userId: {
          productId: parsedProductId,
          userId: userId,
        },
      },
    });

    if (existingReview) {
      return res.status(409).json({
        success: false,
        error: {
          code: "REVIEW_EXISTS",
          message: "You have already reviewed this product",
        },
      });
    }

    // Create the review
    const review = await prismaClient.review.create({
      data: {
        productId: parsedProductId,
        userId: userId,
        rating: parsedRating,
        comment: comment.trim(),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            profileImage: true,
          },
        },
        product: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
    });

    return res.status(201).json({
      success: true,
      message: "Review created successfully",
      data: review,
    });
  } catch (error) {
    next(error);
  }
};

// Get all reviews with filters and pagination
export const getAllReviews = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      productId,
      userId,
      rating,
      sort = "newest",
      page = 1,
      limit = 10,
    } = req.query;

    // Build where clause
    const where: any = {};

    if (productId) {
      where.productId = parseInt(productId as string);
    }

    if (userId) {
      where.userId = parseInt(userId as string);
    }

    if (rating) {
      where.rating = parseInt(rating as string);
    }

    // Build orderBy
    const orderByMap: any = {
      newest: { createdAt: "desc" },
      oldest: { createdAt: "asc" },
      highest: { rating: "desc" },
      lowest: { rating: "asc" },
    };

    const orderBy = orderByMap[sort as string] || { createdAt: "desc" };

    // Pagination
    const pageNum = Math.max(1, parseInt(page as string) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit as string) || 10));
    const skip = (pageNum - 1) * limitNum;

    // Get reviews and count
    const [reviews, total] = await Promise.all([
      prismaClient.review.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              profileImage: true,
            },
          },
          product: {
            select: {
              id: true,
              title: true,
              slug: true,
            },
          },
        },
        orderBy,
        skip,
        take: limitNum,
      }),
      prismaClient.review.count({ where }),
    ]);

    return res.status(200).json({
      success: true,
      message: "Reviews retrieved successfully",
      data: reviews,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get review by ID
export const getReviewById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params as { id: string };

    const reviewId = parseInt(id);
    if (isNaN(reviewId)) {
      return res.status(400).json({
        success: false,
        error: {
          code: "INVALID_ID",
          message: "Invalid review ID",
        },
      });
    }

    const review = await prismaClient.review.findUnique({
      where: { id: reviewId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            profileImage: true,
          },
        },
        product: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        error: {
          code: "REVIEW_NOT_FOUND",
          message: "Review not found",
        },
      });
    }

    return res.status(200).json({
      success: true,
      message: "Review retrieved successfully",
      data: review,
    });
  } catch (error) {
    next(error);
  }
};

// Get reviews by product
export const getReviewsByProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { productId } = req.params as { productId: string };
    const { sort = "newest", page = 1, limit = 10 } = req.query;

    const parsedProductId = parseInt(productId);
    if (isNaN(parsedProductId)) {
      return res.status(400).json({
        success: false,
        error: {
          code: "INVALID_PRODUCT_ID",
          message: "Invalid product ID",
        },
      });
    }

    // Check if product exists
    const product = await prismaClient.product.findFirst({
      where: {
        id: parsedProductId,
        isActive: true,
      },
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        error: {
          code: "PRODUCT_NOT_FOUND",
          message: "Product not found or inactive",
        },
      });
    }

    // Build orderBy
    const orderByMap: any = {
      newest: { createdAt: "desc" },
      oldest: { createdAt: "asc" },
      highest: { rating: "desc" },
      lowest: { rating: "asc" },
    };

    const orderBy = orderByMap[sort as string] || { createdAt: "desc" };

    // Pagination
    const pageNum = Math.max(1, parseInt(page as string) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit as string) || 10));
    const skip = (pageNum - 1) * limitNum;

    // Get reviews and count
    const [reviews, total] = await Promise.all([
      prismaClient.review.findMany({
        where: { productId: parsedProductId },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              profileImage: true,
            },
          },
          product: {
            select: {
              id: true,
              title: true,
              slug: true,
            },
          },
        },
        orderBy,
        skip,
        take: limitNum,
      }),
      prismaClient.review.count({
        where: { productId: parsedProductId },
      }),
    ]);

    // Calculate average rating
    const ratingStats = await prismaClient.review.aggregate({
      where: { productId: parsedProductId },
      _avg: { rating: true },
      _count: { id: true },
    });

    const distribution = await prismaClient.review.groupBy({
      by: ["rating"],
      where: { productId: parsedProductId },
      _count: { id: true },
    });

    const ratingDistribution: Record<number, number> = {};
    distribution.forEach((item) => {
      ratingDistribution[item.rating] = item._count.id;
    });

    return res.status(200).json({
      success: true,
      message: "Product reviews retrieved successfully",
      data: reviews,
      stats: {
        total: total,
        averageRating: ratingStats._avg.rating || 0,
        ratingDistribution,
      },
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get reviews by current user
export const getMyReviews = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req as any).user.id;
    const { sort = "newest", page = 1, limit = 10 } = req.query;

    // Build orderBy
    const orderByMap: any = {
      newest: { createdAt: "desc" },
      oldest: { createdAt: "asc" },
      highest: { rating: "desc" },
      lowest: { rating: "asc" },
    };

    const orderBy = orderByMap[sort as string] || { createdAt: "desc" };

    // Pagination
    const pageNum = Math.max(1, parseInt(page as string) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit as string) || 10));
    const skip = (pageNum - 1) * limitNum;

    // Get user's reviews and count
    const [reviews, total] = await Promise.all([
      prismaClient.review.findMany({
        where: { userId },
        include: {
          product: {
            select: {
              id: true,
              title: true,
              slug: true,
              images: true,
            },
          },
        },
        orderBy,
        skip,
        take: limitNum,
      }),
      prismaClient.review.count({ where: { userId } }),
    ]);

    // Parse product images for all reviews
    const reviewsResponse = reviews.map((review: any) => ({
      ...review,
      product: {
        ...review.product,
        images: JSON.parse(review.product.images),
      },
    }));

    return res.status(200).json({
      success: true,
      message: "Your reviews retrieved successfully",
      data: reviewsResponse,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    next(error);
  }
};

// Update review
export const updateReview = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params as { id: string };
    const { rating, comment } = req.body;
    const userId = (req as any).user.id;

    const reviewId = parseInt(id);
    if (isNaN(reviewId)) {
      return res.status(400).json({
        success: false,
        error: {
          code: "INVALID_ID",
          message: "Invalid review ID",
        },
      });
    }

    // Check if review exists and belongs to user
    const existingReview = await prismaClient.review.findUnique({
      where: { id: reviewId },
    });

    if (!existingReview) {
      return res.status(404).json({
        success: false,
        error: {
          code: "REVIEW_NOT_FOUND",
          message: "Review not found",
        },
      });
    }

    if (existingReview.userId !== userId) {
      return res.status(403).json({
        success: false,
        error: {
          code: "FORBIDDEN",
          message: "You can only update your own reviews",
        },
      });
    }

    // Build update data
    const updateData: any = {};
    if (rating !== undefined) {
      updateData.rating = parseInt(rating);
    }
    if (comment !== undefined) {
      updateData.comment = comment.trim();
    }

    // Update review
    const updatedReview = await prismaClient.review.update({
      where: { id: reviewId },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            profileImage: true,
          },
        },
        product: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
    });

    return res.status(200).json({
      success: true,
      message: "Review updated successfully",
      data: updatedReview,
    });
  } catch (error) {
    next(error);
  }
};

// Delete review
export const deleteReview = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params as { id: string };
    const userId = (req as any).user.id;
    const isAdmin = (req as any).user.role === "admin";

    const reviewId = parseInt(id);
    if (isNaN(reviewId)) {
      return res.status(400).json({
        success: false,
        error: {
          code: "INVALID_ID",
          message: "Invalid review ID",
        },
      });
    }

    // Check if review exists
    const existingReview = await prismaClient.review.findUnique({
      where: { id: reviewId },
    });

    if (!existingReview) {
      return res.status(404).json({
        success: false,
        error: {
          code: "REVIEW_NOT_FOUND",
          message: "Review not found",
        },
      });
    }

    // Check if user owns the review or is admin
    if (existingReview.userId !== userId && !isAdmin) {
      return res.status(403).json({
        success: false,
        error: {
          code: "FORBIDDEN",
          message: "You can only delete your own reviews",
        },
      });
    }

    // Delete review
    await prismaClient.review.delete({
      where: { id: reviewId },
    });

    return res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
