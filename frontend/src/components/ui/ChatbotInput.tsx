import React, { useState } from 'react';
import { SendHorizonal, Loader2 } from 'lucide-react';

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
            className="group relative flex items-center p-1.5 bg-gray-50 rounded-[1.25rem] border border-gray-200 focus-within:border-primary/50 focus-within:bg-white focus-within:ring-4 focus-within:ring-primary/5 transition-all duration-500 shadow-sm hover:shadow-md"
        >
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Message Sajha Assistant..."
                className="flex-1 px-4 py-3 bg-transparent border-none outline-none text-gray-700 placeholder:text-gray-400 text-sm font-medium"
                disabled={isLoading}
            />
            <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className={`flex items-center justify-center w-11 h-11 rounded-xl transition-all duration-300 ${isLoading || !input.trim()
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed opacity-50'
                    : 'bg-primary text-white shadow-lg shadow-primary/20 hover:bg-primary-dark hover:-translate-y-0.5 active:translate-y-0'
                    }`}
            >
                {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                    <SendHorizonal className="w-5 h-5" />
                )}
            </button>
        </form>
    );
};

export default ChatbotInput;
