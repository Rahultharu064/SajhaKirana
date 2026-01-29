import type { Request, Response, NextFunction } from "express";
import { intelligentSearchService } from "../services/intelligentSearchService";

export const searchProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { q, userId, sessionId, limit } = req.query;

        if (!q) {
            return res.status(400).json({ success: false, message: "Search query is required" });
        }

        const results = await intelligentSearchService.search(q as string, {
            userId: userId ? parseInt(userId as string) : undefined,
            sessionId: sessionId as string,
            limit: limit ? parseInt(limit as string) : 10
        });

        res.status(200).json({
            success: true,
            data: results,
            total: results.length
        });
    } catch (error) {
        next(error);
    }
};

export const getSearchSuggestions = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { q } = req.query;

        if (!q) {
            return res.status(200).json({ success: true, data: { correctedQuery: "", suggestions: [], intent: "" } });
        }

        const result = await intelligentSearchService.getSuggestions(q as string);

        res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        next(error);
    }
};
