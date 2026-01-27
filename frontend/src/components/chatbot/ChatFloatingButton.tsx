import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import ChatWindow from './ChatWindow';

const ChatFloatingButton: React.FC = () => {
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    // Don't show the floating button if we're already on the full chatbot page
    if (location.pathname === '/chatbot') {
        return null;
    }

    return (
        <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end gap-4">
            {/* Chatbot Window Popup */}
            {isOpen && (
                <div className="mb-4 animate-in slide-in-from-bottom-10 fade-in duration-300 origin-bottom-right">
                    <ChatWindow isFloating={true} onClose={() => setIsOpen(false)} />
                </div>
            )}

            {/* Floating Action Button */}
            <div
                className="flex flex-col items-end gap-3"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* Tooltip message - only show when closed */}
                {!isOpen && (
                    <div className={`bg-white px-4 py-2 rounded-2xl shadow-xl border border-gray-100 mb-2 transition-all duration-300 transform ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'}`}>
                        <p className="text-sm font-semibold text-gray-800">
                            Need help? Ask Sajha AI! 👋
                        </p>
                    </div>
                )}

                {/* Main Toggle Button */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={`w-16 h-16 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-300 group relative overflow-hidden ${isOpen ? 'bg-gray-800 text-white rotate-90' : 'bg-primary text-white'
                        }`}
                    aria-label={isOpen ? 'Close Chat' : 'Open Chat'}
                >
                    {/* Glow Effect */}
                    <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    {isOpen ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 transition-transform duration-500 group-hover:rotate-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                    )}

                    {/* Animated Ring (only when closed) */}
                    {!isOpen && (
                        <div className="absolute inset-0 rounded-full border-2 border-white/30 animate-ping opacity-20"></div>
                    )}
                </button>
            </div>
        </div>
    );
};

export default ChatFloatingButton;
