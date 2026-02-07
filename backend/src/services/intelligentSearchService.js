import { embeddingService } from './embeddingService';
import { prismaClient } from '../config/client';
import { ChatGroq } from '@langchain/groq';
const prisma = prismaClient;
export class IntelligentSearchService {
    llm;
    constructor() {
        this.llm = new ChatGroq({
            apiKey: process.env.GROQ_API_KEY,
            model: 'llama-3.3-70b-versatile',
        });
    }
    /**
     * Intelligent Search with Semantic Retrieval and Custom Ranking
     */
    async search(query, options = {}) {
        const { userId, sessionId, limit = 10 } = options;
        // 1. Semantic Retrieval using Vector DB
        const semanticResults = await embeddingService.searchSimilar(query, limit * 2, {
            must: [{ key: 'isActive', match: { value: true } }]
        });
        if (semanticResults.length === 0) {
            return [];
        }
        // 2. Process and Rank Results
        const results = [];
        // Fetch extra data for ranking (like purchase history or current promotion status)
        const productIds = semanticResults.map(r => r.metadata?.productId).filter(Boolean);
        const productsFromDb = await prisma.product.findMany({
            where: { id: { in: productIds } },
            include: {
                _count: {
                    select: { orderItems: true } // Popularity proxy
                }
            }
        });
        const productMap = new Map(productsFromDb.map(p => [p.id, p]));
        for (const res of semanticResults) {
            const productId = res.metadata?.productId;
            const dbProduct = productMap.get(productId);
            if (!dbProduct)
                continue;
            const relevanceScore = res.score; // 0.0 to 1.0 from Qdrant
            // Learning to Rank (LTR) Logic
            let rankingScore = relevanceScore * 0.5; // 50% weight to semantic relevance
            // Availability Factor (20%)
            if (dbProduct.stock > 0)
                rankingScore += 0.2;
            // Popularity Factor (15%)
            const salesCount = dbProduct._count.orderItems;
            const popularityBoost = Math.min(salesCount / 100, 1) * 0.15;
            rankingScore += popularityBoost;
            // Rating Factor (10%)
            const ratingBoost = (res.metadata?.avgRating || 0) / 5 * 0.1;
            rankingScore += ratingBoost;
            // Recency Factor (5%)
            const daysSinceCreated = (Date.now() - new Date(dbProduct.createdAt).getTime()) / (1000 * 60 * 60 * 24);
            if (daysSinceCreated < 7)
                rankingScore += 0.05;
            results.push({
                productId: dbProduct.id,
                title: dbProduct.title,
                price: dbProduct.price,
                mrp: dbProduct.mrp,
                image: res.metadata?.image,
                avgRating: res.metadata?.avgRating,
                stock: dbProduct.stock,
                score: rankingScore,
                relevanceScore,
                metadata: res.metadata
            });
        }
        // Sort by final score
        const rankedResults = results.sort((a, b) => b.score - a.score).slice(0, limit);
        // 3. Log Analytics (Disabled until migration is run)
        // TODO: Run `npx prisma migrate dev --name add_search_analytics` when server is stopped
        /*
        try {
            await (prisma as any).searchAnalytics.create({
                data: {
                    userId,
                    query,
                    resultsCount: rankedResults.length,
                    sessionId,
                    timestamp: new Date()
                }
            });
        } catch (e) {
            console.error('Failed to log search analytics:', e);
        }
        */
        return rankedResults;
    }
    /**
     * Smart Autocomplete with Typo Correction and Intent Detection
     */
    async getSuggestions(query) {
        if (!query || query.length < 2)
            return [];
        try {
            const prompt = `
                System: You are a smart search assistant for Sajha Kirana, a Nepali grocery store.
                Tasks:
                1. Correct typos in the user query: "${query}"
                2. Provide 3-5 relevant search suggestions.
                3. If the query is in Nepali, provide both Nepali and Romanized/English equivalents.
                4. Detect intent (e.g., "looking for fruits", "healthy breakfast").
                
                Respond in JSON format: { "correctedQuery": string, "suggestions": string[], "intent": string }
            `;
            const aiResponse = await this.llm.invoke(prompt);
            const content = aiResponse.content;
            const jsonMatch = content.match(/\{.*\}/s);
            if (jsonMatch) {
                const result = JSON.parse(jsonMatch[0]);
                // Log/Cache this if needed
                return result;
            }
        }
        catch (error) {
            console.error('Autocomplete error:', error);
        }
        // Fallback to simple semantic search for suggestions
        const semanticSuggestions = await embeddingService.searchSimilar(query, 5);
        return {
            correctedQuery: query,
            suggestions: semanticSuggestions.map(s => s.metadata?.name).filter(Boolean),
            intent: 'general_search'
        };
    }
}
export const intelligentSearchService = new IntelligentSearchService();
//# sourceMappingURL=intelligentSearchService.js.map