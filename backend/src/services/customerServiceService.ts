// backend/src/services/customerServiceService.ts
// Customer Service AI with Rule-Based Responses, Sentiment Analysis, and Escalation

import { prismaClient } from '../config/client';
import { ChatGroq } from '@langchain/groq';

const prisma = prismaClient;

// =============================================
// RULE-BASED RESPONSE TEMPLATES
// =============================================

interface ResponseTemplate {
    patterns: string[];
    response: string;
    intent: string;
    priority: number;
    requiresAuth: boolean;
    escalationPossible: boolean;
}

const RESPONSE_TEMPLATES: ResponseTemplate[] = [
    // Order Tracking
    {
        patterns: ['where is my order', 'track my order', 'order status', 'delivery status', 'when will my order arrive'],
        response: `I can help you track your order! 📦\n\nTo locate your order:\n1. Go to "My Orders" in your account\n2. Find your order and click "Track Order"\n\nOr simply tell me your order number (e.g., "Track order #12345") and I'll give you real-time updates!`,
        intent: 'order_tracking',
        priority: 1,
        requiresAuth: true,
        escalationPossible: true
    },
    // Returns & Refunds
    {
        patterns: ['how do i return', 'return a product', 'return policy', 'want to return', 'initiate return', 'refund'],
        response: `🔄 **Return & Refund Policy**\n\n**Easy Returns:**\n• Returns accepted within 7 days of delivery\n• Product must be unused and in original packaging\n• Perishable items are non-returnable\n\n**How to Return:**\n1. Go to "My Orders" → Select the order\n2. Click "Request Return"\n3. Choose reason and schedule pickup\n\n**Refund Timeline:**\n• Bank transfers: 5-7 business days\n• Wallet credit: Instant\n\nNeed help with a specific return? Share your order number!`,
        intent: 'returns',
        priority: 1,
        requiresAuth: true,
        escalationPossible: true
    },
    // Payment Issues
    {
        patterns: ['payment failed', 'payment issue', 'payment declined', 'money deducted', 'double charged', 'transaction failed'],
        response: `💳 **Payment Issue Support**\n\nI understand payment issues can be frustrating. Let me help!\n\n**Common Solutions:**\n• **Failed Payment:** Wait 30 mins, then retry. If amount was deducted, it auto-refunds in 3-5 days.\n• **Double Charged:** Screenshot the transactions and I'll connect you with our support team.\n• **Declined:** Try a different card/payment method.\n\n**Auto-Refund Policy:**\nFailed transactions are automatically refunded within 5-7 business days.\n\n⚠️ For urgent payment disputes, say "Talk to human" and I'll escalate immediately.`,
        intent: 'payment_issue',
        priority: 2,
        requiresAuth: true,
        escalationPossible: true
    },
    // Product Availability
    {
        patterns: ['in stock', 'do you have', 'available', 'out of stock', 'when will it be available'],
        response: `📦 I can check product availability for you!\n\nJust tell me:\n• The product name, or\n• Share the product link\n\nI'll give you real-time stock information and notify you when out-of-stock items return!`,
        intent: 'stock_check',
        priority: 1,
        requiresAuth: false,
        escalationPossible: false
    },
    // Delivery Charges
    {
        patterns: ['delivery charge', 'delivery fee', 'shipping cost', 'free delivery', 'delivery charges'],
        response: `🚚 **Delivery Information**\n\n**Delivery Charges:**\n• Orders above Rs 500: **FREE Delivery** 🎉\n• Orders below Rs 500: Rs 50 delivery fee\n\n**Delivery Areas:**\nWe deliver across Kathmandu Valley (Kathmandu, Lalitpur, Bhaktapur)\n\n**Delivery Time:**\n• Standard: 1-2 business days\n• Express (select areas): Same day if ordered before 12 PM\n\nNeed express delivery? Add it at checkout!`,
        intent: 'delivery_info',
        priority: 1,
        requiresAuth: false,
        escalationPossible: false
    },
    // Account Issues
    {
        patterns: ['forgot password', 'reset password', 'cannot login', 'account locked', 'change email', 'update phone'],
        response: `🔐 **Account Support**\n\n**Password Reset:**\n1. Click "Forgot Password" on login page\n2. Enter your registered email/phone\n3. Follow the OTP verification\n\n**Account Locked?**\nAfter 5 failed attempts, accounts lock for 30 minutes. Wait and try again.\n\n**Update Details:**\nGo to Profile → Edit Profile to update your info.\n\nStill having trouble? Say "Talk to human" for immediate assistance.`,
        intent: 'account_help',
        priority: 1,
        requiresAuth: false,
        escalationPossible: true
    },
    // Coupons & Discounts
    {
        patterns: ['coupon', 'discount code', 'promo code', 'offer', 'coupon not working'],
        response: `🎟️ **Coupons & Offers**\n\n**Current Offers:**\n• **WELCOME10** - 10% off on first order\n• **FREE99** - Free delivery on orders above Rs 999\n\n**Coupon Not Working?**\n• Check minimum order value\n• Verify coupon validity date\n• Some coupons exclude sale items\n\nApply coupons at checkout in the "Apply Coupon" field!\n\nWant me to find the best discount for your cart?`,
        intent: 'coupon_help',
        priority: 1,
        requiresAuth: false,
        escalationPossible: false
    },
    // Escalation Triggers
    {
        patterns: ['talk to human', 'speak to agent', 'human support', 'real person', 'customer service', 'connect me to support', 'manager'],
        response: `ESCALATION_TRIGGER`,
        intent: 'escalation',
        priority: 0,
        requiresAuth: false,
        escalationPossible: true
    },
    // Complaints
    {
        patterns: ['complaint', 'dissatisfied', 'bad experience', 'poor service', 'disappointed', 'worst', 'terrible', 'awful'],
        response: `I'm truly sorry to hear about your experience. 😔\n\nYour feedback is important to us, and I want to make this right.\n\n**To file a formal complaint:**\n1. I can connect you with our support team right now\n2. Or email: support@sajhakirana.com\n\nWould you like me to connect you with a human agent immediately? Just say "Yes, connect me."`,
        intent: 'complaint',
        priority: 0,
        requiresAuth: false,
        escalationPossible: true
    },
    // Business Hours
    {
        patterns: ['business hours', 'working hours', 'open hours', 'when are you open', 'customer support hours'],
        response: `⏰ **Sajha Kirana Hours**\n\n**Online Shopping:** 24/7 - Shop anytime!\n\n**Customer Support:**\n• Chat Support: 24/7 (I'm always here!)\n• Phone Support: 9 AM - 9 PM (Everyday)\n• Email: 24 hours (Response within 6 hours)\n\n**Delivery Hours:**\n• 8 AM - 8 PM (Everyday)\n\nHow can I assist you today?`,
        intent: 'business_hours',
        priority: 1,
        requiresAuth: false,
        escalationPossible: false
    }
];

