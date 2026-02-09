import React from 'react';
import ChatWindow from '../../components/chatbot/ChatWindow';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Zap } from 'lucide-react';

const SajhaKiranaChatbot: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="fixed inset-0 bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex flex-col">
            {/* Decorative Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-100/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-teal-100/40 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
            </div>

            {/* Header */}
            <header className="relative z-10 flex items-center justify-between px-4 sm:px-8 py-4 bg-white/70 backdrop-blur-md border-b border-emerald-100/50">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 px-4 py-2.5 text-emerald-700 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-all duration-200 font-medium"
                >
                    <ChevronLeft size={18} />
                    <span className="text-sm">Back to Store</span>
                </button>

                <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full shadow-lg shadow-emerald-500/20">
                    <Zap size={14} className="fill-current" />
                    <span className="text-xs font-bold tracking-wide">Powered by AI</span>
                </div>
            </header>

            {/* Main Chat Container */}
            <main className="relative z-10 flex-1 w-full max-w-4xl mx-auto flex flex-col p-4 sm:p-6 overflow-hidden">
                <div className="flex-1 bg-white rounded-3xl shadow-2xl shadow-emerald-900/10 border border-white overflow-hidden flex flex-col ring-1 ring-black/5">
                    <ChatWindow />
                </div>
            </main>
        </div>
    );
};

export default SajhaKiranaChatbot;
