import type { Request, Response } from 'express';
interface AuthRequest extends Request {
    user?: {
        id: number;
        email?: string;
        role: string;
    };
}
export declare const chatbotController: {
    chat(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getRecommendations(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getTrending(req: Request, res: Response): Promise<void>;
    getBudgetProducts(req: Request, res: Response): Promise<void>;
    searchProducts(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getSuggestedQuestions(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getHistory(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    clearSession(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    indexKnowledge(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getStatistics(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
};
export {};
//# sourceMappingURL=chatbotController.d.ts.map