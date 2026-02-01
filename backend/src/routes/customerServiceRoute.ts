// backend/src/routes/customerServiceRoute.ts
// Customer Service AI Routes

import { Router } from 'express';
import { customerServiceController } from '../controllers/customerServiceController';
import { authenticate } from '../middlewares/authMiddleware';
import { rateLimitChatbot } from '../middlewares/chatbotMiddleware';

const router = Router();

// =============================================
// PUBLIC ROUTES
// =============================================

// Get product information (public)
router.get('/product-info/:productId',
    rateLimitChatbot,
    customerServiceController.getProductInfo
);

// Get satisfaction survey template
router.get('/survey',
    customerServiceController.getSurvey
);

// =============================================
// AUTHENTICATED ROUTES
// =============================================

// Get order status (requires auth)
router.get('/order-status/:orderId',
    rateLimitChatbot,
    authenticate,
    customerServiceController.getOrderStatus
);

// Process customer service message
router.post('/process',
    rateLimitChatbot,
    customerServiceController.processMessage
);

// Authenticated message processing (for personalized responses)
router.post('/process/user',
    rateLimitChatbot,
    authenticate,
    customerServiceController.processMessage
);

// Escalate to human agent
router.post('/escalate',
    rateLimitChatbot,
    authenticate,
    customerServiceController.escalateToHuman
);

// Submit feedback/rating
router.post('/feedback',
    rateLimitChatbot,
    customerServiceController.submitFeedback
);

// =============================================
// ADMIN ROUTES
// =============================================

// Get all support tickets
router.get('/tickets',
    authenticate,
    customerServiceController.getTickets
);

// Update support ticket
router.put('/tickets/:id',
    authenticate,
    customerServiceController.updateTicket
);

// Get customer service statistics
router.get('/statistics',
    authenticate,
    customerServiceController.getStatistics
);

export default router;
