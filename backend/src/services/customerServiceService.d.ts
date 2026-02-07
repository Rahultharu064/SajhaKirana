interface ResponseTemplate {
    patterns: string[];
    response: string;
    intent: string;
    priority: number;
    requiresAuth: boolean;
    escalationPossible: boolean;
}
interface SentimentResult {
    sentiment: 'positive' | 'neutral' | 'negative' | 'angry';
    score: number;
    shouldEscalate: boolean;
    keywords: string[];
}
declare class SentimentAnalyzer {
    private negativePatterns;
    private positivePatterns;
    private escalationTriggers;
    analyze(text: string): SentimentResult;
}
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
declare class CustomerServiceManager {
    private sentimentAnalyzer;
    private llm;
    constructor();
    /**
     * Check if message matches any rule-based template
     */
    findMatchingTemplate(message: string): ResponseTemplate | null;
    /**
     * Process customer message with sentiment and rule-based logic
     */
    processMessage(message: string, sessionId: string, userId?: number): Promise<CustomerServiceResponse>;
    /**
     * Create escalation ticket for human support
     */
    createEscalationTicket(sessionId: string, userId: number | undefined, message: string, sentiment: SentimentResult): Promise<EscalationTicket>;
    /**
     * Generate response for escalation
     */
    private generateEscalationResponse;
    /**
     * Generate satisfaction survey
     */
    generateSatisfactionSurvey(): string;
    /**
     * Process satisfaction rating
     */
    processSatisfactionRating(rating: number, sessionId: string, userId?: number): Promise<string>;
    /**
     * Get active support tickets for admin
     */
    getActiveTickets(limit?: number): Promise<any[]>;
    /**
     * Get customer service statistics
     */
    getStatistics(): Promise<{
        totalConversations: number;
        escalationRate: number;
        avgRating: number;
        pendingTickets: number;
        sentimentBreakdown: {
            positive: number;
            neutral: number;
            negative: number;
            angry: number;
        };
    }>;
}
export declare const customerServiceManager: CustomerServiceManager;
export declare const sentimentAnalyzer: SentimentAnalyzer;
export {};
//# sourceMappingURL=customerServiceService.d.ts.map