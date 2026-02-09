import React from 'react';
import type { Message } from '../../types/chatbottypes';
import { formatTimestamp } from '../../utils/chatbot.utils';
import { Bot, User } from 'lucide-react';

interface ChatMessageProps {
    message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
    const isAssistant = message.role === 'assistant';

    const renderContent = (content: string) => {
        return content.split('\n').map((line, i) => {
            let processedLine = line;

            // Handle markdown images
            const imgRegex = /!\[(.*?)\]\((.*?)\)/g;
            const lineParts: (string | JSX.Element)[] = [];
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
                    <div key={`img-${i}-${imgMatch.index}`} className="my-2 rounded-xl overflow-hidden border border-emerald-100">
                        <img src={imgSrc} alt={imgMatch[1]} className="w-full h-auto max-h-40 object-cover" />
                    </div>
                );
                lastIdx = imgRegex.lastIndex;
            }

            if (lastIdx < processedLine.length) {
                const remainingText = processedLine.substring(lastIdx);

                const boldRegex = /\*\*(.*?)\*\*/g;
                let bIdx = 0;
                let bMatch;

                while ((bMatch = boldRegex.exec(remainingText)) !== null) {
                    if (bMatch.index > bIdx) {
                        lineParts.push(remainingText.substring(bIdx, bMatch.index));
                    }
                    lineParts.push(<strong key={`b-${i}-${bMatch.index}`} className="font-semibold text-gray-900">{bMatch[1]}</strong>);
                    bIdx = boldRegex.lastIndex;
                }
                if (bIdx < remainingText.length) {
                    lineParts.push(remainingText.substring(bIdx));
                }
            } else if (lineParts.length === 0) {
                lineParts.push(processedLine);
            }

            const isList = line.trim().startsWith('-') || line.trim().startsWith('*') || line.trim().match(/^\d+\./);

            return (
                <div key={i} className={isList ? 'pl-3 py-0.5' : 'py-0.5'}>
                    {lineParts}
                </div>
            );
        });
    };

    return (
        <div className={`flex w-full py-2 ${isAssistant ? 'justify-start' : 'justify-end'}`}>
            <div className={`flex gap-2.5 max-w-[85%] ${isAssistant ? 'flex-row' : 'flex-row-reverse'}`}>
                {/* Avatar */}
                <div className={`flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center ${isAssistant
                        ? 'bg-gradient-to-br from-emerald-400 to-teal-500 text-white shadow-md shadow-emerald-500/20'
                        : 'bg-gradient-to-br from-violet-400 to-purple-500 text-white shadow-md shadow-purple-500/20'
                    }`}>
                    {isAssistant ? <Bot size={16} /> : <User size={16} />}
                </div>

                {/* Message */}
                <div className="flex flex-col">
                    <span className={`text-[10px] text-gray-400 font-medium mb-1 ${isAssistant ? '' : 'text-right'}`}>
                        {formatTimestamp(message.timestamp)}
                    </span>
                    <div
                        className={`px-4 py-3 text-[13px] leading-relaxed ${isAssistant
                            ? 'bg-white border border-emerald-100 text-gray-700 rounded-2xl rounded-tl-sm shadow-sm'
                            : 'bg-gradient-to-br from-emerald-500 to-teal-500 text-white rounded-2xl rounded-tr-sm shadow-md shadow-emerald-500/20'
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
