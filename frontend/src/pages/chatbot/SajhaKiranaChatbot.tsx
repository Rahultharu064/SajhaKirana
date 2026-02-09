import React from 'react';
import ChatWindow from '../../components/chatbot/ChatWindow';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const SajhaKiranaChatbot: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="fixed inset-0 bg-[#0F172A] flex flex-col overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[120px] animate-pulse [animation-delay:2s]"></div>
            </div>

            {/* Top Navigation Bar */}
            <header className="relative z-20 flex items-center justify-between px-6 py-4 bg-white/5 backdrop-blur-xl border-b border-white/10">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 px-4 py-2 text-white/80 hover:text-white hover:bg-white/10 rounded-2xl transition-all duration-300 group"
                >
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="font-semibold text-sm text-white">Back to Store</span>
                </button>
                <div className="flex items-center gap-3">
                    <div className="text-right hidden sm:block">
                        <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Powered by</p>
                        <p className="text-xs text-white/80 font-bold tracking-tight">Sajha AI Engine</p>
                    </div>
                </div>
            </header>

            {/* Main Chat Area */}
            <main className="relative z-10 flex-1 w-full max-w-6xl mx-auto flex flex-col p-4 sm:p-6 md:p-8 overflow-hidden">
                <div className="flex-1 overflow-hidden flex flex-col">
                    <ChatWindow />
                </div>
            </main>
        </div>
    );
};

export default SajhaKiranaChatbot;
