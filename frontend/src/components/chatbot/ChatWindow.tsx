import React, { useEffect, useRef } from 'react';
import { useChatbot } from '../../hooks/useChatbot';
import ChatMessage from './ChatMessage';
import ProductRecommendation from './ProductRecommendation';
import CategoryRecommendation from './CategoryRecommendation';
import CartPreview from './CartPreview';
import SuggestedQuestions from './SuggestedQuestions';
import ChatbotInput from '../ui/ChatbotInput';
import { getTimeBasedGreeting } from '../../utils/chatbot.utils';
import { Bot, RotateCcw, X, Maximize2, Sparkles } from 'lucide-react';

interface ChatWindowProps {
    isFloating?: boolean;
    onClose?: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ isFloating = false, onClose }) => {
    const {
        messages,
        isLoading,
        suggestions,
        recommendations,
        categories,
        cartPreview,
        error,
        sendMessage,
        clearChat,
    } = useChatbot();

    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

    return (
        <div className={`flex flex-col overflow-hidden bg-white ${isFloating ? 'h-[600px] w-[400px]' : 'h-full w-full'}`}>
            {/* Premium Header */}
            <div className={`p-6 bg-brand-gradient text-white relative`}>
                <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12">
                    <Bot size={120} />
                </div>

                <div className="flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 glass rounded-2xl flex items-center justify-center">
                            <Bot size={24} className="text-white" />
                        </div>
                        <div>
                            <h2 className="text-lg font-black uppercase tracking-widest">Sajha AI</h2>
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                                <span className="text-[10px] font-bold text-white/80 uppercase">Always Active</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {isFloating && (
                            <button
                                onClick={() => { onClose?.(); window.location.href = '/chatbot'; }}
                                className="p-2 glass hover:bg-white/20 rounded-xl transition-all"
                                title="Expand Chat Window"
                                aria-label="Expand Chat Window"
                            >
                                <Maximize2 size={16} />
                            </button>
                        )}
                        <button
                            onClick={clearChat}
                            className="p-2 glass hover:bg-white/20 rounded-xl transition-all"
                            title="Reset Chat"
                            aria-label="Reset Chat"
                        >
                            <RotateCcw size={16} />
                        </button>
                        {isFloating && (
                            <button
                                onClick={onClose}
                                className="p-2 glass hover:bg-white/20 rounded-xl transition-all"
                                title="Close Chat Window"
                                aria-label="Close Chat Window"
                            >
                                <X size={18} />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto px-6 py-8 bg-slate-50/50">
                {messages.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center text-center">
                        <div className="w-24 h-24 bg-emerald-100/50 rounded-[2.5rem] flex items-center justify-center mb-8 relative">
                            <Sparkles size={40} className="text-emerald-500 animate-pulse" />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 mb-2">{getTimeBasedGreeting()}!</h3>
                        <p className="text-slate-500 max-w-[280px] font-medium leading-relaxed">
                            I can find products, compare prices, or help with your orders. How can I help today?
                        </p>

                        <div className="flex flex-wrap justify-center gap-3 mt-10">
                            {['Show top deals', 'Organic products', 'Track order'].map(action => (
                                <button
                                    key={action}
                                    onClick={() => sendMessage(action)}
                                    className="glass px-5 py-2.5 rounded-2xl text-xs font-black text-slate-700 hover:bg-emerald-500 hover:text-white transition-all shadow-sm"
                                    aria-label={`Ask about ${action}`}
                                >
                                    {action}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                <div className="space-y-6">
                    {messages.map((msg, idx) => (
                        <ChatMessage key={idx} message={msg} />
                    ))}

                    {isLoading && (
                        <div className="flex gap-2 p-4 bg-white rounded-3xl w-20 shadow-sm border border-emerald-50">
                            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" />
                            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                        </div>
                    )}

                    {recommendations.length > 0 && !isLoading && (
                        <ProductRecommendation products={recommendations} onAddToCart={sendMessage} />
                    )}

                    {categories && categories.length > 0 && !isLoading && (
                        <CategoryRecommendation categories={categories} onSelect={sendMessage} />
                    )}

                    {cartPreview && cartPreview.items.length > 0 && !isLoading && (
                        <CartPreview
                            cart={cartPreview}
                            onClear={() => sendMessage('clear cart')}
                            onCheckout={() => sendMessage('checkout')}
                        />
                    )}
                </div>
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-6 bg-white border-t border-slate-100">
                {error && (
                    <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-2xl text-xs font-bold border border-red-100 flex items-center gap-2">
                        <X size={14} /> {error}
                    </div>
                )}
                <SuggestedQuestions questions={suggestions} onSelect={sendMessage} />
                <ChatbotInput onSend={sendMessage} isLoading={isLoading} />
            </div>
        </div>
    );
};

export default ChatWindow;
