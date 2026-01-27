import React, { useEffect, useRef } from 'react';
import { useChatbot } from '../../hooks/useChatbot';
import ChatMessage from './ChatMessage';
import ProductRecommendation from './ProductRecommendation';
import SuggestedQuestions from './SuggestedQuestions';
import ChatbotInput from '../ui/ChatbotInput';
import { getTimeBasedGreeting } from '../../utils/chatbot.utils';

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
        ? "flex flex-col h-[500px] w-[380px] bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-in slide-in-from-bottom-5 duration-300"
        : "flex flex-col h-[calc(100vh-120px)] max-w-4xl mx-auto bg-white/50 backdrop-blur-xl rounded-3xl border border-white shadow-2xl overflow-hidden mt-8 mb-8";

    return (
        <div className={containerClasses}>
            {/* Header */}
            <div className={`flex items-center justify-between ${isFloating ? 'px-4 py-3' : 'px-8 py-6'} bg-white border-b border-gray-100`}>
                <div className="flex items-center gap-3">
                    <div className={`${isFloating ? 'w-10 h-10' : 'w-12 h-12'} bg-primary/10 rounded-xl flex items-center justify-center text-primary relative`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className={`${isFloating ? 'h-6 w-6' : 'h-7 w-7'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></span>
                    </div>
                    <div>
                        <h1 className={`${isFloating ? 'text-sm' : 'text-xl'} font-bold text-gray-900 tracking-tight`}>Sajha Assistant</h1>
                        <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-medium text-green-600 uppercase">Online</span>
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
                            className="p-1.5 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
                            title="Open Full Screen"
                            aria-label="Open Full Screen"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                        </button>
                    )}
                    <button
                        onClick={clearChat}
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        title="Clear Conversation"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                    {isFloating && onClose && (
                        <button
                            onClick={onClose}
                            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
                            title="Close Chat"
                            aria-label="Close Chat"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    )}
                </div>
            </div>

            {/* Chat Area */}
            <div className={`flex-1 overflow-y-auto ${isFloating ? 'px-4 py-4' : 'px-8 py-8'} space-y-2 scrollbar-thin`}>
                {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-center space-y-3 animate-in fade-in zoom-in">
                        <h2 className={`${isFloating ? 'text-lg' : 'text-2xl'} font-bold text-gray-800`}>{getTimeBasedGreeting()}!</h2>
                        <p className="text-xs text-gray-500 max-w-[250px]">
                            How can I help you shop today?
                        </p>
                    </div>
                )}

                {messages.map((msg, idx) => (
                    <ChatMessage key={idx} message={msg} />
                ))}

                {isLoading && (
                    <div className="flex justify-start mb-4">
                        <div className="bg-white border border-gray-100 p-3 rounded-xl rounded-tl-none shadow-sm flex gap-1">
                            <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce"></div>
                            <div className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce delay-75"></div>
                            <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce delay-150"></div>
                        </div>
                    </div>
                )}

                {recommendations.length > 0 && !isLoading && (
                    <ProductRecommendation products={recommendations} />
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Footer */}
            <div className={`${isFloating ? 'px-4 py-4' : 'px-8 py-6'} bg-white border-t border-gray-100`}>
                {error && (
                    <div className="mb-3 text-[10px] text-red-500 bg-red-50 p-2 rounded-lg border border-red-100">
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
