import { StateGraph, END, START } from '@langchain/langgraph';
import { ChatGroq } from '@langchain/groq';
import { embeddingService } from './embeddingService';
import { prismaClient } from '../config/client';

interface ChatState {
    messages: Array<{ role: string; content: string }>;
    query: string;
    intent: string;
    context: string;
    retrievedDocs: any[];
    response: string;
    userId?: string;
}

export class LangGraphChatbot {
    private graph: any; // Using any for the compiled graph to avoid complex typing issues
    private llm: ChatGroq;

    constructor() {
        if (!process.env.GROQ_API_KEY) {
            throw new Error('GROQ_API_KEY is missing');
        }

        this.llm = new ChatGroq({
            apiKey: process.env.GROQ_API_KEY,
            model: 'llama-3.1-70b-versatile',
            temperature: 0.2,
        });

        this.initializeGraph();
    }

    private initializeGraph() {
        const workflow = new StateGraph<ChatState>({
            channels: {
                messages: {
                    value: (x: any[], y: any[]) => (y ? [...x, ...y] : x),
                    default: () => [],
                },
                query: {
                    value: (_: string, y: string) => y,
                    default: () => '',
                },
                intent: {
                    value: (_: string, y: string) => y,
                    default: () => '',
                },
                context: {
                    value: (_: string, y: string) => y,
                    default: () => '',
                },
                retrievedDocs: {
                    value: (_: any[], y: any[]) => y,
                    default: () => [],
                },
                response: {
                    value: (_: string, y: string) => y,
                    default: () => '',
                },
                userId: {
                    value: (_: string | undefined, y: string | undefined) => y,
                    default: () => undefined,
                },
            },
        });

        workflow.addNode('extract_query', this.extractQuery.bind(this));
        workflow.addNode('classify_intent', this.classifyIntent.bind(this));
        workflow.addNode('retrieve_context', this.retrieveContext.bind(this));
        workflow.addNode('enrich_user_context', this.enrichUserContext.bind(this));
        workflow.addNode('generate_response', this.generateResponse.bind(this));

        // ✅ Correct LangGraph entry point
        workflow.addEdge(START, 'extract_query' as any);

        workflow.addEdge('extract_query' as any, 'classify_intent' as any);
        workflow.addEdge('classify_intent' as any, 'retrieve_context' as any);
        workflow.addEdge('retrieve_context' as any, 'enrich_user_context' as any);
        workflow.addEdge('enrich_user_context' as any, 'generate_response' as any);
        workflow.addEdge('generate_response' as any, END as any);

        this.graph = workflow.compile();
    }

    private async extractQuery(state: ChatState): Promise<Partial<ChatState>> {
        const lastMessage = state.messages[state.messages.length - 1];
        return { query: lastMessage?.content || '' };
    }

    private async classifyIntent(state: ChatState): Promise<Partial<ChatState>> {
        const query = state.query.toLowerCase();
        let intent = 'general';

        if (query.includes('product') || query.includes('item') || query.includes('buy')) {
            intent = 'product_search';
        } else if (query.includes('order') || query.includes('track')) {
            intent = 'order_query';
        } else if (query.includes('cart') || query.includes('checkout')) {
            intent = 'cart_query';
        } else if (query.includes('payment') || query.includes('pay')) {
            intent = 'payment_query';
        } else if (query.includes('category')) {
            intent = 'category_query';
        } else if (query.includes('api') || query.includes('tech')) {
            intent = 'technical_query';
        }

        return { intent };
    }

    private async retrieveContext(state: ChatState): Promise<Partial<ChatState>> {
        try {
            const retrievedDocs = await embeddingService.searchSimilar(state.query, 5);

            const context = retrievedDocs.length
                ? 'Relevant Information:\n\n' +
                retrievedDocs.map((d, i) => `${i + 1}. ${d.text}`).join('\n')
                : '';

            return { retrievedDocs, context };
        } catch (err) {
            console.error(err);
            return { retrievedDocs: [], context: '' };
        }
    }

    private async enrichUserContext(state: ChatState): Promise<Partial<ChatState>> {
        if (!state.userId) return {};

        let userContext = '';

        if (state.intent === 'order_query') {
            const orders = await prismaClient.order.findMany({
                where: { userId: Number(state.userId) },
                take: 3,
                orderBy: { createdAt: 'desc' },
            });

            if (orders.length) {
                userContext += '\n\nYour Recent Orders:\n';
                orders.forEach(o => {
                    userContext += `- Order #${o.id}: ${o.orderStatus} (Rs ${o.total})\n`;
                });
            }
        }

        if (state.intent === 'cart_query') {
            const cart = await prismaClient.cartItem.findMany({
                where: { userId: Number(state.userId) },
            });

            if (cart.length) {
                userContext += '\n\nYour Cart:\n';
                cart.forEach(i => {
                    userContext += `- SKU ${i.sku} x${i.quantity} (Rs ${i.price * i.quantity})\n`;
                });
            }
        }

        return userContext ? { context: state.context + userContext } : {};
    }

    private async generateResponse(state: ChatState): Promise<Partial<ChatState>> {
        const systemPrompt = `
You are an AI assistant for Sajha Kirana (साझा किराना).
Be helpful, concise, and accurate.

Context:
${state.context}

User Intent: ${state.intent}
`;

        const response = await this.llm.invoke([
            { role: 'system', content: systemPrompt },
            ...state.messages,
        ]);

        return { response: response.content as string };
    }

    async chat(
        messages: Array<{ role: string; content: string }>,
        userId?: string
    ): Promise<string> {
        const result = await this.graph.invoke({
            messages,
            query: '',
            intent: '',
            context: '',
            retrievedDocs: [],
            response: '',
            userId,
        });

        return result.response;
    }
}

export const langGraphChatbot = new LangGraphChatbot();