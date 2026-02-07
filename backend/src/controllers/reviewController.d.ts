import type { Request, Response } from 'express';
export declare const createReview: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getReviewsByProduct: (req: Request, res: Response) => Promise<void>;
export declare const getMyReviews: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateReview: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteReview: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getPendingReviews: (req: Request, res: Response) => Promise<void>;
export declare const approveReview: (req: Request, res: Response) => Promise<void>;
export declare const rejectReview: (req: Request, res: Response) => Promise<void>;
export declare const bulkApproveReviews: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const bulkRejectReviews: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=reviewController.d.ts.map