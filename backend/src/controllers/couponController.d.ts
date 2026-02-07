import type { Request, Response, NextFunction } from "express";
export declare const createCoupon: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getAllCoupons: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getCouponById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const updateCoupon: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const deleteCoupon: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const applyCoupon: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getValidCoupons: (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=couponController.d.ts.map