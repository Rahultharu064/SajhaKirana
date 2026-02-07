export declare class LangGraphChatbot {
    private graph;
    private llm;
    constructor();
    private initializeGraph;
    private extractQuery;
    private classifyIntent;
    private extractShoppingDetails;
    private verifyVoiceSecurity;
    private handleOrderActions;
    private extractPreferences;
    private retrieveContext;
    private enrichUserContext;
    private getRecommendations;
    private generateResponse;
    private generateSuggestions;
    chat(messages: Array<{
        role: string;
        content: string;
    }>, userId?: string, sessionId?: string): Promise<{
        response: string;
        suggestions: string[];
        recommendations: any[];
        categories: any[];
        cartPreview: any;
    }>;
}
export declare const langGraphChatbot: LangGraphChatbot;
//# sourceMappingURL=langgraphService.d.ts.map