// =============================================
// SENTIMENT ANALYSIS
// =============================================

interface SentimentResult {
    sentiment: 'positive' | 'neutral' | 'negative' | 'angry';
    score: number;
    shouldEscalate: boolean;
    keywords: string[];
}

class SentimentAnalyzer {
    private negativePatterns = [
        { pattern: /terrible|awful|worst|horrible|disgusting/gi, weight: -3 },
        { pattern: /angry|furious|livid|mad|pissed/gi, weight: -3 },
        { pattern: /scam|fraud|cheat|steal|rob/gi, weight: -4 },
        { pattern: /never again|never buying|boycott/gi, weight: -3 },
        { pattern: /disappointed|frustrat(ed|ing)|annoyed/gi, weight: -2 },
        { pattern: /bad|poor|slow|late|wrong/gi, weight: -1 },
        { pattern: /don't like|not happy|not satisfied|unhappy/gi, weight: -2 },
        { pattern: /waste|useless|garbage|trash/gi, weight: -2 },
        { pattern: /waiting forever|taking too long|where is/gi, weight: -1 },
        { pattern: /refund|return|cancel|complaint/gi, weight: -1 },
    ];

    private positivePatterns = [
        { pattern: /thank|thanks|appreciate/gi, weight: 2 },
        { pattern: /great|excellent|amazing|wonderful|awesome/gi, weight: 2 },
        { pattern: /love|happy|satisfied|pleased/gi, weight: 2 },
        { pattern: /fast|quick|efficient|helpful/gi, weight: 1 },
        { pattern: /good|nice|well|fine/gi, weight: 1 },
        { pattern: /recommend|best|perfect/gi, weight: 2 },
    ];

    private escalationTriggers = [
        /speak to (a |)human/gi,
        /talk to (a |)person/gi,
        /real (person|agent|human)/gi,
        /manager/gi,
        /supervisor/gi,
        /escalate/gi,
        /legal action/gi,
        /lawyer/gi,
        /sue you/gi,
        /report you/gi,
    ];

    analyze(text: string): SentimentResult {
        let score = 0;
        const matchedKeywords: string[] = [];

        // Check negative patterns
        for (const { pattern, weight } of this.negativePatterns) {
            const matches = text.match(pattern);
            if (matches) {
                score += weight * matches.length;
                matchedKeywords.push(...matches);
            }
        }

        // Check positive patterns
        for (const { pattern, weight } of this.positivePatterns) {
            const matches = text.match(pattern);
            if (matches) {
                score += weight * matches.length;
                matchedKeywords.push(...matches);
            }
        }

        // Check escalation triggers
        let shouldEscalate = false;
        for (const trigger of this.escalationTriggers) {
            if (trigger.test(text)) {
                shouldEscalate = true;
                break;
            }
        }

        // Very negative score also triggers escalation
        if (score <= -5) {
            shouldEscalate = true;
        }

        let sentiment: SentimentResult['sentiment'];
        if (score >= 3) sentiment = 'positive';
        else if (score >= 0) sentiment = 'neutral';
        else if (score >= -4) sentiment = 'negative';
        else sentiment = 'angry';

        return {
            sentiment,
            score,
            shouldEscalate,
            keywords: [...new Set(matchedKeywords)]
        };
    }
}

// =============================================
// CUSTOMER SERVICE MANAGER
// =============================================

export interface EscalationTicket {
    id?: number;
    sessionId: string;
    userId?: number;
    reason: string;
    sentiment: string;
    conversationSummary: string;
    status: 'pending' | 'assigned' | 'resolved';
    priority: 'low' | 'medium' | 'high' | 'urgent';
    assignedTo?: number;
    createdAt: Date;
}

export interface CustomerServiceResponse {
    response: string;
    isRuleBased: boolean;
    intent: string;
    sentiment: SentimentResult;
    shouldEscalate: boolean;
    escalationTicket?: EscalationTicket;
    satisfactionSurvey?: boolean;
}

class CustomerServiceManager {
    private sentimentAnalyzer: SentimentAnalyzer;
    private llm: ChatGroq;

