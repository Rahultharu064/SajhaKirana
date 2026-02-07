export interface FraudCheckRequest {
    userId: number;
    orderDetails: {
        total: number;
        items: any[];
        shippingAddress: any;
        paymentMethod: string;
    };
    deviceFingerprint: string;
    ipAddress: string;
}
export interface FraudCheckResponse {
    riskScore: number;
    riskLevel: 'low' | 'medium' | 'high';
    blockedReasons: string[];
    requiresVerification: boolean;
}
export declare class FraudService {
    private llm;
    constructor();
    validateFraud(req: FraudCheckRequest): Promise<FraudCheckResponse>;
}
export declare const fraudService: FraudService;
//# sourceMappingURL=fraudService.d.ts.map