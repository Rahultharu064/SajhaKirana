import type { Request, Response, NextFunction } from "express";
import { prismaClient } from "../config/client";
import { Prisma } from "@prisma/client";

// Interface for coupon with calculated discount
interface CouponWithDiscount {
  id: number;
  code: string;
  description: string;
  discountType: string;
  discountValue: number;
  minOrderValue: number;
  maxDiscount: number | null;
  usageLimit: number;
  usageCount: number;
  expiryDate: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  calculatedDiscount: number;
}

// Create coupon - Admin only
export const createCoupon = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const {
            code,
            description,
            discountType,
            discountValue,
            minOrderValue = 0,
            maxDiscount,
            usageLimit = 0,
            expiryDate,
            isActive = true
        } = req.body;

        // Check if coupon code already exists
        const existingCoupon = await prismaClient.coupon.findUnique({
            where: { code: code.toUpperCase() }
        });

        if (existingCoupon) {
            res.status(409).json({
                success: false,
                error: { code: "COUPON_EXISTS", message: "Coupon code already exists" }
            });
            return;
        }

        // Validate percentage discount constraints
        if (discountType === 'percentage') {
            if (discountValue > 100) {
                res.status(400).json({
                    success: false,
                    error: { code: "INVALID_DISCOUNT", message: "Percentage discount cannot exceed 100%" }
                });
                return;
            }
            if (!maxDiscount || maxDiscount <= 0) {
                res.status(400).json({
                    success: false,
                    error: { code: "MAX_DISCOUNT_REQUIRED", message: "Max discount is required for percentage type" }
                });
                return;
            }
        } else if (discountType === 'fixed') {
            if (maxDiscount !== undefined) {
                res.status(400).json({
                    success: false,
                    error: { code: "MAX_DISCOUNT_FORBIDDEN", message: "Max discount should not be set for fixed type" }
                });
                return;
            }
        }

        const newCoupon = await prismaClient.coupon.create({
            data: {
                code: code.toUpperCase(),
                description,
                discountType,
                discountValue,
                minOrderValue,
                maxDiscount,
                usageLimit,
                expiryDate: new Date(expiryDate),
                isActive
            }
        });

        res.status(201).json({
            success: true,
            data: newCoupon,
            message: "Coupon created successfully"
        });
        return;
    } catch (error) {
        console.error("Error in createCoupon:", error);
        res.status(500).json({
            success: false,
            error: { code: "SERVER_ERROR", message: "Internal server error" }
        });
        return;
    }
};

// Get all coupons - Admin only
export const getAllCoupons = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const {
            page = 1,
            limit = 10,
            search,
            isActive,
            sortBy = 'createdAt',
            sortOrder = 'desc'
        } = req.query;

        const pageNum = parseInt(page as string);
        const limitNum = parseInt(limit as string);
        const offset = (pageNum - 1) * limitNum;

        const where: any = {};
        if (search) {
            where.OR = [
                { code: { contains: search as string, mode: 'insensitive' } },
                { description: { contains: search as string, mode: 'insensitive' } }
            ];
        }
        if (isActive !== undefined) {
            where.isActive = isActive === 'true';
        }

        const [coupons, total] = await Promise.all([
            prismaClient.coupon.findMany({
                where,
                skip: offset,
                take: limitNum,
                orderBy: { [sortBy as string]: sortOrder }
            }),
            prismaClient.coupon.count({ where })
        ]);

        res.status(200).json({
            success: true,
            data: coupons,
            pagination: {
                page: pageNum,
                limit: limitNum,
                total,
                totalPages: Math.ceil(total / limitNum)
            }
        });
        return;
    } catch (error) {
        console.error("Error in getAllCoupons:", error);
        res.status(500).json({
            success: false,
            error: { code: "SERVER_ERROR", message: "Internal server error" }
        });
        return;
    }
};

