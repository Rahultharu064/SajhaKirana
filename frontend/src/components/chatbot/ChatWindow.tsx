import React, { useEffect, useRef } from 'react';
import { useChatbot } from '../../hooks/useChatbot';
import ChatMessage from './ChatMessage';
import ProductRecommendation from './ProductRecommendation';
import CategoryRecommendation from './CategoryRecommendation';
import CartPreview from './CartPreview';
import SuggestedQuestions from './SuggestedQuestions';
import ChatbotInput from '../ui/ChatbotInput';
import { getTimeBasedGreeting } from '../../utils/chatbot.utils';
import { Bot, RefreshCw, X, Maximize2 } from 'lucide-react';

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

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

    const containerClasses = isFloating
        ? "flex flex-col h-[550px] w-[400px] bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden animate-in slide-in-from-bottom-5 duration-500"
        : "flex flex-col h-[750px] max-w-5xl mx-auto bg-white/80 backdrop-blur-xl rounded-[2.5rem] border border-white shadow-2xl overflow-hidden mt-4 mb-4";

    return (
        <div className={containerClasses}>
            {/* Header */}
            <div className={`flex items-center justify-between ${isFloating ? 'px-5 py-4' : 'px-10 py-7'} bg-gradient-to-r from-primary to-primary-dark text-white shadow-md relative overflow-hidden`}>
                {/* Decorative Pattern */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>

                <div className="flex items-center gap-4 relative z-10">
                    <div className={`${isFloating ? 'w-11 h-11' : 'w-14 h-14'} bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center relative shadow-inner`}>
                        <Bot size={isFloating ? 24 : 32} className="text-white" />
                        <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-400 border-2 border-primary rounded-full animate-pulse shadow-sm"></span>
                    </div>
                    <div>
                        <h1 className={`${isFloating ? 'text-base' : 'text-2xl'} font-bold tracking-tight text-white shadow-sm`}>
                            Sajha Assistant
                        </h1>
                        <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span>
                            <span className="text-[10px] font-bold text-white/80 uppercase tracking-widest">Always Active</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2 relative z-10">
                    {isFloating && (
                        <button
                            onClick={() => {
                                onClose?.();
                                window.location.href = '/chatbot';
                            }}
                            className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-300"
                            title="Open Full Screen"
                        >
                            <Maximize2 size={18} />
                        </button>
                    )}
                    <button
                        onClick={clearChat}
                        className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-300"
                        title="Clear Conversation"
                    >
                        <RefreshCw size={18} />
                    </button>
                    {isFloating && onClose && (
                        <button
                            onClick={onClose}
                            className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-300"
                            title="Close Chat"
                        >
                            <X size={20} />
                        </button>
                    )}
                </div>
            </div>

            {/* Chat Area */}
            <div className={`flex-1 overflow-y-auto ${isFloating ? 'px-5 py-6' : 'px-10 py-10'} space-y-2 scrollbar-hide bg-[#F9FAFB]/50`}>
                {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-center space-y-6 animate-in fade-in zoom-in duration-700">
                        <div className="w-24 h-24 bg-primary/5 rounded-[2rem] flex items-center justify-center text-primary-light">
                            <Bot size={48} />
                        </div>
                        <div className="space-y-2">
                            <h2 className={`${isFloating ? 'text-xl' : 'text-3xl'} font-black text-gray-900`}>
                                {getTimeBasedGreeting()}!
                            </h2>
                            <p className="text-sm text-gray-500 max-w-[280px] mx-auto leading-relaxed">
                                I'm your official Sajha Kirana shopping guide. How can I help you today?
                            </p>
                        </div>
                    </div>
                )}

                {messages.map((msg, idx) => (
                    <ChatMessage key={idx} message={msg} />
                ))}

                {isLoading && (
                    <div className="flex justify-start mb-6 animate-in fade-in slide-in-from-left-2 duration-300">
                        <div className="bg-white border border-gray-100 py-4 px-6 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-1.5 overflow-hidden relative">
                            <div className="w-2 h-2 bg-primary/30 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                            <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.4s]"></div>
                            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary/5">
                                <div className="h-full bg-primary/20 animate-loading-bar"></div>
                            </div>
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

            {/* Footer */}
            <div className={`${isFloating ? 'px-5 py-5' : 'px-10 py-8'} bg-white border-t border-gray-50 shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.05)]`}>
                {error && (
                    <div className="mb-4 text-xs text-red-600 bg-red-50 py-3 px-4 rounded-xl border border-red-100 flex items-center gap-3">
                        <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
                        {error}
                    </div>
                )}

                <SuggestedQuestions questions={suggestions} onSelect={sendMessage} />
                <ChatbotInput onSend={sendMessage} isLoading={isLoading} />

                {!isFloating && (
                    <p className="mt-4 text-[10px] text-center text-gray-400 font-medium tracking-wide uppercase">
                        Powered by Sajha AI & LangGraph • Secure & Encrypted
                    </p>
                )}
            </div>
        </div>
    );
};

export default ChatWindow;
