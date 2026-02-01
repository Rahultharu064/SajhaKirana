// frontend/src/services/customerServiceService.ts
// Customer Service API Integration

import api from './api';

export interface OrderStatus {
    id: number;
    status: string;
    statusMessage: string;
    paymentStatus: string;
    paymentMethod: string;
    total: number;
    itemCount: number;
    items: Array<{
        id: number;
        productId: number;
        name: string;
        quantity: number;
        price: number;
        image: string | null;
    }>;
    shippingAddress: any;
    estimatedDelivery: string | null;
    createdAt: string;
    lastPayment: any;
    canCancel: boolean;
    hasOTP: boolean;
}

export interface ProductInfo {
    id: number;
    sku: string;
    title: string;
    description: string;
    price: number;
    mrp: number;
    discount: number;
    stock: number;
    stockStatus: string;
    stockColor: string;
    isAvailable: boolean;
    category: string;
    categoryId: number;
    images: string[];
    primaryImage: string | null;
    rating: number;
    reviewCount: number;
    slug: string;
}

export interface SentimentResult {
    sentiment: 'positive' | 'neutral' | 'negative' | 'angry';
    score: number;
    shouldEscalate: boolean;
    keywords: string[];
}

export interface CustomerServiceResponse {
    success: boolean;
    response: string;
    isRuleBased: boolean;
    intent: string;
    sentiment: SentimentResult;
    shouldEscalate: boolean;
    escalationTicket?: {
        id: number;
        sessionId: string;
        reason: string;
        priority: string;
        status: string;
    };
}

export interface SupportTicket {
    id: number;
    sessionId: string;
    userId?: number;
    reason: string;
    sentiment: string;
    conversationSummary: string;
    status: string;
    priority: string;
    assignedTo?: number;
    resolution?: string;
    resolvedAt?: string;
    createdAt: string;
    user?: {
        id: number;
        name: string;
        email: string;
        phone?: string;
    };
    agent?: {
        id: number;
        name: string;
    };
}

const customerServiceService = {
    /**
     * Get order status for chatbot quick lookup
     */
    async getOrderStatus(orderId: number): Promise<OrderStatus> {
        const response = await api.get(`/chatbot/order-status/${orderId}`);
        return response.data.order;
    },

    /**
     * Get product info for chatbot quick lookup
     */
    async getProductInfo(productId: number): Promise<ProductInfo> {
        const response = await api.get(`/chatbot/product-info/${productId}`);
        return response.data.product;
    },

    /**
     * Process message through customer service AI
     */
    async processMessage(message: string, sessionId: string): Promise<CustomerServiceResponse> {
        const token = localStorage.getItem('token');
        const response = await api.post(
            `/customer-service/process${token ? '/user' : ''}`,
            { message, sessionId }
        );
        return response.data;
    },

    /**
     * Escalate to human agent
     */
    async escalateToHuman(sessionId: string, reason?: string): Promise<any> {
        const response = await api.post(
            `/customer-service/escalate`,
            { sessionId, reason }
        );
        return response.data;
    },

    /**
     * Submit satisfaction feedback
     */
    async submitFeedback(sessionId: string, rating: number, comment?: string): Promise<string> {
        const response = await api.post(`/customer-service/feedback`, {
            sessionId,
            rating,
            comment
        });
        return response.data.message;
    },

    /**
     * Get satisfaction survey
     */
    async getSurvey(): Promise<string> {
        const response = await api.get(`/customer-service/survey`);
        return response.data.survey;
    },

    // =============================================
    // ADMIN ENDPOINTS
    // =============================================

    /**
     * Get all support tickets (Admin only)
     */
    async getTickets(filters?: { status?: string; priority?: string; limit?: number }): Promise<SupportTicket[]> {
        const params = new URLSearchParams();
        if (filters?.status) params.append('status', filters.status);
        if (filters?.priority) params.append('priority', filters.priority);
        if (filters?.limit) params.append('limit', filters.limit.toString());

        const response = await api.get(`/customer-service/tickets?${params}`);
        return response.data.tickets;
    },

    /**
     * Update support ticket (Admin only)
     */
    async updateTicket(
        ticketId: number,
        data: { status?: string; assignedTo?: number; resolution?: string }
    ): Promise<SupportTicket> {
        const response = await api.put(
            `/customer-service/tickets/${ticketId}`,
            data
        );
        return response.data.ticket;
    },

    /**
     * Get customer service statistics (Admin only)
     */
    async getStatistics(): Promise<{
        totalConversations: number;
        escalationRate: number;
        avgRating: number;
        pendingTickets: number;
        ticketsToday: number;
        resolvedToday: number;
        resolutionRate: number;
        sentimentBreakdown: {
            positive: number;
            neutral: number;
            negative: number;
            angry: number;
        };
    }> {
        const response = await api.get(`/customer-service/statistics`);
        return response.data.statistics;
    }
};

export default customerServiceService;