// Get coupon by ID - Admin only
export const getCouponById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;

        if (!id) {
            res.status(400).json({
                success: false,
                error: { code: "INVALID_ID", message: "Coupon ID is required" }
            });
            return;
        }

        const couponId = parseInt(id);

        if (isNaN(couponId)) {
            res.status(400).json({
                success: false,
                error: { code: "INVALID_ID", message: "Invalid coupon ID" }
            });
            return;
        }

        const coupon = await prismaClient.coupon.findUnique({
            where: { id: couponId }
        });

        if (!coupon) {
            res.status(404).json({
                success: false,
                error: { code: "COUPON_NOT_FOUND", message: "Coupon not found" }
            });
            return;
        }

        res.status(200).json({
            success: true,
            data: coupon
        });
        return;
    } catch (error) {
        console.error("Error in getCouponById:", error);
        res.status(500).json({
            success: false,
            error: { code: "SERVER_ERROR", message: "Internal server error" }
        });
        return;
    }
};

// Update coupon - Admin only
export const updateCoupon = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;

        if (!id) {
            res.status(400).json({
                success: false,
                error: { code: "INVALID_ID", message: "Coupon ID is required" }
            });
            return;
        }

        const couponId = parseInt(id);

        if (isNaN(couponId)) {
            res.status(400).json({
                success: false,
                error: { code: "INVALID_ID", message: "Invalid coupon ID" }
            });
            return;
        }

        const updateData = req.body;

        // Check if coupon exists
        const existingCoupon = await prismaClient.coupon.findUnique({
            where: { id: couponId }
        });

        if (!existingCoupon) {
            res.status(404).json({
                success: false,
                error: { code: "COUPON_NOT_FOUND", message: "Coupon not found" }
            });
            return;
        }

        // If updating code, check uniqueness
        if (updateData.code && updateData.code.toUpperCase() !== existingCoupon.code) {
            const codeExists = await prismaClient.coupon.findUnique({
                where: { code: updateData.code.toUpperCase() }
            });
            if (codeExists) {
                res.status(409).json({
                    success: false,
                    error: { code: "COUPON_EXISTS", message: "Coupon code already exists" }
                });
                return;
            }
        }

        // Validate discount type changes
        const discountType = updateData.discountType || existingCoupon.discountType;
        const discountValue = updateData.discountValue !== undefined ? updateData.discountValue : existingCoupon.discountValue;

        if (discountType === 'percentage') {
            if (discountValue > 100) {
                res.status(400).json({
                    success: false,
                    error: { code: "INVALID_DISCOUNT", message: "Percentage discount cannot exceed 100%" }
                });
                return;
            }
            if (!updateData.maxDiscount && !existingCoupon.maxDiscount) {
                res.status(400).json({
                    success: false,
                    error: { code: "MAX_DISCOUNT_REQUIRED", message: "Max discount is required for percentage type" }
                });
                return;
            }
        } else if (discountType === 'fixed' && updateData.maxDiscount !== undefined) {
            res.status(400).json({
                success: false,
                error: { code: "MAX_DISCOUNT_FORBIDDEN", message: "Max discount should not be set for fixed type" }
            });
            return;
        }

        // Prepare update data
        const finalUpdateData: any = { ...updateData };
        if (updateData.code) {
            finalUpdateData.code = updateData.code.toUpperCase();
        }
        if (updateData.expiryDate) {
            finalUpdateData.expiryDate = new Date(updateData.expiryDate);
        }

        const updatedCoupon = await prismaClient.coupon.update({
            where: { id: couponId },
            data: finalUpdateData
        });

        res.status(200).json({
            success: true,
            data: updatedCoupon,
            message: "Coupon updated successfully"
        });
        return;
    } catch (error) {
        console.error("Error in updateCoupon:", error);
        res.status(500).json({
            success: false,
            error: { code: "SERVER_ERROR", message: "Internal server error" }
        });
        return;
    }
};