    constructor() {
        this.sentimentAnalyzer = new SentimentAnalyzer();
        this.llm = new ChatGroq({
            apiKey: process.env.GROQ_API_KEY,
            model: 'llama-3.3-70b-versatile',
            temperature: 0.5,
        });
    }

    /**
     * Check if message matches any rule-based template
     */
    findMatchingTemplate(message: string): ResponseTemplate | null {
        const lowerMessage = message.toLowerCase();

        // Sort by priority (lower = higher priority)
        const sortedTemplates = [...RESPONSE_TEMPLATES].sort((a, b) => a.priority - b.priority);

        for (const template of sortedTemplates) {
            for (const pattern of template.patterns) {
                if (lowerMessage.includes(pattern.toLowerCase())) {
                    return template;
                }
            }
        }

        return null;
    }

    /**
     * Process customer message with sentiment and rule-based logic
     */
    async processMessage(
        message: string,
        sessionId: string,
        userId?: number
    ): Promise<CustomerServiceResponse> {
        // Analyze sentiment
        const sentiment = this.sentimentAnalyzer.analyze(message);

        // Check for rule-based response
        const template = this.findMatchingTemplate(message);

        let response: CustomerServiceResponse = {
            response: '',
            isRuleBased: false,
            intent: 'general',
            sentiment,
            shouldEscalate: sentiment.shouldEscalate,
        };

        // Handle escalation
        if (template?.response === 'ESCALATION_TRIGGER' || sentiment.shouldEscalate) {
            const ticket = await this.createEscalationTicket(sessionId, userId, message, sentiment);

            response.shouldEscalate = true;
            response.escalationTicket = ticket;
            response.response = this.generateEscalationResponse(ticket);
            response.intent = 'escalation';
            return response;
        }

        // Use rule-based response if available
        if (template) {
            response.isRuleBased = true;
            response.response = template.response;
            response.intent = template.intent;
            return response;
        }

        // No rule match - will be handled by AI
        response.intent = 'ai_required';
        return response;
    }

