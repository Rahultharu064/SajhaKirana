import type { Request, Response, NextFunction } from "express";
export declare const processEsewaInitiation: (orderId: number, baseUrl: string) => Promise<{
    payment: {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        orderId: number;
        status: string;
        gateway: string;
        txnId: string | null;
        amount: number;
    };
    esewaConfig: {
        amt: number;
        psc: number;
        pdc: number;
        txAmt: number;
        tAmt: number;
        pid: string;
        scd: string;
        su: string;
        fu: string;
    };
    esewaURL: string;
}>;
export declare const initiateEsewaPayment: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const processKhaltiInitiation: (orderId: number, baseUrl: string, user: {
    name: string;
    email: string;
    phone: string;
}) => Promise<{
    payment: {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        orderId: number;
        status: string;
        gateway: string;
        txnId: string | null;
        amount: number;
    };
    khaltiData: any;
    paymentUrl: any;
}>;
export declare const initiateKhaltiPayment: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const verifyEsewaPayment: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const verifyKhaltiPayment: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getPaymentStatus: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updatePaymentStatus: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=paymentController.d.ts.map