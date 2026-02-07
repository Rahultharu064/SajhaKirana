import { Router } from "express";
import { createCoupon, getAllCoupons, getCouponById, updateCoupon, deleteCoupon, applyCoupon, getValidCoupons } from "../controllers/couponController";
import { validate } from "../middlewares/validate";
import { authMiddleware } from "../middlewares/authMiddleware";
import { createCouponSchema, updateCouponSchema, applyCouponSchema, } from "../validators/couponValidator";
const couponRoutes = Router();
// Admin routes (require admin role)
const adminAuth = authMiddleware; // You may want to add role checking middleware
// Create new coupon - Admin only
couponRoutes.post("/", adminAuth, validate(createCouponSchema, "body"), createCoupon);
// Get all coupons - Admin only (with pagination, filtering, search)
couponRoutes.get("/", adminAuth, getAllCoupons);
// Get coupon by ID - Admin only
couponRoutes.get("/:id", adminAuth, getCouponById);
// Update coupon - Admin only
couponRoutes.put("/:id", adminAuth, validate(updateCouponSchema, "body"), updateCoupon);
// Delete(deactivate) coupon - Admin only
couponRoutes.delete("/:id", adminAuth, deleteCoupon);
// User routes (authenticated users)
// Apply coupon - User endpoint
couponRoutes.post("/apply", authMiddleware, validate(applyCouponSchema, "body"), applyCoupon);
// Get valid coupons for user (for checkout)
couponRoutes.get("/public/valid", authMiddleware, getValidCoupons);
export default couponRoutes;
//# sourceMappingURL=couponRoute.js.map