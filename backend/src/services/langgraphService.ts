// backend/src/services/langgraph.service.ts
import { StateGraph, END, START, Annotation } from '@langchain/langgraph';
import { ChatGroq } from '@langchain/groq';
import { embeddingService } from './embeddingService';
import { recommendationService } from './recommendationService';
import { conversationMemoryService } from './conversation-memoryService';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface ChatState {
    messages: Array<{ role: string; content: string }>;
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

// Define the state schema using Annotation for the latest LangGraph version
const ChatStateAnnotation = Annotation.Root({
    messages: Annotation<Array<{ role: string; content: string }>>({
        reducer: (x, y) => (y ? [...x, ...y] : x),
        default: () => [],
    }),
    query: Annotation<string>({
        reducer: (x, y) => y ?? x,
        default: () => '',
    }),
    intent: Annotation<string>({
        reducer: (x, y) => y ?? x,
        default: () => '',
    }),
    context: Annotation<string>({
        reducer: (x, y) => y ?? x,
        default: () => '',
    }),
    retrievedDocs: Annotation<any[]>({
        reducer: (x, y) => y ?? x,
        default: () => [],
    }),
    recommendations: Annotation<any[]>({
        reducer: (x, y) => y ?? x,
        default: () => [],
    }),
    userPreferences: Annotation<any>({
        reducer: (x, y) => y ?? x,
        default: () => null,
    }),
    priceFilter: Annotation<{ min?: number; max?: number } | null>({
        reducer: (x, y) => y ?? x,
        default: () => null,
    }),
    response: Annotation<string>({
        reducer: (x, y) => y ?? x,
        default: () => '',
    }),
    userId: Annotation<string | undefined>({
        reducer: (x, y) => y ?? x,
        default: () => undefined,
    }),
    sessionId: Annotation<string>({
        reducer: (x, y) => y ?? x,
        default: () => '',
    }),
    suggestedQuestions: Annotation<string[]>({
        reducer: (x, y) => y ?? x,
        default: () => [],
    }),
});

export class LangGraphChatbot {
    private graph: any;
    private llm: ChatGroq;

    constructor() {
        this.llm = new ChatGroq({
            apiKey: process.env.GROQ_API_KEY,
            model: 'llama-3.3-70b-versatile',
            temperature: 0.7,
        });

        this.initializeGraph();
    }

    private initializeGraph() {
        const workflow = new StateGraph(ChatStateAnnotation);

        // Add nodes
        workflow.addNode('extract_query', this.extractQuery.bind(this));
        workflow.addNode('classify_intent', this.classifyIntent.bind(this));
        workflow.addNode('process_actions', this.handleOrderActions.bind(this));
        workflow.addNode('extract_preferences', this.extractPreferences.bind(this));
        workflow.addNode('retrieve_context', this.retrieveContext.bind(this));
        workflow.addNode('enrich_user_context', this.enrichUserContext.bind(this));
        workflow.addNode('get_recommendations', this.getRecommendations.bind(this));
        workflow.addNode('generate_response', this.generateResponse.bind(this));
        workflow.addNode('generate_suggestions', this.generateSuggestions.bind(this));

        // Define workflow
        workflow.addEdge(START, 'extract_query' as any);
        workflow.addEdge('extract_query' as any, 'classify_intent' as any);
        workflow.addEdge('classify_intent' as any, 'process_actions' as any);
        workflow.addEdge('process_actions' as any, 'extract_preferences' as any);
        workflow.addEdge('extract_preferences' as any, 'retrieve_context' as any);
        workflow.addEdge('retrieve_context' as any, 'enrich_user_context' as any);
        workflow.addEdge('enrich_user_context' as any, 'get_recommendations' as any);
        workflow.addEdge('get_recommendations' as any, 'generate_response' as any);
        workflow.addEdge('generate_response' as any, 'generate_suggestions' as any);
        workflow.addEdge('generate_suggestions' as any, END as any);

        this.graph = workflow.compile();
    }

    // Step 1: Extract query
    private async extractQuery(state: ChatState): Promise<Partial<ChatState>> {
        const lastMessage = state.messages[state.messages.length - 1];
        if (!lastMessage) return { query: '' };
        return { query: lastMessage.content };
    }

    // Step 2: Classify intent
    private async classifyIntent(state: ChatState): Promise<Partial<ChatState>> {
        const query = state.query.toLowerCase();

        let intent = 'general';

        if (
            query.includes('product') ||
            query.includes('item') ||
            query.includes('buy') ||
            query.includes('shop') ||
            query.includes('show me') ||
            query.includes('looking for')
        ) {
            intent = 'product_search';
        } else if (
            query.includes('recommend') ||
            query.includes('suggest') ||
            query.includes('what should i') ||
            query.includes('best')
        ) {
            intent = 'recommendation';
        } else if (
            query.includes('cheap') ||
            query.includes('budget') ||
            query.includes('under rs') ||
            query.includes('affordable') ||
            query.includes('price')
        ) {
            intent = 'budget_search';
        } else if (
            query.includes('order') ||
            query.includes('track') ||
            query.includes('delivery')
        ) {
            if (query.includes('cancel') || query.includes('stop') || query.includes('delete') || query.includes('remove order')) {
                intent = 'order_cancellation';
            } else {
                intent = 'order_query';
            }
        } else if (query.includes('cart') || query.includes('checkout')) {
            intent = 'cart_query';
        } else if (query.includes('payment') || query.includes('pay')) {
            intent = 'payment_query';
        } else if (query.includes('category') || query.includes('categories')) {
            intent = 'category_query';
        } else if (
            query.includes('popular') ||
            query.includes('trending') ||
            query.includes('bestseller')
        ) {
            intent = 'trending';
        }

        console.log(`🎯 Classified intent: ${intent}`);
        return { intent };
    }

    // Step 2.5: Handle mutations/actions (like order cancellation)
    private async handleOrderActions(state: ChatState): Promise<Partial<ChatState>> {
        if (state.intent !== 'order_cancellation' || !state.userId) {
            return {};
        }

        try {
            const query = state.query.toLowerCase();
            const uid = parseInt(state.userId);
            let actionContext = '';

            // Look for order ID
            const orderIdMatch = query.match(/(?:#|order\s+|no\.?\s*)(\d+)/i);
            let orderId: number | null = null;

            if (orderIdMatch && orderIdMatch[1]) {
                orderId = parseInt(orderIdMatch[1]);
            } else {
                // Find latest pending order if no ID specified
                const latestOrder = await prisma.order.findFirst({
                    where: { userId: uid, orderStatus: 'pending' },
                    orderBy: { createdAt: 'desc' }
                });
                if (latestOrder) orderId = latestOrder.id;
            }

            if (orderId) {
                const order = await prisma.order.findUnique({
                    where: { id: orderId, userId: uid }
                });

                if (order && order.orderStatus === 'pending') {
                    // Only cancel if they are being specific or confirmed
                    // For now, let's assume they want it cancelled if they reached here with 'order_cancellation' intent
                    await prisma.order.update({
                        where: { id: orderId },
                        data: { orderStatus: 'cancelled' }
                    });

                    actionContext = `\n\n[IMPORTANT]: I have successfully cancelled your Order #${orderId} as requested.`;
                    console.log(`🗑️ Chatbot cancelled order ${orderId} for user ${uid}`);
                }
            }

            if (actionContext) {
                return { context: state.context + actionContext };
            }
        } catch (error) {
            console.error('Error in handleOrderActions:', error);
        }

        return {};
    }

    // Step 3: Extract price preferences
    private async extractPreferences(state: ChatState): Promise<Partial<ChatState>> {
        const query = state.query.toLowerCase();
        let priceFilter = null;

        // Extract price from query
        const priceMatch = query.match(/under\s+rs\.?\s*(\d+)/i) ||
            query.match(/below\s+(\d+)/i) ||
            query.match(/less than\s+(\d+)/i);

        if (priceMatch && priceMatch[1]) {
            priceFilter = { max: parseInt(priceMatch[1]) };
        }

        const rangeMatch = query.match(/between\s+rs\.?\s*(\d+)\s+and\s+rs\.?\s*(\d+)/i) ||
            query.match(/(\d+)\s*-\s*(\d+)/);

        if (rangeMatch && rangeMatch[1] && rangeMatch[2]) {
            priceFilter = {
                min: parseInt(rangeMatch[1]),
                max: parseInt(rangeMatch[2]),
            };
        }

        return { priceFilter };
    }

    // Step 4: Retrieve context from vector DB
    private async retrieveContext(state: ChatState): Promise<Partial<ChatState>> {
        try {
            const filter: any = {
                must: [],
            };

            // Add type filter based on intent
            if (
                state.intent === 'product_search' ||
                state.intent === 'budget_search' ||
                state.intent === 'recommendation'
            ) {
                filter.must.push({ key: 'type', match: { value: 'product' } });

                // Add availability filter
                filter.must.push({ key: 'isAvailable', match: { value: true } });
                filter.must.push({ key: 'isActive', match: { value: true } });

                // Add price filter if specified
                if (state.priceFilter) {
                    if (state.priceFilter.max) {
                        filter.must.push({
                            key: 'price',
                            range: { lte: state.priceFilter.max },
                        });
                    }
                    if (state.priceFilter.min) {
                        filter.must.push({
                            key: 'price',
                            range: { gte: state.priceFilter.min },
                        });
                    }
                }
            }

            const retrievedDocs = await embeddingService.searchSimilar(
                state.query,
                10,
                filter.must.length > 0 ? filter : undefined
            );

            let context = '';
            if (retrievedDocs.length > 0) {
                context = 'Relevant Information:\n\n';
                retrievedDocs.forEach((doc, idx) => {
                    context += `${idx + 1}. ${doc.text}\n`;
                });
            }

            console.log(`📚 Retrieved ${retrievedDocs.length} documents`);
            return { retrievedDocs, context };
        } catch (error) {
            console.error('Error retrieving context:', error);
            return { retrievedDocs: [], context: '' };
        }
    }

    // Step 5: Enrich with user context
    private async enrichUserContext(state: ChatState): Promise<Partial<ChatState>> {
        if (!state.userId) {
            return {};
        }

        try {
            let userContext = '';
            const uid = parseInt(state.userId as string);
            const query = state.query.toLowerCase();

            // Get user preferences
            const preferences = await recommendationService.getUserPreferences(uid);

            userContext += `\n\nUser Profile:`;
            if (preferences.priceRange) {
                userContext += `\n- Average spending: Rs ${Math.round(preferences.priceRange.min)} - Rs ${Math.round(preferences.priceRange.max)}`;
            }
            if (preferences.favoriteCategories && preferences.favoriteCategories.length > 0) {
                userContext += `\n- Favorite categories: ${preferences.favoriteCategories.join(', ')}`;
            }

            // Order-specific context
            if (state.intent === 'order_query' || state.intent === 'order_cancellation') {
                // Check for order ID in query (e.g., #105, order 105, etc.)
                const orderIdMatch = query.match(/(?:#|order\s+|no\.?\s*)(\d+)/i);

                if (orderIdMatch && orderIdMatch[1]) {
                    const orderId = parseInt(orderIdMatch[1]);
                    const order = await prisma.order.findUnique({
                        where: { id: orderId, userId: uid },
                        include: {
                            orderItems: { include: { product: true } },
                            payments: true
                        }
                    });

                    if (order) {
                        userContext += `\n\nDetailed Info for Order #${order.id}:`;
                        userContext += `\n- Current Status: ${order.orderStatus.toUpperCase()}`;
                        userContext += `\n- Placed On: ${new Date(order.createdAt).toLocaleString()}`;
                        userContext += `\n- Total Amount: Rs ${order.total}`;
                        userContext += `\n- Items: ${order.orderItems.map(item => `${item.product.title} (x${item.quantity})`).join(', ')}`;

                        if (order.payments && order.payments.length > 0) {
                            const lastPayment = order.payments[order.payments.length - 1];
                            if (lastPayment) {
                                userContext += `\n- Payment Status: ${lastPayment.status.toUpperCase()} (${lastPayment.gateway})`;
                            }
                        }

                        if (order.orderStatus === 'shipped') {
                            userContext += `\n- Note: Your order is out for delivery! Please have the OTP ready for the delivery partner.`;
                        } else if (order.orderStatus === 'pending') {
                            userContext += `\n- Note: This order is currently pending and can be cancelled if needed.`;
                        }

                        // Extra hint for cancellation intent
                        if (state.intent === 'order_cancellation') {
                            if (order.orderStatus === 'pending') {
                                userContext += `\n- ACTION: This order IS eligible for cancellation.`;
                            } else {
                                userContext += `\n- ACTION: This order CANNOT be cancelled because its status is ${order.orderStatus}.`;
                            }
                        }
                    } else {
                        userContext += `\n\nI couldn't find an order with ID #${orderId} associated with your account. Could you please double-check the number?`;
                    }
                } else {
                    // Fetch recent orders if no specific ID mentioned
                    const orders = await prisma.order.findMany({
                        where: { userId: uid },
                        take: 5,
                        orderBy: { createdAt: 'desc' },
                        include: {
                            orderItems: { include: { product: true } },
                        }
                    });

                    if (orders.length > 0) {
                        userContext += '\n\nYour Recent Order History:\n';
                        orders.forEach((order) => {
                            const itemSummary = order.orderItems.slice(0, 2).map(i => i.product.title).join(', ');
                            const moreItems = order.orderItems.length > 2 ? ` (+${order.orderItems.length - 2} more)` : '';
                            userContext += `- Order #${order.id}: ${order.orderStatus.toUpperCase()} (Rs ${order.total}) - ${new Date(order.createdAt).toLocaleDateString()} [Items: ${itemSummary}${moreItems}]\n`;
                        });
                        userContext += `\nYou can ask "Where is order #[ID]?" for more specific details about any of these.`;
                    } else {
                        userContext += '\n\nYou haven\'t placed any orders yet. Ready to start shopping?';
                    }
                }
            }

            // Cart-specific context
            if (state.intent === 'cart_query') {
                const cartItems = await prisma.cartItem.findMany({
                    where: { userId: uid },
                });

                const skus = cartItems.map(item => item.sku);
                const products = await prisma.product.findMany({
                    where: { sku: { in: skus } }
                });

                if (cartItems.length > 0) {
                    userContext += '\n\nYour Cart:\n';
                    let total = 0;
                    cartItems.forEach((item) => {
                        const product = products.find(p => p.sku === item.sku);
                        const itemTotal = (product?.price || item.price) * item.quantity;
                        total += itemTotal;
                        userContext += `- ${product?.title || item.sku} x${item.quantity} (Rs ${itemTotal})\n`;
                    });
                    userContext += `Total: Rs ${total}\n`;
                }
            }

            if (userContext) {
                return {
                    context: state.context + userContext,
                    userPreferences: preferences,
                };
            }
        } catch (error) {
            console.error('Error enriching user context:', error);
        }

        return {};
    }

    // Step 6: Get recommendations
    private async getRecommendations(state: ChatState): Promise<Partial<ChatState>> {
        try {
            let recommendations = [];
            const uid = state.userId ? parseInt(state.userId) : undefined;

            if (state.intent === 'recommendation' && uid) {
                // Personalized recommendations
                recommendations = await recommendationService.recommendProducts(
                    uid,
                    5
                );
            } else if (state.intent === 'trending') {
                // Trending products
                recommendations = await recommendationService.getTrendingProducts(5);
            } else if (state.intent === 'budget_search' && state.priceFilter?.max) {
                // Budget products
                recommendations = await recommendationService.getBudgetProducts(
                    state.priceFilter.max,
                    8
                );
            } else if (state.intent === 'product_search' && state.retrievedDocs.length > 0) {
                // Similar products
                const firstProductId = state.retrievedDocs[0]?.metadata?.productId;
                if (firstProductId) {
                    const similar = await recommendationService.getSimilarProducts(
                        firstProductId,
                        3
                    );
                    recommendations = similar;
                }
            }

            // Add recommendations to context
            if (recommendations.length > 0) {
                let recContext = '\n\nRecommended Products:\n';
                recommendations.forEach((rec: any, idx: number) => {
                    if (rec.metadata) {
                        // From vector search
                        recContext += `${idx + 1}. ${rec.metadata.name} - Rs ${rec.metadata.price}`;
                        if (rec.metadata.mrp && rec.metadata.mrp > rec.metadata.price) {
                            recContext += ` (MRP: Rs ${rec.metadata.mrp}, Save Rs ${rec.metadata.mrp - rec.metadata.price}!)`;
                        }
                        recContext += '\n';
                    } else {
                        // From database
                        recContext += `${idx + 1}. ${rec.title} - Rs ${rec.price}`;
                        if (rec.mrp && rec.mrp > rec.price) {
                            recContext += ` (MRP: Rs ${rec.mrp}, Save Rs ${rec.mrp - rec.price}!)`;
                        }
                        if (rec.avgRating) {
                            recContext += ` (${rec.avgRating.toFixed(1)}⭐)`;
                        }
                        recContext += '\n';
                    }
                });

                return {
                    recommendations,
                    context: state.context + recContext,
                };
            }
        } catch (error) {
            console.error('Error getting recommendations:', error);
        }

        return {};
    }

    // Step 7: Generate response
    private async generateResponse(state: ChatState): Promise<Partial<ChatState>> {
        try {
            const systemPrompt = `You are a helpful AI shopping assistant for Sajha Kirana (साझा किराना), Nepal's premier grocery e-commerce platform.

Your role:
- Help users find products within their budget and preferences
- Provide personalized product recommendations
- Answer questions about orders, delivery, and payments
- Be friendly, helpful, and use Nepali greetings (नमस्ते, धन्यवाद)
- Always mention prices in Nepali Rupees (Rs)
- Highlight deals, discounts (MRP vs Price), ratings, and availability
- If a product is on sale (MRP > Price), emphasize the savings
- Use product descriptions to explain why a product is a good choice

Context Information:
${state.context}

User Intent: ${state.intent}
Price Filter: ${state.priceFilter ? `Rs ${state.priceFilter.min || 0} - Rs ${state.priceFilter.max || 'unlimited'}` : 'None'}

Guidelines:
- Be concise but informative
- Suggest 2-3 products when relevant
- Mention if products are in stock
- Include ratings if available
- Suggest similar or complementary products
- Help with budget-friendly options
- Guide users through checkout if needed`;

            const response = await this.llm.invoke([
                { role: 'system', content: systemPrompt },
                ...state.messages,
            ]);

            console.log('✅ Generated response');
            return { response: response.content as string };
        } catch (error) {
            console.error('Error generating response:', error);
            return {
                response: 'I apologize, but I encountered an error. Please try again.',
            };
        }
    }

    // Step 8: Generate suggested questions
    private async generateSuggestions(state: ChatState): Promise<Partial<ChatState>> {
        try {
            let suggestedQuestions: string[] = [];

            switch (state.intent) {
                case 'product_search':
                case 'recommendation':
                    suggestedQuestions = [
                        'Show me similar products',
                        'What are budget alternatives?',
                        'Show trending products',
                        'Add to cart',
                    ];
                    break;
                case 'budget_search':
                    suggestedQuestions = [
                        'Show products under Rs 200',
                        'What are the best deals today?',
                        'Show more budget items',
                        'Recommend based on my history',
                    ];
                    break;
                case 'order_query':
                    suggestedQuestions = [
                        'Track my latest order',
                        'Where is my order #',
                        'Show my last 5 orders',
                        'Cancel my pending order',
                    ];
                    break;
                case 'order_cancellation':
                    suggestedQuestions = [
                        'Show my recent orders',
                        'How do I get a refund?',
                        'Talk to human support',
                        'Shop for something else',
                    ];
                    break;
                case 'cart_query':
                    suggestedQuestions = [
                        'Proceed to checkout',
                        'Apply coupon code',
                        'Show recommended products',
                        'Clear my cart',
                    ];
                    break;
                case 'trending':
                    suggestedQuestions = [
                        'Show today\'s deals',
                        'What\'s new this week?',
                        'Show bestsellers',
                        'Recommend for me',
                    ];
                    break;
                default:
                    suggestedQuestions = [
                        'What products do you have?',
                        'Show trending items',
                        'Products under Rs 500',
                        'Track my order',
                    ];
            }

            // Save to conversation memory
            if (state.sessionId) {
                const context = await conversationMemoryService.getContext(
                    state.sessionId,
                    state.userId
                );
                if (context) {
                    context.currentIntent = state.intent;
                    context.suggestedProducts = state.recommendations.map((r: any) =>
                        r.metadata?.productId || r.id
                    );
                    await conversationMemoryService.saveContext(context);
                }
            }

            return { suggestedQuestions };
        } catch (error) {
            console.error('Error generating suggestions:', error);
            return { suggestedQuestions: [] };
        }
    }

    // Execute the graph
    async chat(
        messages: Array<{ role: string; content: string }>,
        userId?: string,
        sessionId?: string
    ): Promise<{ response: string; suggestions: string[]; recommendations: any[] }> {
        try {
            // Generate session ID if not provided
            const sid = sessionId || `session_${Date.now()}`;

            // Get conversation memory
            const memory = await conversationMemoryService.getContext(sid, userId);
            const conversationMessages = memory?.messages || [];

            // Combine memory with new messages
            const allMessages = [
                ...(conversationMessages || []).map((m) => ({ role: m.role, content: m.content })),
                ...(messages || []),
            ];

            const uid = userId ? parseInt(userId) : 0;

            const initialState: ChatState = {
                messages: allMessages,
                query: '',
                intent: '',
                context: '',
                retrievedDocs: [],
                recommendations: [],
                userPreferences: null,
                priceFilter: null,
                response: '',
                userId,
                sessionId: sid,
                suggestedQuestions: [],
            };

            const result = await this.graph.invoke(initialState);

            // Save to conversation memory
            if (messages && messages.length > 0) {
                const lastMessage = messages[messages.length - 1];
                if (lastMessage) {
                    await conversationMemoryService.addMessage(
                        sid,
                        lastMessage.role,
                        lastMessage.content,
                        uid
                    );
                }
            }

            await conversationMemoryService.addMessage(
                sid,
                'assistant',
                result.response,
                uid
            );

            return {
                response: result.response,
                suggestions: result.suggestedQuestions || [],
                recommendations: result.recommendations || [],
            };
        } catch (error) {
            console.error('Error in chat:', error);
            throw error;
        }
    }
}

export const langGraphChatbot = new LangGraphChatbot();