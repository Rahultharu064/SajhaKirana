import type{ Request, Response } from 'express';
import { langGraphChatbot } from '../services/langgraphService';
import { knowledgeService } from '../services/knowledgeService';
import { embeddingService } from '../services/embeddingService';
import { recommendationService } from '../services/recommendationService';
import { conversationMemoryService } from '../services/conversation-memoryService';
import { prismaClient } from '../config/client';



interface AuthRequest extends Request {
  user?: {
    id: number;
    email?: string;
    role: string;
  };
}

export const chatbotController = {
  // Main chat endpoint with recommendations
  async chat(req: AuthRequest, res: Response) {
    try {
      const { messages, sessionId } = req.body;
      const userId = req.user?.id;

      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid messages format',
        });
      }

      // Use LangGraph chatbot with recommendations
      const result = await langGraphChatbot.chat(messages, userId?.toString(), sessionId);

      res.json({
        success: true,
        response: result.response,
        suggestions: result.suggestions,
        recommendations: result.recommendations,
        sessionId: sessionId || `session_${Date.now()}`,
      });
    } catch (error) {
      console.error('Chat error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to process chat message',
      });
    }
  },

  // Get personalized recommendations
  async getRecommendations(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required',
        });
      }

      const recommendations = await recommendationService.recommendProducts(
        userId,
        10
      );

      res.json({
        success: true,
        recommendations,
      });
    } catch (error) {
      console.error('Recommendations error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get recommendations',
      });
    }
  },

  // Get trending products
  async getTrending(req: Request, res: Response) {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const trending = await recommendationService.getTrendingProducts(limit);

      res.json({
        success: true,
        trending,
      });
    } catch (error) {
      console.error('Trending error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get trending products',
      });
    }
  },

  // Get budget products
  async getBudgetProducts(req: Request, res: Response) {
    try {
      const maxPrice = parseInt(req.query.maxPrice as string) || 500;
      const limit = parseInt(req.query.limit as string) || 10;

      const products = await recommendationService.getBudgetProducts(
        maxPrice,
        limit
      );

      res.json({
        success: true,
        products,
      });
    } catch (error) {
      console.error('Budget products error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get budget products',
      });
    }
  },

  // Semantic product search
  async searchProducts(req: Request, res: Response) {
    try {
      const { query, maxPrice, minPrice } = req.body;

      if (!query) {
        return res.status(400).json({
          success: false,
          message: 'Query is required',
        });
      }

      const filter: any = {
        must: [
          { key: 'type', match: { value: 'product' } },
          { key: 'isAvailable', match: { value: true } },
        ],
      };

      if (maxPrice) {
        filter.must.push({
          key: 'price',
          range: { lte: parseFloat(maxPrice) },
        });
      }

      if (minPrice) {
        filter.must.push({
          key: 'price',
          range: { gte: parseFloat(minPrice) },
        });
      }

      const results = await embeddingService.searchSimilar(query, 10, filter);

      res.json({
        success: true,
        results: results.map((r : any) => ({
          id: r.metadata.productId,
          name: r.metadata.title,
          price: r.metadata.price,
          mrp: r.metadata.mrp,
          category: r.metadata.categoryName,
          stock: r.metadata.stock,
          rating: r.metadata.avgRating,
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

  // Get suggested questions
  async getSuggestedQuestions(req: Request, res: Response) {
    try {
      const { sessionId } = req.query;

      if (!sessionId) {
        return res.json({
          success: true,
          suggestions: [
            'What products do you have?',
            'Show trending items',
            'Products under Rs 500',
            'Recommend products for me',
            'What are today\'s deals?',
          ],
        });
      }

      const suggestions = await conversationMemoryService.getSuggestedQuestions(
        sessionId as string
      );

      res.json({
        success: true,
        suggestions,
      });
    } catch (error) {
      console.error('Suggestions error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get suggestions',
      });
    }
  },

  // Get conversation history
  async getHistory(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
      }

      const conversations = await prismaClient.conversation.findMany({
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

  // Clear conversation memory
  async clearSession(req: Request, res: Response) {
    try {
      const { sessionId } = req.body;

      if (!sessionId) {
        return res.status(400).json({
          success: false,
          message: 'Session ID required',
        });
      }

      await conversationMemoryService.clearOldSessions();

      res.json({
        success: true,
        message: 'Session cleared',
      });
    } catch (error) {
      console.error('Clear session error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to clear session',
      });
    }
  },

  // Index knowledge base (Admin only)
  async indexKnowledge(req: AuthRequest, res: Response) {
    try {
      if (req.user?.role !== 'ADMIN') {
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

  // Get chatbot statistics (Admin only)
  async getStatistics(req: AuthRequest, res: Response) {
    try {
      if (req.user?.role !== 'ADMIN') {
        return res.status(403).json({
          success: false,
          message: 'Unauthorized',
        });
      }

      const totalConversations = await prismaClient.conversation.count();
      const totalUsers = await prismaClient.conversation.groupBy({
        by: ['userId'],
        _count: true,
      });

      const last7Days = new Date();
      last7Days.setDate(last7Days.getDate() - 7);

      const recentConversations = await prismaClient.conversation.count({
        where: {
          createdAt: { gte: last7Days },
        },
      });

      res.json({
        success: true,
        statistics: {
          totalConversations,
          uniqueUsers: totalUsers.length,
          conversationsLast7Days: recentConversations,
        },
      });
    } catch (error) {
      console.error('Statistics error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get statistics',
      });
    }
  },
};
