import type { Request, Response } from 'express';
interface AuthRequest extends Request {
    user?: {
        id: number;
        email?: string;
        role: string;
    };
}
export declare const customerServiceController: {
    /**
     * GET /api/chatbot/order-status/:orderId
     * Quick order status lookup for chatbot
     */
    getOrderStatus(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * GET /api/chatbot/product-info/:productId
     * Quick product info lookup for chatbot
     */
    getProductInfo(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * POST /api/customer-service/process
     * Process message through customer service AI
     */
    processMessage(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * POST /api/customer-service/escalate
     * Manually escalate to human agent
     */
    escalateToHuman(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * POST /api/customer-service/feedback
     * Submit satisfaction rating
     */
    submitFeedback(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * GET /api/customer-service/tickets
     * Get active support tickets (Admin only)
     */
    getTickets(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * PUT /api/customer-service/tickets/:id
     * Update support ticket (Admin only)
     */
    updateTicket(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * GET /api/customer-service/statistics
     * Get customer service statistics (Admin only)
     */
    getStatistics(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * GET /api/customer-service/survey
     * Get satisfaction survey prompt
     */
    getSurvey(req: Request, res: Response): Promise<void>;
};
export {};
//# sourceMappingURL=customerServiceController.d.ts.map