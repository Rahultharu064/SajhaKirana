 export  interface Message{
    role: "user" | "assistant" | "system";
    content: string;
    timestamp: number;
 }

 export interface ChatbotState{
    messages: Message[];
    query: string;
    intent: string;
    context: string;
    retrievedDocs: any[];
    recommendations: any[];
    userPreferences: any;
    priceFilter: { min?: number; max?: number } | null;
    response: string;
    userId: string | undefined;
    sessionId: string;
    suggestedQuestions: string[];
 }

 export interface Product{
    id: string;
    title: string;
    price: number;
    mrp?: number;
    stock: number;
    slug: string;
    category?: {
    id: string;
    name: string;
    };
    avgRating?: number;
    metadata?: {
    productId: string;
    name: string;
    title: string;
    price: number;
    mrp?: number;
    categoryName?: string;
    stock: number;
    avgRating?: number;
    isAvailable: boolean;
    };
 }

 export interface ChatResponse {
  success: boolean;
  response: string;
  suggestions?: string[];
  recommendations?:Product[];
  sessionId?: string;
}

export interface ConversationContext {
  sessionId: string;
  messages:Message[];
  userPreferences?: any;
}

export interface QuickAction {
  icon: any;
  label: string;
  query: string;
  color?: string;
}   