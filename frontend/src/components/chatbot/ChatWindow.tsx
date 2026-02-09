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

    const containerClasses = isFloating
        ? "flex flex-col h-[520px] w-[380px] bg-white rounded-2xl shadow-2xl border border-emerald-100 overflow-hidden"
        : "flex flex-col h-full w-full bg-white overflow-hidden";

    return (
        <div className={containerClasses}>
            {/* Header */}
            <div className={`flex items-center justify-between ${isFloating ? 'px-4 py-3' : 'px-6 py-4'} bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 text-white`}>
                <div className="flex items-center gap-3">
                    <div className={`${isFloating ? 'w-10 h-10' : 'w-12 h-12'} bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center ring-2 ring-white/30`}>
                        <Bot size={isFloating ? 20 : 24} className="text-white" />
                    </div>
                    <div>
                        <h1 className={`${isFloating ? 'text-base' : 'text-lg'} font-bold text-white`}>
                            Sajha Assistant
                        </h1>
                        <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></span>
                            <span className="text-[11px] text-white/80 font-medium">Ready to help</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-1">
                    {isFloating && (
                        <button
                            onClick={() => {
                                onClose?.();
                                window.location.href = '/chatbot';
                            }}
                            className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200"
                            title="Expand"
                        >
                            <Maximize2 size={16} />
                        </button>
                    )}
                    <button
                        onClick={clearChat}
                        className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200"
                        title="Clear chat"
                    >
                        <RotateCcw size={16} />
                    </button>
                    {isFloating && onClose && (
                        <button
                            onClick={onClose}
                            className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200"
                            title="Close"
                        >
                            <X size={18} />
                        </button>
                    )}
                </div>
            </div>

            {/* Messages Area */}
            <div className={`flex-1 overflow-y-auto ${isFloating ? 'px-4 py-4' : 'px-6 py-6'} bg-gradient-to-b from-emerald-50/30 to-white`}>
                {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-center px-4">
                        {/* Animated Bot Icon */}
                        <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-3xl flex items-center justify-center mb-5 shadow-xl shadow-emerald-500/30 relative">
                            <Bot size={36} className="text-white" />
                            <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg">
                                <Sparkles size={12} className="text-yellow-800" />
                            </div>
                        </div>

                        <h2 className={`${isFloating ? 'text-xl' : 'text-2xl'} font-bold text-gray-800 mb-2`}>
                            {getTimeBasedGreeting()}! 👋
                        </h2>
                        <p className="text-sm text-gray-500 max-w-[280px] leading-relaxed">
                            I'm your smart shopping companion. Ask me about products, deals, or help with your cart!
                        </p>

                        {/* Quick Action Pills */}
                        <div className="flex flex-wrap justify-center gap-2 mt-6">
                            {['Show deals', 'Popular items', 'Track order'].map((action) => (
                                <button
                                    key={action}
                                    onClick={() => sendMessage(action)}
                                    className="px-4 py-2 bg-white border-2 border-emerald-100 text-emerald-700 rounded-full text-xs font-semibold hover:border-emerald-300 hover:bg-emerald-50 transition-all duration-200 shadow-sm"
                                >
                                    {action}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                <div className="space-y-2">
                    {messages.map((msg, idx) => (
                        <ChatMessage key={idx} message={msg} />
                    ))}
                </div>

                {isLoading && (
                    <div className="flex justify-start mt-3">
                        <div className="bg-white border border-emerald-100 py-3 px-5 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-1.5">
                            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce [animation-delay:150ms]"></div>
                            <div className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce [animation-delay:300ms]"></div>
                        </div>
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

                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className={`${isFloating ? 'px-4 py-3' : 'px-6 py-4'} bg-white border-t border-emerald-50`}>
                {error && (
                    <div className="mb-3 text-xs text-red-600 bg-red-50 py-2.5 px-4 rounded-xl flex items-center gap-2 border border-red-100">
                        <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                        {error}
                    </div>
                )}

                <SuggestedQuestions questions={suggestions} onSelect={sendMessage} />
                <ChatbotInput onSend={sendMessage} isLoading={isLoading} />
            </div>
        </div>
    );
};

export default ChatWindow;
