import { Router } from 'express';
import { chatbotController } from '../controllers/chatbotController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

// Public routes
router.post('/chat', chatbotController.chat);
router.post('/search', chatbotController.searchProducts);

// Authenticated routes
router.post('/chat/user', authMiddleware, chatbotController.chat);
router.get('/history', authMiddleware, chatbotController.getHistory);

// Admin routes
router.post('/index', authMiddleware, chatbotController.indexKnowledge);

export default router;