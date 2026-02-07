import { intelligentSearchService } from "../services/intelligentSearchService";
export const searchProducts = async (req, res, next) => {
    try {
        const { q, userId, sessionId, limit } = req.query;
        if (!q) {
            return res.status(400).json({ success: false, message: "Search query is required" });
        }
        const results = await intelligentSearchService.search(q, {
            userId: userId ? parseInt(userId) : undefined,
            sessionId: sessionId,
            limit: limit ? parseInt(limit) : 10
        });
        res.status(200).json({
            success: true,
            data: results,
            total: results.length
        });
    }
    catch (error) {
        next(error);
    }
};
export const getSearchSuggestions = async (req, res, next) => {
    try {
        const { q } = req.query;
        if (!q) {
            return res.status(200).json({ success: true, data: { correctedQuery: "", suggestions: [], intent: "" } });
        }
        const result = await intelligentSearchService.getSuggestions(q);
        res.status(200).json({
            success: true,
            data: result
        });
    }
    catch (error) {
        next(error);
    }
};
//# sourceMappingURL=searchController.js.map