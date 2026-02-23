import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Sparkles, Bot } from 'lucide-react';
import ChatWindow from './ChatWindow';

const ChatFloatingButton: React.FC = () => {
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    if (location.pathname === '/chatbot') return null;

    return (
        <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end gap-6">
            {/* Chatbot Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 100, transformOrigin: 'bottom right' }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 100 }}
                        className="mb-4 shadow-[0_20px_50px_rgba(16,185,129,0.3)] rounded-[2.5rem] overflow-hidden"
                    >
                        <ChatWindow isFloating={true} onClose={() => setIsOpen(false)} />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating Button Container */}
            <div
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="relative"
            >
                {/* Tooltip */}
                <AnimatePresence>
                    {!isOpen && isHovered && (
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="absolute right-full mr-4 top-1/2 -translate-y-1/2 whitespace-nowrap"
                        >
                            <div className="glass px-6 py-3 rounded-2xl shadow-xl">
                                <p className="text-sm font-black text-slate-800 flex items-center gap-2 uppercase tracking-widest">
                                    <Sparkles size={14} className="text-emerald-500 animate-pulse" />
                                    Ask Sajha AI
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Main Button */}
                <motion.button
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsOpen(!isOpen)}
                    className={`w-16 h-16 sm:w-20 sm:h-20 rounded-[2rem] shadow-2xl flex items-center justify-center transition-all duration-500 relative overflow-hidden ${isOpen ? 'bg-slate-900 text-white' : 'bg-brand-gradient text-white'
                        }`}
                >
                    <div className="absolute inset-0 bg-white/20 animate-pulse-soft opacity-0 group-hover:opacity-100" />
                    {isOpen ? <X size={32} /> : <Bot size={32} />}

                    {!isOpen && (
                        <div className="absolute inset-0 border-4 border-white/30 rounded-[2rem] animate-ping opacity-20" />
                    )}
                </motion.button>
            </div>
        </div>
    );
};

export default ChatFloatingButton;
