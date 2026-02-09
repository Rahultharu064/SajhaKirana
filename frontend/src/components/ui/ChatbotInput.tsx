import React, { useState } from 'react';
import { Send, Loader2, Mic, MicOff } from 'lucide-react';
import toast from 'react-hot-toast';

interface ChatbotInputProps {
    onSend: (message: string) => void;
    isLoading: boolean;
}

const ChatbotInput: React.FC<ChatbotInputProps> = ({ onSend, isLoading }) => {
    const [input, setInput] = useState('');
    const [isListening, setIsListening] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim() && !isLoading) {
            onSend(input);
            setInput('');
        }
    };

    const handleVoiceSearch = () => {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            toast.error('Voice input not supported in this browser.');
            return;
        }

        try {
            const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
            const recognition = new SpeechRecognition();

            recognition.continuous = false;
            recognition.interimResults = false;
            recognition.lang = 'en-US';
            recognition.maxAlternatives = 1;

            recognition.onstart = () => {
                setIsListening(true);
            };

            recognition.onresult = (event: any) => {
                const transcript = event.results[0][0].transcript;
                setInput(transcript);
                setIsListening(false);
                if (transcript.length > 3) {
                    onSend(transcript);
                    setInput('');
                }
            };

            recognition.onerror = () => {
                setIsListening(false);
                toast.error('Voice input failed.');
            };

            recognition.onend = () => {
                setIsListening(false);
            };

            recognition.start();
        } catch (error) {
            toast.error('Voice input failed.');
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="flex items-center gap-2 p-1.5 bg-gray-50 rounded-2xl border-2 border-gray-100 focus-within:border-emerald-300 focus-within:bg-white transition-all duration-200"
        >
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything..."
                className="flex-1 px-4 py-2.5 bg-transparent border-none outline-none text-gray-700 placeholder:text-gray-400 text-sm font-medium"
                disabled={isLoading}
            />

            <div className="flex items-center gap-1.5 pr-0.5">
                <button
                    type="button"
                    onClick={handleVoiceSearch}
                    disabled={isLoading}
                    className={`flex items-center justify-center w-9 h-9 rounded-xl transition-all duration-200 ${isListening
                            ? 'bg-gradient-to-br from-rose-500 to-pink-500 text-white shadow-lg shadow-rose-500/30 animate-pulse'
                            : 'text-gray-400 hover:text-emerald-600 hover:bg-emerald-50'
                        }`}
                    title="Voice input"
                >
                    {isListening ? <MicOff size={18} /> : <Mic size={18} />}
                </button>

                <button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    className={`flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200 ${isLoading || !input.trim()
                            ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                            : 'bg-gradient-to-br from-emerald-500 to-teal-500 text-white hover:shadow-lg hover:shadow-emerald-500/30 hover:scale-105'
                        }`}
                >
                    {isLoading ? (
                        <Loader2 size={18} className="animate-spin" />
                    ) : (
                        <Send size={18} />
                    )}
                </button>
            </div>
        </form>
    );
};

export default ChatbotInput;
