import type { Request, Response, NextFunction } from "express";
export declare const addItemToCart: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const removeItemFromCart: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getCart: (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=cartController.d.ts.map