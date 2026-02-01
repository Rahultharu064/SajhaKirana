import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Message, Product, Category, CartPreview } from '../types/chatbottypes';
import chatbotService from '../services/chatbotService';
import customerServiceService from '../services/customerServiceService';
import { generateSessionId } from '../utils/chatbot.utils';

// Escalation ticket type
interface EscalationTicket {
    id?: number;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    status: string;
}

interface ChatbotContextType {
    messages: Message[];
    isLoading: boolean;
    sessionId: string;
    suggestions: string[];
    recommendations: Product[];
    categories: Category[];
    cartPreview: CartPreview | null;
    error: string | null;
    // Customer service features
    showSurvey: boolean;
    escalationTicket: EscalationTicket | null;
    isEscalating: boolean;
    lastSentiment: string | null;
    // Methods
    sendMessage: (content: string) => Promise<void>;
    clearChat: () => void;
    loadTrending: () => Promise<void>;
    loadRecommendations: () => Promise<void>;
    requestEscalation: (reason?: string) => Promise<void>;
    submitFeedback: (rating: number, comment?: string) => Promise<void>;
    dismissSurvey: () => void;
}

const ChatbotContext = createContext<ChatbotContextType | undefined>(undefined);

export const ChatbotProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [sessionId, setSessionId] = useState<string>('');
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [recommendations, setRecommendations] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [cartPreview, setCartPreview] = useState<CartPreview | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Customer service state
    const [showSurvey, setShowSurvey] = useState(false);
    const [escalationTicket, setEscalationTicket] = useState<EscalationTicket | null>(null);
    const [isEscalating, setIsEscalating] = useState(false);
    const [lastSentiment, setLastSentiment] = useState<string | null>(null);
    const [messageCount, setMessageCount] = useState(0);

    // Initialize session
    useEffect(() => {
        const storedSessionId = sessionStorage.getItem('chatbot_session_id');
        if (storedSessionId) {
            setSessionId(storedSessionId);
        } else {
            const newSessionId = generateSessionId();
            setSessionId(newSessionId);
            sessionStorage.setItem('chatbot_session_id', newSessionId);
        }
    }, []);

    // Show survey after 5+ messages with no escalation
    useEffect(() => {
        if (messageCount >= 10 && !showSurvey && !escalationTicket) {
            const hasShownSurvey = sessionStorage.getItem(`survey_shown_${sessionId}`);
            if (!hasShownSurvey) {
                setShowSurvey(true);
                sessionStorage.setItem(`survey_shown_${sessionId}`, 'true');
            }
        }
    }, [messageCount, sessionId, showSurvey, escalationTicket]);

    const loadSuggestions = useCallback(async (sid: string) => {
        try {
            const response = await chatbotService.getSuggestedQuestions(sid);
            if (response.success) {
                setSuggestions(response.suggestions);
            }
        } catch (error) {
            console.error('Failed to load suggestions:', error);
        }
    }, []);

    // Load initial suggestions
    useEffect(() => {
        if (sessionId) {
            loadSuggestions(sessionId);
        }
    }, [sessionId, loadSuggestions]);

    const sendMessage = useCallback(
        async (content: string) => {
            if (!content.trim() || isLoading) return;

            const userMessage: Message = {
                role: 'user',
                content: content.trim(),
                timestamp: Date.now(),
            };

            console.log('ChatbotContext: Sending message', userMessage);

            // Update UI immediately
            setMessages((prev) => [...prev, userMessage]);
            setIsLoading(true);
            setError(null);
            setMessageCount(prev => prev + 1);

            try {
                // First, check for rule-based customer service response
                const csResponse = await customerServiceService.processMessage(content, sessionId);

                // If it's a rule-based response, use it directly (faster response)
                if (csResponse.success && csResponse.isRuleBased && csResponse.response) {
                    const assistantMessage: Message = {
                        role: 'assistant',
                        content: csResponse.response,
                        timestamp: Date.now(),
                    };
                    setMessages((prev) => [...prev, assistantMessage]);
                    setLastSentiment(csResponse.sentiment?.sentiment || null);

                    // Handle escalation if needed
                    if (csResponse.shouldEscalate && csResponse.escalationTicket) {
                        setEscalationTicket({
                            id: csResponse.escalationTicket.id,
                            priority: csResponse.escalationTicket.priority as EscalationTicket['priority'],
                            status: csResponse.escalationTicket.status
                        });
                    }

                    setIsLoading(false);
                    return;
                }

                // Otherwise, use the AI chatbot for complex queries
                const currentHistory = [...messages, userMessage];
                const response = await chatbotService.sendMessage(
                    currentHistory,
                    sessionId
                );

                if (response.success) {
                    const assistantMessage: Message = {
                        role: 'assistant',
                        content: response.response,
                        timestamp: Date.now(),
                    };

                    setMessages((prev) => [...prev, assistantMessage]);

                    if (response.suggestions?.length) setSuggestions(response.suggestions);
                    if (response.recommendations?.length) setRecommendations(response.recommendations);
                    if (response.categories?.length) setCategories(response.categories);
                    if (response.cartPreview) setCartPreview(response.cartPreview);

                    if (response.sessionId && response.sessionId !== sessionId) {
                        setSessionId(response.sessionId);
                        sessionStorage.setItem('chatbot_session_id', response.sessionId);
                    }
                } else {
                    throw new Error('Failed to get response');
                }
            } catch (err: any) {
                console.error('Send message error:', err);
                setError('Failed to send message. Please try again.');

                setMessages((prev) => [...prev, {
                    role: 'assistant',
                    content: 'Sorry, I encountered an error. Please try again.',
                    timestamp: Date.now(),
                }]);
            } finally {
                setIsLoading(false);
            }
        },
        [messages, sessionId, isLoading]
    );

    const clearChat = useCallback(() => {
        setMessages([]);
        setRecommendations([]);
        setCategories([]);
        setCartPreview(null);
        setEscalationTicket(null);
        setShowSurvey(false);
        setMessageCount(0);
        const newSessionId = generateSessionId();
        setSessionId(newSessionId);
        sessionStorage.setItem('chatbot_session_id', newSessionId);
        loadSuggestions(newSessionId);
    }, [loadSuggestions]);

    const loadTrending = useCallback(async () => {
        try {
            const response = await chatbotService.getTrending(5);
            if (response.success) setRecommendations(response.trending);
        } catch (error) {
            console.error('Failed to load trending:', error);
        }
    }, []);

    const loadRecommendations = useCallback(async () => {
        try {
            const response = await chatbotService.getRecommendations();
            if (response.success) setRecommendations(response.recommendations);
        } catch (error) {
            console.error('Failed to load recommendations:', error);
        }
    }, []);

    // Request escalation to human agent
    const requestEscalation = useCallback(async (reason?: string) => {
        if (isEscalating) return;

        setIsEscalating(true);
        try {
            const result = await customerServiceService.escalateToHuman(sessionId, reason);
            if (result.success && result.ticket) {
                setEscalationTicket({
                    id: result.ticket.id,
                    priority: result.ticket.priority as EscalationTicket['priority'],
                    status: result.ticket.status
                });

                // Add system message about escalation
                setMessages(prev => [...prev, {
                    role: 'assistant',
                    content: `🎫 Support ticket #${result.ticket.id} created. A human agent will be with you shortly.`,
                    timestamp: Date.now()
                }]);
            }
        } catch (error) {
            console.error('Failed to escalate:', error);
            setError('Failed to connect to human support. Please try again.');
        } finally {
            setIsEscalating(false);
        }
    }, [sessionId, isEscalating]);

    // Submit satisfaction feedback
    const submitFeedback = useCallback(async (rating: number, comment?: string) => {
        try {
            await customerServiceService.submitFeedback(sessionId, rating, comment);
            setShowSurvey(false);
        } catch (error) {
            console.error('Failed to submit feedback:', error);
        }
    }, [sessionId]);

    // Dismiss survey
    const dismissSurvey = useCallback(() => {
        setShowSurvey(false);
    }, []);

    return (
        <ChatbotContext.Provider
            value={{
                messages,
                isLoading,
                sessionId,
                suggestions,
                recommendations,
                categories,
                cartPreview,
                error,
                showSurvey,
                escalationTicket,
                isEscalating,
                lastSentiment,
                sendMessage,
                clearChat,
                loadTrending,
                loadRecommendations,
                requestEscalation,
                submitFeedback,
                dismissSurvey,
            }}
        >
            {children}
        </ChatbotContext.Provider>
    );
};

export const useChatbotContext = () => {
    const context = useContext(ChatbotContext);
    if (context === undefined) {
        throw new Error('useChatbotContext must be used within a ChatbotProvider');
    }
    return context;
};

