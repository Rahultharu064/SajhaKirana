import React, { useState } from 'react';

interface ChatbotInputProps {
    onSend: (message: string) => void;
    isLoading: boolean;
}

const ChatbotInput: React.FC<ChatbotInputProps> = ({ onSend, isLoading }) => {
    const [input, setInput] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim() && !isLoading) {
            onSend(input);
            setInput('');
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="relative flex items-center p-2 bg-white rounded-2xl border border-gray-200 shadow-lg focus-within:border-primary transition-all duration-300"
        >
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything about Sajha Kirana..."
                className="flex-1 px-4 py-3 bg-transparent border-none outline-none text-gray-700 placeholder:text-gray-400"
                disabled={isLoading}
            />
            <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className={`p-3 rounded-xl transition-all duration-300 ${isLoading || !input.trim()
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-primary text-white hover:bg-primary/90 hover:scale-105 active:scale-95'
                    }`}
            >
                {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-5 h-5"
                    >
                        <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                    </svg>
                )}
            </button>
        </form>
    );
};

export default ChatbotInput;
