import type { Request, Response } from 'express';
import { langGraphChatbot } from '../services/langgraphService';
import { knowledgeService } from '../services/knowledgeService';
import { embeddingService } from '../services/embeddingService';
import { prismaClient } from '../config/client';
const prisma = prismaClient;


interface AuthRequest extends Request {
    user?: {
        id: number;
        email: string;
        role: string;
    };
}

export const chatbotController = {
    // Main chat endpoint
    async chat(req: Request, res: Response) {
        try {
            const { messages } = req.body;
            const userId = (req as AuthRequest).user?.id;

            if (!messages || !Array.isArray(messages)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid messages format',
                });
            }

            // Use LangGraph chatbot - convert userId to string for the service
            const response = await langGraphChatbot.chat(messages, userId?.toString());

            // Store conversation
            if (userId) {
                const lastMessage = messages[messages.length - 1];
                // @ts-ignore - Prisma client generation issue
                await (prisma as any).conversation.create({
                    data: {
                        userId, // userId is number, matching Prisma schema
                        message: lastMessage.content,
                        response,
                    },
                });
            }

            res.json({
                success: true,
                response,
            });
        } catch (error) {
            console.error('Chat error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to process chat message',
            });
        }
    },

    // Semantic product search
    async searchProducts(req: Request, res: Response) {
        try {
            const { query } = req.body;

            if (!query) {
                return res.status(400).json({
                    success: false,
                    message: 'Query is required',
                });
            }

            const results = await embeddingService.searchSimilar(query, 10, {
                must: [{ key: 'type', match: { value: 'product' } }],
            });

            res.json({
                success: true,
                results: results.map((r) => ({
                    id: r.metadata.productId,
                    name: r.metadata.name,
                    price: r.metadata.price,
                    category: r.metadata.categoryName,
                    score: r.score,
                })),
            });
        } catch (error) {
            console.error('Search error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to search products',
            });
        }
    },

    // Index knowledge base
    async indexKnowledge(req: Request, res: Response) {
        try {
            // Check if user is admin
            if ((req as AuthRequest).user?.role !== 'ADMIN') {
                return res.status(403).json({
                    success: false,
                    message: 'Unauthorized',
                });
            }

            await knowledgeService.indexAll();

            res.json({
                success: true,
                message: 'Knowledge base indexed successfully',
            });
        } catch (error) {
            console.error('Index error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to index knowledge base',
            });
        }
    },

    // Get conversation history
    async getHistory(req: Request, res: Response) {
        try {
            const userId = (req as AuthRequest).user?.id;

            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: 'Unauthorized',
                });
            }

            // @ts-ignore - Prisma client generation issue
            const conversations = await (prisma as any).conversation.findMany({
                where: { userId },
                orderBy: { createdAt: 'desc' },
                take: 50,
            });

            res.json({
                success: true,
                conversations,
            });
        } catch (error) {
            console.error('History error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to get conversation history',
            });
        }
    },
};