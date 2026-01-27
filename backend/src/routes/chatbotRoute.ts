import { Router } from 'express';
import { chatbotController } from '../controllers/chatbotController';
import { authenticate } from '../middlewares/authMiddleware';
import { rateLimitChatbot } from '../middlewares/chatbotMiddleware';

const router = Router();

// Public routes
router.post('/chat', rateLimitChatbot, chatbotController.chat);
router.post('/search', rateLimitChatbot, chatbotController.searchProducts);
router.get('/trending', chatbotController.getTrending);
router.get('/budget-products', chatbotController.getBudgetProducts);
router.get('/suggestions', chatbotController.getSuggestedQuestions);

// Authenticated routes
router.post('/chat/user', rateLimitChatbot, authenticate, chatbotController.chat);
router.get('/recommendations', rateLimitChatbot, authenticate, chatbotController.getRecommendations);
router.get('/history', rateLimitChatbot, authenticate, chatbotController.getHistory);
router.post('/clear-session', rateLimitChatbot, chatbotController.clearSession);

// Admin routes
router.post('/index',    rateLimitChatbot, authenticate, chatbotController.indexKnowledge);
router.get('/statistics', rateLimitChatbot, authenticate, chatbotController.getStatistics);

export default router;