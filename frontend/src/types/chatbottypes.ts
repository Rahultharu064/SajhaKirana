export interface Message {
   role: "user" | "assistant" | "system";
   content: string;
   timestamp: number;
}

export interface ChatbotState {
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

export interface Product {
   id: string | number;
   title: string;
   price: number;
   mrp?: number;
   stock: number;
   slug: string;
   images?: string; // JSON string
   category?: {
      id: string | number;
      name: string;
   };
   avgRating?: number;
   metadata?: {
      productId: string | number;
      name: string;
      title: string;
      price: number;
      mrp?: number;
      categoryName?: string;
      stock: number;
      avgRating?: number;
      isAvailable: boolean;
      image?: string | null;
      isActive?: boolean;
   };
}

export interface Category {
   id: string | number;
   name: string;
   slug: string;
   image?: string | null;
}

export interface CartPreview {
   items: Array<{
      id: number;
      sku: string;
      quantity: number;
      price: number;
      name: string;
      image: string | null;
   }>;
   total: number;
   itemCount: number;
}

export interface ChatResponse {
   success: boolean;
   response: string;
   suggestions?: string[];
   recommendations?: Product[];
   categories?: Category[];
   cartPreview?: CartPreview | null;
   sessionId?: string;
}

export interface ConversationContext {
   sessionId: string;
   messages: Message[];
   userPreferences?: any;
}

export interface QuickAction {
   icon: any;
   label: string;
   query: string;
   color?: string;
}   