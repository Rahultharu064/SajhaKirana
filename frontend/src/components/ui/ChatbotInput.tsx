import React, { useState } from 'react';
import { SendHorizonal, Loader2, Mic, MicOff } from 'lucide-react';
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
            recognition.lang = 'en-US'; // Better for "Add 2kg rice" extraction, but you can change to ne-NP if needed
            recognition.maxAlternatives = 1;

            recognition.onstart = () => {
                setIsListening(true);
            };

            recognition.onresult = (event: any) => {
                const transcript = event.results[0][0].transcript;
                setInput(transcript);
                setIsListening(false);
                // Automatically send if it's a clear command
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
            <div className="flex items-center gap-2 pr-1.5">
                <button
                    type="button"
                    onClick={handleVoiceSearch}
                    disabled={isLoading}
                    className={`flex items-center justify-center w-11 h-11 rounded-xl transition-all duration-300 ${isListening
                        ? 'bg-red-100 text-red-600 animate-pulse'
                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                        }`}
                    title="Voice Shopping Assistant"
                >
                    {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>
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
            </div>
        </form>
    );
};

export default ChatbotInput;