    /**
     * Create escalation ticket for human support
     */
    async createEscalationTicket(
        sessionId: string,
        userId: number | undefined,
        message: string,
        sentiment: SentimentResult
    ): Promise<EscalationTicket> {
        // Determine priority based on sentiment
        let priority: EscalationTicket['priority'] = 'medium';
        if (sentiment.sentiment === 'angry') priority = 'urgent';
        else if (sentiment.sentiment === 'negative') priority = 'high';
        else if (sentiment.score < 0) priority = 'medium';
        else priority = 'low';

        // Generate conversation summary using AI
        let summary = '';
        try {
            const summaryPrompt = `Summarize this customer service interaction in 2-3 sentences for a human agent:
            
Customer Message: "${message}"
Detected Sentiment: ${sentiment.sentiment} (score: ${sentiment.score})
Keywords: ${sentiment.keywords.join(', ')}

Be brief and highlight the main issue.`;

            const result = await this.llm.invoke([
                { role: 'user', content: summaryPrompt }
            ]);
            summary = result.content as string;
        } catch (error) {
            summary = `Customer message: "${message.substring(0, 200)}..." - Sentiment: ${sentiment.sentiment}`;
        }

        const ticket: EscalationTicket = {
            sessionId,
            userId,
            reason: sentiment.keywords.length > 0 ? sentiment.keywords.slice(0, 3).join(', ') : 'Customer requested human support',
            sentiment: sentiment.sentiment,
            conversationSummary: summary,
            status: 'pending',
            priority,
            createdAt: new Date()
        };

        // Store ticket in database (we'll add the model later)
        try {
            const dbTicket = await prisma.supportTicket.create({
                data: {
                    sessionId: ticket.sessionId,
                    userId: ticket.userId,
                    reason: ticket.reason,
                    sentiment: ticket.sentiment,
                    conversationSummary: ticket.conversationSummary,
                    status: ticket.status,
                    priority: ticket.priority,
                }
            });
            ticket.id = dbTicket.id;
        } catch (error) {
            console.log('Support ticket table may not exist yet, storing in memory');
        }

        return ticket;
    }

    /**
     * Generate response for escalation
     */
    private generateEscalationResponse(ticket: EscalationTicket): string {
        const priorityEmoji = {
            urgent: '🚨',
            high: '⚡',
            medium: '📞',
            low: '💬'
        };

        return `${priorityEmoji[ticket.priority]} **Connecting You to Human Support**

I understand you'd like to speak with a human agent. I've created a support ticket for you:

**Ticket Reference:** #${ticket.id || 'PENDING'}
**Priority:** ${ticket.priority.toUpperCase()}
**Status:** ${ticket.status}

📱 **What Happens Next:**
• A support agent will join this conversation shortly
• Expected wait time: ${ticket.priority === 'urgent' ? '< 2 minutes' : ticket.priority === 'high' ? '< 5 minutes' : '< 10 minutes'}
• You'll receive a notification when they connect

💡 **While you wait:**
Feel free to share any additional details about your issue!

Thank you for your patience. 🙏`;
    }

