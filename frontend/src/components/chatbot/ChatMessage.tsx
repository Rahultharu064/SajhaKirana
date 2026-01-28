import React from 'react';
import type { Message } from '../../types/chatbottypes';
import { formatTimestamp } from '../../utils/chatbot.utils';
import { Bot, User } from 'lucide-react';

interface ChatMessageProps {
    message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
    const isAssistant = message.role === 'assistant';

    // Simple renderer for bold/list items in messages
    const renderContent = (content: string) => {
        return content.split('\n').map((line, i) => {
            let processedLine = line;
            // Handle bold **text**
            const boldRegex = /\*\*(.*?)\*\*/g;
            const parts = [];
            let lastIndex = 0;
            let match;

            while ((match = boldRegex.exec(processedLine)) !== null) {
                if (match.index > lastIndex) {
                    parts.push(processedLine.substring(lastIndex, match.index));
                }
                parts.push(<strong key={`${i}-${match.index}`}>{match[1]}</strong>);
                lastIndex = boldRegex.lastIndex;
            }
            if (lastIndex < processedLine.length) {
                parts.push(processedLine.substring(lastIndex));
            }

            return (
                <div key={i} className={line.trim().startsWith('-') || line.trim().startsWith('*') ? 'pl-4 -indent-4' : ''}>
                    {parts.length > 0 ? parts : processedLine}
                </div>
            );
        });
    };

    return (
        <div className={`flex w-full mb-6 ${isAssistant ? 'justify-start' : 'justify-end'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
            <div className={`flex gap-3 max-w-[85%] ${isAssistant ? 'flex-row' : 'flex-row-reverse'}`}>
                {/* Avatar */}
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-sm ${isAssistant ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-500'
                    }`}>
                    {isAssistant ? <Bot size={18} /> : <User size={18} />}
                </div>

                {/* Bubble Container */}
                <div className="flex flex-col">
                    <div className={`flex items-center mb-1 gap-2 ${isAssistant ? 'justify-start' : 'justify-end'}`}>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                            {isAssistant ? 'Sajha Assistant' : 'You'}
                        </span>
                        <span className="text-[10px] text-gray-300">
                            {formatTimestamp(message.timestamp)}
                        </span>
                    </div>

                    <div
                        className={`p-4 rounded-2xl shadow-sm text-sm leading-relaxed ${isAssistant
                                ? 'bg-white text-gray-800 rounded-tl-none border border-gray-100'
                                : 'bg-primary text-white rounded-tr-none shadow-primary/20'
                            }`}
                    >
                        <div className="whitespace-pre-wrap">
                            {renderContent(message.content)}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatMessage;
