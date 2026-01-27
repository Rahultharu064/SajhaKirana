import React from 'react';
import type { Message } from '../../types/chatbottypes';
import { formatTimestamp } from '../../utils/chatbot.utils';

interface ChatMessageProps {
    message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
    const isAssistant = message.role === 'assistant';

    return (
        <div className={`flex w-full mb-4 ${isAssistant ? 'justify-start' : 'justify-end'}`}>
            <div
                className={`max-w-[80%] p-4 rounded-2xl shadow-sm ${isAssistant
                        ? 'bg-white text-gray-800 rounded-tl-none border border-gray-100'
                        : 'bg-primary text-white rounded-tr-none'
                    }`}
            >
                <div className="flex items-center mb-1">
                    <span className="text-xs font-semibold uppercase tracking-wider opacity-70">
                        {isAssistant ? 'Sajha Assistant' : 'You'}
                    </span>
                    <span className="ml-2 text-[10px] opacity-50">
                        {formatTimestamp(message.timestamp)}
                    </span>
                </div>
                <div className="text-sm leading-relaxed whitespace-pre-wrap">
                    {message.content}
                </div>
            </div>
        </div>
    );
};

export default ChatMessage;