    /**
     * Generate satisfaction survey
     */
    generateSatisfactionSurvey(): string {
        return `
📊 **Quick Feedback**

How was your experience today?

1️⃣ ⭐ Poor
2️⃣ ⭐⭐ Fair  
3️⃣ ⭐⭐⭐ Good
4️⃣ ⭐⭐⭐⭐ Great
5️⃣ ⭐⭐⭐⭐⭐ Excellent

Just reply with a number (1-5) to rate us!

Your feedback helps us improve. 🙏`;
    }

    /**
     * Process satisfaction rating
     */
    async processSatisfactionRating(
        rating: number,
        sessionId: string,
        userId?: number
    ): Promise<string> {
        try {
            await prisma.chatbotFeedback.create({
                data: {
                    sessionId,
                    userId,
                    rating,
                    createdAt: new Date()
                }
            });

            if (rating >= 4) {
                return '🎉 Thank you for the wonderful rating! We\'re glad we could help. Have a great day! 🌟';
            } else if (rating >= 3) {
                return '🙏 Thank you for your feedback! We\'ll work on improving your experience.';
            } else {
                return '😔 We\'re sorry we didn\'t meet your expectations. Your feedback has been noted, and we\'ll work harder to improve. Would you like to speak with a manager?';
            }
        } catch (error) {
            console.error('Error saving feedback:', error);
            return '🙏 Thank you for your feedback!';
        }
    }

    /**
     * Get active support tickets for admin
     */
    async getActiveTickets(limit: number = 20): Promise<any[]> {
        try {
            return await prisma.supportTicket.findMany({
                where: {
                    status: { in: ['pending', 'assigned'] }
                },
                orderBy: [
                    { priority: 'asc' },
                    { createdAt: 'asc' }
                ],
                take: limit,
                include: {
                    user: {
                        select: { id: true, name: true, email: true, phone: true }
                    }
                }
            });
        } catch (error) {
            console.error('Error fetching tickets:', error);
            return [];
        }
    }

    /**
     * Get customer service statistics
     */
    async getStatistics(): Promise<{
        totalConversations: number;
        escalationRate: number;
        avgRating: number;
        pendingTickets: number;
        sentimentBreakdown: { positive: number; neutral: number; negative: number; angry: number };
    }> {
        try {
            const [totalConversations, escalatedCount, avgRatingResult, pendingTickets, sentimentData] = await Promise.all([
                prisma.conversation.count(),
                prisma.supportTicket.count(),
                prisma.chatbotFeedback.aggregate({ _avg: { rating: true } }),
                prisma.supportTicket.count({ where: { status: 'pending' } }),
                prisma.supportTicket.groupBy({
                    by: ['sentiment'],
                    _count: true
                })
            ]);

            const sentimentBreakdown = {
                positive: 0,
                neutral: 0,
                negative: 0,
                angry: 0
            };

            sentimentData.forEach((item: any) => {
                if (item.sentiment in sentimentBreakdown) {
                    sentimentBreakdown[item.sentiment as keyof typeof sentimentBreakdown] = item._count;
                }
            });

            return {
                totalConversations,
                escalationRate: totalConversations > 0 ? (escalatedCount / totalConversations) * 100 : 0,
                avgRating: avgRatingResult._avg.rating || 0,
                pendingTickets,
                sentimentBreakdown
            };
        } catch (error) {
            console.error('Error getting statistics:', error);
            return {
                totalConversations: 0,
                escalationRate: 0,
                avgRating: 0,
                pendingTickets: 0,
                sentimentBreakdown: { positive: 0, neutral: 0, negative: 0, angry: 0 }
            };
        }
    }
}

// Export singleton instance
export const customerServiceManager = new CustomerServiceManager();
export const sentimentAnalyzer = new SentimentAnalyzer();
