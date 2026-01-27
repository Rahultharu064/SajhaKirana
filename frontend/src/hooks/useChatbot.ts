// frontend/src/hooks/useChatbot.ts
import { useChatbotContext } from '../context/ChatbotContext';

/**
 * Hook to interact with the global chatbot state.
 * This ensures that chat history persists across different parts of the UI.
 */
export const useChatbot = () => {
    return useChatbotContext();
};