// Delete coupon - Admin only
export const deleteCoupon = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;

        if (!id) {
            res.status(400).json({
                success: false,
                error: { code: "INVALID_ID", message: "Coupon ID is required" }
            });
            return;
        }

        const couponId = parseInt(id);

        if (isNaN(couponId)) {
            res.status(400).json({
                success: false,
                error: { code: "INVALID_ID", message: "Invalid coupon ID" }
            });
            return;
        }

        // Check if coupon exists
        const existingCoupon = await prismaClient.coupon.findUnique({
            where: { id: couponId }
        });

        if (!existingCoupon) {
            res.status(404).json({
                success: false,
                error: { code: "COUPON_NOT_FOUND", message: "Coupon not found" }
            });
            return;
        }

        // Soft delete by deactivating (can be changed to actual delete if needed)
        await prismaClient.coupon.update({
            where: { id: couponId },
            data: { isActive: false }
        });

        res.status(200).json({
            success: true,
            message: "Coupon deactivated successfully"
        });
        return;
    } catch (error) {
        console.error("Error in deleteCoupon:", error);
        res.status(500).json({
            success: false,
            error: { code: "SERVER_ERROR", message: "Internal server error" }
        });
        return;
    }
};

// Apply coupon - User endpoint
export const applyCoupon = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { code, orderValue } = req.body;
        const userId = (req as any).user?.id;

        // Find active coupon
        const coupon = await prismaClient.coupon.findFirst({
            where: {
                code: code.toUpperCase(),
                isActive: true,
                expiryDate: { gt: new Date() },
            }
        });

        if (!coupon) {
            res.status(404).json({
                success: false,
                error: { code: "COUPON_NOT_FOUND", message: "Valid coupon not found" }
            });
            return;
        }

        // Check minimum order value
        if (orderValue < coupon.minOrderValue) {
            res.status(400).json({
                success: false,
                error: {
                    code: "MINIMUM_ORDER_NOT_MET",
                    message: `Minimum order value of ${coupon.minOrderValue} required`
                }
            });
            return;
        }

        // Check usage limit
        if (coupon.usageLimit > 0 && coupon.usageCount >= coupon.usageLimit) {
            res.status(400).json({
                success: false,
                error: { code: "USAGE_LIMIT_EXCEEDED", message: "Coupon usage limit exceeded" }
            });
            return;
        }

        // Calculate discount
        let discountAmount = 0;
        if (coupon.discountType === 'percentage') {
            discountAmount = (orderValue * coupon.discountValue) / 100;
            if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
                discountAmount = coupon.maxDiscount;
            }
        } else {
            discountAmount = Math.min(coupon.discountValue, orderValue);
        }

        // Ensure discount doesn't exceed order value
        discountAmount = Math.min(discountAmount, orderValue);

        // Calculate final amount
        const discountedAmount = orderValue - discountAmount;

        const couponWithDiscount: CouponWithDiscount = {
            ...coupon,
            calculatedDiscount: discountAmount
        };

        res.status(200).json({
            success: true,
            data: {
                coupon: couponWithDiscount,
                originalValue: orderValue,
                discountAmount,
                discountedAmount
            },
            message: `Coupon applied successfully. You saved ${discountAmount.toFixed(2)}`
        });
        return;
    } catch (error) {
        console.error("Error in applyCoupon:", error);
        res.status(500).json({
            success: false,
            error: { code: "SERVER_ERROR", message: "Internal server error" }
        });
        return;
    }
};

// Get valid coupons for user
export const getValidCoupons = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { orderValue } = req.query;
        const minOrderValue = orderValue ? parseFloat(orderValue as string) : 0;

        const coupons = await (prismaClient as any).coupon.findMany({
            where: {
                isActive: true,
                expiryDate: { gt: new Date() },
                minOrderValue: { lte: minOrderValue },
                OR: [
                    { usageLimit: 0 },
                    {
                        AND: [
                            { usageLimit: { not: 0 } },
                            { usageCount: { lt: prismaClient.coupon.fields.usageLimit } }
                        ]
                    }
                ]
            },
            select: {
                id: true,
                code: true,
                description: true,
                discountType: true,
                discountValue: true,
                minOrderValue: true,
                maxDiscount: true,
                expiryDate: true
            }
        });

        res.status(200).json({
            success: true,
            data: coupons
        });
        return;
    } catch (error) {
        console.error("Error in getValidCoupons:", error);
        res.status(500).json({
            success: false,
            error: { code: "SERVER_ERROR", message: "Internal server error" }
        });
        return;
    }
};
