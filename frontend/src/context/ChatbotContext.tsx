import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import type { Message, Product } from '../types/chatbottypes';
import chatbotService from '../services/chatbotService';
import { generateSessionId } from '../utils/chatbot.utils';

interface ChatbotContextType {
    messages: Message[];
    isLoading: boolean;
    sessionId: string;
    suggestions: string[];
    recommendations: Product[];
    error: string | null;
    sendMessage: (content: string) => Promise<void>;
    clearChat: () => void;
    loadTrending: () => Promise<void>;
    loadRecommendations: () => Promise<void>;
}

const ChatbotContext = createContext<ChatbotContextType | undefined>(undefined);

export const ChatbotProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [sessionId, setSessionId] = useState<string>('');
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [recommendations, setRecommendations] = useState<Product[]>([]);
    const [error, setError] = useState<string | null>(null);

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

            try {
                // We use the functional update 'prev' to get the most recent messages for the API call
                // but since we want to send the current history + the new message:
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

    return (
        <ChatbotContext.Provider
            value={{
                messages,
                isLoading,
                sessionId,
                suggestions,
                recommendations,
                error,
                sendMessage,
                clearChat,
                loadTrending,
                loadRecommendations,
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
