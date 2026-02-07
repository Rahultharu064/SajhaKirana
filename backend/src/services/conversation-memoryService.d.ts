interface ConversationContext {
    userId?: string;
    sessionId: string;
    messages: Array<{
        role: string;
        content: string;
        timestamp: number;
    }>;
    userPreferences?: any;
    currentIntent?: string;
    suggestedProducts?: string[];
    isVoiceAuthenticated?: boolean;
}
export declare class ConversationMemoryService {
    private readonly SESSION_TTL;
    private readonly MAX_MESSAGES;
    getContext(sessionId: string, userId?: string): Promise<ConversationContext | null>;
    saveContext(context: ConversationContext): Promise<void>;
    addMessage(sessionId: string, role: string, content: string, userId: number): Promise<void>;
    updatePreferences(sessionId: string, preferences: any): Promise<void>;
    getSuggestedQuestions(sessionId: string): Promise<string[]>;
    private getDefaultSuggestions;
    clearOldSessions(): Promise<void>;
}
export declare const conversationMemoryService: ConversationMemoryService;
export {};
//# sourceMappingURL=conversation-memoryService.d.ts.map