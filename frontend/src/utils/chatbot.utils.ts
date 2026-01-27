// frontend/src/utils/chatbot.utils.ts

// frontend/src/utils/chatbot.utils.ts
import type { Product } from '../types/chatbottypes';

// Format price to Nepali Rupees
export const formatPrice = (price: number): string => {
  return `Rs ${price.toLocaleString('en-NP')}`;
};

// Calculate discount percentage
export const calculateDiscount = (mrp: number, price: number): number => {
  if (!mrp || mrp <= price) return 0;
  return Math.round(((mrp - price) / mrp) * 100);
};

// Extract product details
export const extractProductDetails = (product: Product) => {
  const name = product.metadata?.title || product.title;
  const price = product.metadata?.price || product.price;
  const mrp = product.metadata?.mrp || product.mrp;
  const rating = product.metadata?.avgRating || product.avgRating || 0;
  const stock = product.metadata?.stock || product.stock;
  const category = product.metadata?.categoryName || product.category?.name;
  const id = product.metadata?.productId || product.id;

  return { name, price, mrp, rating, stock, category, id };
};

// Generate session ID
export const generateSessionId = (): string => {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Format timestamp
export const formatTimestamp = (timestamp: number): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
};

// Validate message
export const validateMessage = (message: string): boolean => {
  return message.trim().length > 0 && message.trim().length <= 1000;
};

// Get greeting based on time
export const getTimeBasedGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return 'शुभ प्रभात (Good Morning)';
  if (hour < 17) return 'नमस्कार (Good Afternoon)';
  return 'शुभ साँझ (Good Evening)';
};