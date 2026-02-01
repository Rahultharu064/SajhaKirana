// frontend/src/components/chatbot/EscalationCard.tsx
// Human agent escalation card for chatbot

import React, { useState } from 'react';
import { Headphones, Clock, AlertCircle, CheckCircle2, MessageSquare } from 'lucide-react';

interface EscalationTicket {
    id?: number;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    status: string;
}

interface EscalationCardProps {
    ticket?: EscalationTicket;
    isConnecting?: boolean;
    onCancel?: () => void;
}

const EscalationCard: React.FC<EscalationCardProps> = ({
    ticket,
    isConnecting = false,
    onCancel
}) => {
    const [showAgentTyping, setShowAgentTyping] = useState(false);

    // Simulate agent connection after a delay
    React.useEffect(() => {
        if (ticket && ticket.status === 'pending') {
            const timer = setTimeout(() => {
                setShowAgentTyping(true);
            }, 3000); // Show "agent viewing" after 3 seconds
            return () => clearTimeout(timer);
        }
    }, [ticket]);

    const priorityConfig = {
        urgent: { color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', icon: '🚨', wait: '< 2 min' },
        high: { color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200', icon: '⚡', wait: '< 5 min' },
        medium: { color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200', icon: '📞', wait: '< 10 min' },
        low: { color: 'text-gray-600', bg: 'bg-gray-50', border: 'border-gray-200', icon: '💬', wait: '< 15 min' }
    };

    const config = ticket ? priorityConfig[ticket.priority] : priorityConfig.medium;

    if (isConnecting) {
        return (
            <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-2xl p-6 border border-primary/20 animate-pulse">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                        <Headphones size={24} className="text-primary animate-bounce" />
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-800">Connecting to Support...</h4>
                        <p className="text-sm text-gray-500">Please wait while we find an available agent</p>
                    </div>
                </div>
                <div className="mt-4 flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full animate-ping" />
                    <div className="w-2 h-2 bg-primary rounded-full animate-ping [animation-delay:0.2s]" />
                    <div className="w-2 h-2 bg-primary rounded-full animate-ping [animation-delay:0.4s]" />
                </div>
            </div>
        );
    }

    return (
        <div className={`rounded-2xl border ${config.border} ${config.bg} overflow-hidden animate-in slide-in-from-bottom-2 duration-300`}>
            {/* Header */}
            <div className="px-5 py-4 border-b border-gray-100/50 bg-white/40">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className={`p-2.5 rounded-xl ${config.bg} ${config.color} border ${config.border}`}>
                            <Headphones size={22} />
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-800">Human Support</h4>
                            <p className={`text-sm font-medium ${config.color}`}>
                                {config.icon} {ticket?.priority.toUpperCase()} Priority
                            </p>
                        </div>
                    </div>
                    {ticket?.id && (
                        <div className="text-right">
                            <p className="text-xs text-gray-500">Ticket</p>
                            <p className="font-mono font-bold text-gray-700">#{ticket.id}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Status */}
            <div className="px-5 py-4 bg-white/30">
                <div className="flex items-center gap-3 mb-3">
                    {ticket?.status === 'pending' ? (
                        <>
                            <div className="relative">
                                <Clock size={18} className="text-yellow-600" />
                                <span className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full animate-ping" />
                            </div>
                            <span className="text-sm text-gray-600">Waiting for an agent...</span>
                        </>
                    ) : ticket?.status === 'assigned' ? (
                        <>
                            <CheckCircle2 size={18} className="text-green-600" />
                            <span className="text-sm text-green-700 font-medium">Agent connected!</span>
                        </>
                    ) : (
                        <>
                            <AlertCircle size={18} className="text-blue-600" />
                            <span className="text-sm text-gray-600">Creating ticket...</span>
                        </>
                    )}
                </div>

                {/* Estimated Wait */}
                {ticket?.status === 'pending' && (
                    <div className="bg-white rounded-xl p-3 border border-gray-100">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">Estimated wait</span>
                            <span className="font-semibold text-gray-800">{config.wait}</span>
                        </div>
                        {/* Progress bar simulation */}
                        <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-primary rounded-full animate-pulse"
                                style={{ width: '30%' }}
                            />
                        </div>
                    </div>
                )}

                {/* Agent Typing Indicator */}
                {showAgentTyping && ticket?.status === 'pending' && (
                    <div className="mt-3 flex items-center gap-2 text-sm text-gray-500 animate-in fade-in duration-500">
                        <MessageSquare size={14} className="text-primary" />
                        <span>An agent is viewing your request...</span>
                    </div>
                )}
            </div>

            {/* Tips */}
            <div className="px-5 py-3 bg-white/20 text-xs text-gray-500">
                <p className="mb-2">💡 <strong>While you wait:</strong></p>
                <ul className="space-y-1 ml-4">
                    <li>• Feel free to share more details about your issue</li>
                    <li>• Keep this chat open - you'll be notified when connected</li>
                    <li>• Have your order number ready if applicable</li>
                </ul>
            </div>

            {/* Actions */}
            {onCancel && ticket?.status === 'pending' && (
                <div className="px-5 py-3 bg-white border-t border-gray-100">
                    <button
                        onClick={onCancel}
                        className="w-full py-2 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                        Cancel & Continue with AI
                    </button>
                </div>
            )}
        </div>
    );
};

export default EscalationCard;
