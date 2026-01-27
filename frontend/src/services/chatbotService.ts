import api from "./api";
import type { Message, ChatResponse, Product } from "../types/chatbottypes";


export const chatbotService = {
  // Send chat message
  async sendMessage(
    messages: Message[],
    sessionId?: string
  ): Promise<ChatResponse> {
    try {
      const token = localStorage.getItem('token');
      const endpoint = token ? '/chatbot/chat/user' : '/chatbot/chat';

      const response = await api.post(endpoint, {
        messages,
        sessionId,
      });

      return response.data;
    } catch (error) {
      console.error('Chat error:', error);
      throw error;
    }
  },

  // Semantic product search
  async searchProducts(
    query: string,
    maxPrice?: number,
    minPrice?: number
  ): Promise<{ success: boolean; results:   Product[] }> {
    try {
      const response = await api.post('/chatbot/search', {
        query,
        maxPrice,
        minPrice,
      });
      return response.data;
    } catch (error) {
      console.error('Search error:', error);
      throw error;
    }
  },

  // Get personalized recommendations
  async getRecommendations(): Promise<{ success: boolean; recommendations:Product[] }> {
    try {
      const response = await api.get('/chatbot/recommendations');
      return response.data;
    } catch (error) {
      console.error('Recommendations error:', error);
      throw error;
    }
  },

  // Get trending products
  async getTrending(limit: number = 10): Promise<{ success: boolean; trending: Product[] }> {
    try {
      const response = await api.get(`/chatbot/trending?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Trending error:', error);
      throw error;
    }
  },

  // Get budget products
  async getBudgetProducts(
    maxPrice: number,
    limit: number = 10
  ): Promise<{ success: boolean; products:Product[] }> {
    try {
      const response = await api.get(
        `/chatbot/budget-products?maxPrice=${maxPrice}&limit=${limit}`
      );
      return response.data;
    } catch (error) {
      console.error('Budget products error:', error);
      throw error;
    }
  },

  // Get suggested questions
  async getSuggestedQuestions(sessionId?: string): Promise<{ success: boolean; suggestions: string[] }> {
    try {
      const url = sessionId
        ? `/chatbot/suggestions?sessionId=${sessionId}`
        : '/chatbot/suggestions';
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Suggestions error:', error);
      return { success: true, suggestions: [] };
    }
  },

  // Get conversation history
  async getHistory(): Promise<{ success: boolean; conversations: any[] }> {
    try {
      const response = await api.get('/chatbot/history');
      return response.data;
    } catch (error) {
      console.error('History error:', error);
      throw error;
    }
  },

  // Clear session
  async clearSession(sessionId: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await api.post('/chatbot/clear-session', { sessionId });
      return response.data;
    } catch (error) {
      console.error('Clear session error:', error);
      throw error;
    }
  },
};

export default chatbotService;
