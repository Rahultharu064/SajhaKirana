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
        : "flex flex-col h-full w-full bg-white/95 backdrop-blur-2xl rounded-[2.5rem] border border-white/20 shadow-[0_32px_64px_-15px_rgba(0,0,0,0.3)] overflow-hidden transition-all duration-500";

    return (
        <div className={containerClasses}>
            {/* Header */}
            <div className={`flex items-center justify-between ${isFloating ? 'px-5 py-4' : 'px-8 py-6'} bg-gradient-to-br from-primary via-primary to-primary-dark text-white shadow-xl relative overflow-hidden flex-shrink-0`}>
                {/* Decorative Pattern */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-24 -mt-24 blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary-light/10 rounded-full -ml-16 -mb-16 blur-2xl"></div>

                <div className="flex items-center gap-5 relative z-10">
                    <div className={`${isFloating ? 'w-11 h-11' : 'w-16 h-16'} bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center relative shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] border border-white/20`}>
                        <Bot size={isFloating ? 24 : 36} className="text-white drop-shadow-lg" />
                        <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-primary rounded-full animate-pulse shadow-lg shadow-green-400/20"></span>
                    </div>
                    <div>
                        <h1 className={`${isFloating ? 'text-base' : 'text-2xl'} font-extrabold tracking-tight text-white mb-0.5 drop-shadow-sm`}>
                            Sajha Smart Assistant
                        </h1>
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-sm shadow-green-400/50"></span>
                            <span className="text-[10px] sm:text-xs font-bold text-white/70 uppercase tracking-[0.2em]">Interactive Session</span>
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
            <div className={`flex-1 overflow-y-auto ${isFloating ? 'px-4 py-4' : 'px-6 py-6'} space-y-3 scrollbar-hide bg-[#F8FAFC]/30 backdrop-blur-sm relative`}>
                {/* Subtle Geometric Overlay */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-center space-y-6 animate-in fade-in zoom-in duration-700">
                        <div className="w-20 h-20 bg-primary/5 rounded-[2rem] flex items-center justify-center text-primary-light">
                            <Bot size={40} />
                        </div>
                        <div className="space-y-1">
                            <h2 className={`${isFloating ? 'text-lg' : 'text-2xl'} font-black text-gray-900`}>
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
                    <div className="flex justify-start mb-4 animate-in fade-in slide-in-from-left-2 duration-300">
                        <div className="bg-white border border-gray-100 py-3 px-5 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-1.5 overflow-hidden relative">
                            <div className="w-2 h-2 bg-primary/30 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                            <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.4s]"></div>
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
            <div className={`${isFloating ? 'px-4 py-4' : 'px-8 py-5'} bg-white border-t border-gray-50 shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.05)] flex-shrink-0`}>
                {error && (
                    <div className="mb-3 text-[10px] text-red-600 bg-red-50 py-2 px-3 rounded-lg border border-red-100 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
                        {error}
                    </div>
                )}

                <SuggestedQuestions questions={suggestions} onSelect={sendMessage} />
                <ChatbotInput onSend={sendMessage} isLoading={isLoading} />

                {!isFloating && (
                    <p className="mt-3 text-[9px] text-center text-gray-400 font-bold uppercase tracking-[0.15em] opacity-60">
                        Secure AI Shopping Session
                    </p>
                )}
            </div>
        </div>
    );
};

export default ChatWindow;
