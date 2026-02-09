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

            // Handle markdown images: ![alt](url)
            const imgRegex = /!\[(.*?)\]\((.*?)\)/g;
            const lineParts = [];
            let lastIdx = 0;
            let imgMatch;

            while ((imgMatch = imgRegex.exec(processedLine)) !== null) {
                if (imgMatch.index > lastIdx) {
                    lineParts.push(processedLine.substring(lastIdx, imgMatch.index));
                }

                const imgSrc = imgMatch[2].startsWith('http')
                    ? imgMatch[2]
                    : `${import.meta.env.VITE_API_URL}/${imgMatch[2]}`;

                lineParts.push(
                    <div key={`img-${i}-${imgMatch.index}`} className="my-3 rounded-xl overflow-hidden border border-gray-100 shadow-sm">
                        <img src={imgSrc} alt={imgMatch[1]} className="w-full h-auto max-h-48 object-cover" />
                    </div>
                );
                lastIdx = imgRegex.lastIndex;
            }

            if (lastIdx < processedLine.length) {
                const remainingText = processedLine.substring(lastIdx);

                // Handle bold **text** in the remaining part
                const boldRegex = /\*\*(.*?)\*\*/g;
                let bIdx = 0;
                let bMatch;

                while ((bMatch = boldRegex.exec(remainingText)) !== null) {
                    if (bMatch.index > bIdx) {
                        lineParts.push(remainingText.substring(bIdx, bMatch.index));
                    }
                    lineParts.push(<strong key={`b-${i}-${bMatch.index}`}>{bMatch[1]}</strong>);
                    bIdx = boldRegex.lastIndex;
                }
                if (bIdx < remainingText.length) {
                    lineParts.push(remainingText.substring(bIdx));
                }
            } else if (lineParts.length === 0) {
                lineParts.push(processedLine);
            }

            return (
                <div key={i} className={line.trim().startsWith('-') || line.trim().startsWith('*') ? 'pl-4 -indent-4' : ''}>
                    {lineParts}
                </div>
            );
        });
    };

    return (
        <div className={`flex w-full mb-4 ${isAssistant ? 'justify-start' : 'justify-end'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
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
                        className={`p-4 sm:p-5 rounded-[1.5rem] shadow-sm text-[13px] sm:text-sm leading-relaxed ${isAssistant
                            ? 'bg-white/80 backdrop-blur-lg text-gray-800 rounded-tl-none border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)]'
                            : 'bg-gradient-to-br from-primary via-primary to-primary-dark text-white rounded-tr-none shadow-[0_10px_25px_-5px_rgba(var(--primary-rgb),0.4)] border border-primary/20'
                            }`}
                    >
                        <div className="whitespace-pre-wrap font-medium tracking-tight">
                            {renderContent(message.content)}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatMessage;
