import { redis } from '../config/redis';
import { prismaClient } from '../config/client';



interface ConversationContext {
  userId?: string;
  sessionId: string;
  messages: Array<{ role: string; content: string; timestamp: number }>;
  userPreferences?: any;
  currentIntent?: string;
  suggestedProducts?: string[];
  isVoiceAuthenticated?: boolean;
}

export class ConversationMemoryService {
  private readonly SESSION_TTL = 3600; // 1 hour
  private readonly MAX_MESSAGES = 20;

  // Get conversation context
  async getContext(sessionId: string, userId?: string): Promise<ConversationContext | null> {
    try {
      const key = `chat:session:${sessionId}`;
      const data = await redis.get(key);

      if (data) {
        return JSON.parse(data);
      }

      // If no session, create new one
      const newContext: ConversationContext = {
        userId,
        sessionId,
        messages: [],
      };

      await this.saveContext(newContext);
      return newContext;
    } catch (error) {
      console.error('Error getting context:', error);
      return null;
    }
  }

  // Save conversation context
  async saveContext(context: ConversationContext): Promise<void> {
    try {
      const key = `chat:session:${context.sessionId}`;

      // Keep only last MAX_MESSAGES
      if (context.messages.length > this.MAX_MESSAGES) {
        context.messages = context.messages.slice(-this.MAX_MESSAGES);
      }

      await redis.setex(key, this.SESSION_TTL, JSON.stringify(context));
    } catch (error) {
      console.error('Error saving context:', error);
    }
  }

  // Add message to context
  async addMessage(
    sessionId: string,
    role: string,
    content: string,
    userId: number
  ): Promise<void> {
    try {
      const context = await this.getContext(sessionId, userId.toString());
      if (!context) return;

      context.messages.push({
        role,
        content,
        timestamp: Date.now(),
      });

      await this.saveContext(context);

      // Also store in database for long-term
      if (userId) {
        await prismaClient.conversation.create({
          data: {
            userId,
            message: role === 'user' ? content : '',
            response: role === 'assistant' ? content : '',
            metadata: {
              sessionId,
              timestamp: new Date().toISOString(),
            },
          },
        });
      }
    } catch (error) {
      console.error('Error adding message:', error);
    }
  }

  // Update user preferences in context
  async updatePreferences(sessionId: string, preferences: any): Promise<void> {
    try {
      const context = await this.getContext(sessionId);
      if (!context) return;

      context.userPreferences = preferences;
      await this.saveContext(context);
    } catch (error) {
      console.error('Error updating preferences:', error);
    }
  }

  // Get suggested questions based on context
  async getSuggestedQuestions(sessionId: string): Promise<string[]> {
    try {
      const context = await this.getContext(sessionId);
      if (!context) return this.getDefaultSuggestions();

      const lastIntent = context.currentIntent;
      const hasMessages = context.messages.length > 0;

      // Context-aware suggestions
      if (!hasMessages) {
        return this.getDefaultSuggestions();
      }

      switch (lastIntent) {
        case 'product_search':
          return [
            'Show me similar products',
            'What are the reviews for this?',
            'Add to cart',
            'Show products under Rs 500',
          ];
        case 'order_query':
          return [
            'Track my latest order',
            'Cancel my order',
            'When will it arrive?',
            'View all my orders',
          ];
        case 'cart_query':
          return [
            'Proceed to checkout',
            'Remove items from cart',
            'Apply coupon code',
            'Show recommended products',
          ];
        default:
          return this.getDefaultSuggestions();
      }
    } catch (error) {
      console.error('Error getting suggestions:', error);
      return this.getDefaultSuggestions();
    }
  }

  private getDefaultSuggestions(): string[] {
    return [
      'What products do you have?',
      'Show me trending items',
      'Products under Rs 500',
      'Track my order',
      'What are today\'s deals?',
      'Show me recommended products',
      'Show me similar products',
      'Show me trending products',

    ];
  }

  // Clear old sessions
  async clearOldSessions(): Promise<void> {
    try {
      const keys = await redis.keys('chat:session:*');

      for (const key of keys) {
        const ttl = await redis.ttl(key);
        if (ttl < 0) {
          await redis.del(key);
        }
      }
    } catch (error) {
      console.error('Error clearing old sessions:', error);
    }
  }
}

export const conversationMemoryService = new ConversationMemoryService();