// frontend/src/components/AdminDashboard/Sections/CustomerService.tsx
// Customer Service Dashboard for Admins

import React, { useState, useEffect } from 'react';
import {
    Headphones,
    MessageSquare,
    Clock,
    CheckCircle2,
    AlertCircle,
    TrendingUp,
    Star,
    Filter,
    User
} from 'lucide-react';
import customerServiceService from '../../../services/customerServiceService';
import type { SupportTicket } from '../../../services/customerServiceService';

interface Statistics {
    totalConversations: number;
    escalationRate: number;
    avgRating: number;
    pendingTickets: number;
    ticketsToday: number;
    resolvedToday: number;
    resolutionRate: number;
    sentimentBreakdown: {
        positive: number;
        neutral: number;
        negative: number;
        angry: number;
    };
}

const CustomerService: React.FC = () => {
    const [tickets, setTickets] = useState<SupportTicket[]>([]);
    const [statistics, setStatistics] = useState<Statistics | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
    const [filter, setFilter] = useState<{ status?: string; priority?: string }>({});
    const [resolution, setResolution] = useState('');

    useEffect(() => {
        loadData();
    }, [filter]);

    const loadData = async () => {
        try {
            setLoading(true);
            const [ticketsData, statsData] = await Promise.all([
                customerServiceService.getTickets(filter),
                customerServiceService.getStatistics()
            ]);
            setTickets(ticketsData);
            setStatistics(statsData);
        } catch (error) {
            console.error('Failed to load customer service data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateTicket = async (
        ticketId: number,
        data: { status?: string; resolution?: string }
    ) => {
        try {
            const updated = await customerServiceService.updateTicket(ticketId, data);
            setTickets(prev => prev.map(t => t.id === ticketId ? updated : t));
            if (selectedTicket?.id === ticketId) {
                setSelectedTicket(updated);
            }
            setResolution('');
        } catch (error) {
            console.error('Failed to update ticket:', error);
        }
    };

    const priorityColors = {
        urgent: 'bg-red-100 text-red-700 border-red-200',
        high: 'bg-orange-100 text-orange-700 border-orange-200',
        medium: 'bg-blue-100 text-blue-700 border-blue-200',
        low: 'bg-gray-100 text-gray-700 border-gray-200'
    };

    const sentimentEmojis = {
        positive: '😊',
        neutral: '😐',
        negative: '😞',
        angry: '😠'
    };

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                        <Headphones className="text-primary" size={28} />
                        Customer Service Dashboard
                    </h1>
                    <p className="text-gray-500 mt-1">Manage support tickets and monitor customer satisfaction</p>
                </div>
                <button
                    onClick={loadData}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                >
                    Refresh
                </button>
            </div>

            {/* Statistics Cards */}
            {statistics && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Pending Tickets */}
                    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                            <div className="p-2.5 bg-red-50 rounded-xl">
                                <AlertCircle className="text-red-500" size={22} />
                            </div>
                            <span className="text-2xl font-bold text-gray-800">
                                {statistics.pendingTickets}
                            </span>
                        </div>
                        <h3 className="font-medium text-gray-600">Pending Tickets</h3>
                        <p className="text-xs text-gray-400 mt-1">
                            {statistics.ticketsToday} new today
                        </p>
                    </div>

                    {/* Resolution Rate */}
                    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                            <div className="p-2.5 bg-green-50 rounded-xl">
                                <CheckCircle2 className="text-green-500" size={22} />
                            </div>
                            <span className="text-2xl font-bold text-gray-800">
                                {statistics.resolutionRate}%
                            </span>
                        </div>
                        <h3 className="font-medium text-gray-600">Resolution Rate</h3>
                        <p className="text-xs text-gray-400 mt-1">
                            {statistics.resolvedToday} resolved today
                        </p>
                    </div>

                    {/* Average Rating */}
                    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                            <div className="p-2.5 bg-yellow-50 rounded-xl">
                                <Star className="text-yellow-500" size={22} />
                            </div>
                            <span className="text-2xl font-bold text-gray-800">
                                {statistics.avgRating.toFixed(1)}
                            </span>
                        </div>
                        <h3 className="font-medium text-gray-600">Avg. Rating</h3>
                        <div className="flex gap-0.5 mt-1">
                            {[1, 2, 3, 4, 5].map(star => (
                                <Star
                                    key={star}
                                    size={12}
                                    className={star <= Math.round(statistics.avgRating)
                                        ? 'text-yellow-400 fill-yellow-400'
                                        : 'text-gray-300'
                                    }
                                />
                            ))}
                        </div>
                    </div>

                    {/* Escalation Rate */}
                    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                            <div className="p-2.5 bg-purple-50 rounded-xl">
                                <TrendingUp className="text-purple-500" size={22} />
                            </div>
                            <span className="text-2xl font-bold text-gray-800">
                                {statistics.escalationRate.toFixed(1)}%
                            </span>
                        </div>
                        <h3 className="font-medium text-gray-600">Escalation Rate</h3>
                        <p className="text-xs text-gray-400 mt-1">
                            {statistics.totalConversations} total conversations
                        </p>
                    </div>
                </div>
            )}

            {/* Sentiment Overview */}
            {statistics && (
                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                    <h3 className="font-semibold text-gray-800 mb-4">Customer Sentiment</h3>
                    <div className="flex gap-6">
                        {Object.entries(statistics.sentimentBreakdown).map(([sentiment, count]) => (
                            <div key={sentiment} className="flex items-center gap-2">
                                <span className="text-2xl">
                                    {sentimentEmojis[sentiment as keyof typeof sentimentEmojis]}
                                </span>
                                <div>
                                    <p className="font-bold text-gray-800">{count}</p>
                                    <p className="text-xs text-gray-500 capitalize">{sentiment}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Tickets Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Tickets List */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    {/* Filters */}
                    <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3">
                        <Filter size={18} className="text-gray-400" />
                        <select
                            value={filter.status || ''}
                            onChange={(e) => setFilter(prev => ({ ...prev, status: e.target.value || undefined }))}
                            aria-label="Filter by status"
                            className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
                        >
                            <option value="">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="assigned">Assigned</option>
                            <option value="resolved">Resolved</option>
                        </select>
                        <select
                            value={filter.priority || ''}
                            onChange={(e) => setFilter(prev => ({ ...prev, priority: e.target.value || undefined }))}
                            aria-label="Filter by priority"
                            className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
                        >
                            <option value="">All Priority</option>
                            <option value="urgent">Urgent</option>
                            <option value="high">High</option>
                            <option value="medium">Medium</option>
                            <option value="low">Low</option>
                        </select>
                    </div>

                    {/* List */}
                    <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
                        {loading ? (
                            <div className="p-8 text-center text-gray-500">Loading tickets...</div>
                        ) : tickets.length === 0 ? (
                            <div className="p-8 text-center text-gray-500">
                                <Headphones size={40} className="mx-auto mb-3 text-gray-300" />
                                <p>No tickets found</p>
                            </div>
                        ) : (
                            tickets.map(ticket => (
                                <div
                                    key={ticket.id}
                                    onClick={() => setSelectedTicket(ticket)}
                                    className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${selectedTicket?.id === ticket.id ? 'bg-primary/5' : ''
                                        }`}
                                >
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <span className={`px-2 py-0.5 text-xs font-medium rounded-full border ${priorityColors[ticket.priority as keyof typeof priorityColors]
                                                }`}>
                                                {ticket.priority.toUpperCase()}
                                            </span>
                                            <span className="text-xs text-gray-500">#{ticket.id}</span>
                                        </div>
                                        <span className={`text-xs px-2 py-0.5 rounded-full ${ticket.status === 'resolved'
                                            ? 'bg-green-100 text-green-700'
                                            : ticket.status === 'assigned'
                                                ? 'bg-blue-100 text-blue-700'
                                                : 'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {ticket.status}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-lg">
                                            {sentimentEmojis[ticket.sentiment as keyof typeof sentimentEmojis]}
                                        </span>
                                        <div>
                                            <p className="font-medium text-gray-800 text-sm">
                                                {ticket.user?.name || 'Anonymous'}
                                            </p>
                                            <p className="text-xs text-gray-500">{ticket.reason}</p>
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-400 line-clamp-2">
                                        {ticket.conversationSummary}
                                    </p>
                                    <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                                        <Clock size={12} />
                                        {new Date(ticket.createdAt).toLocaleString()}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Ticket Details */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    {selectedTicket ? (
                        <div className="h-full flex flex-col">
                            <div className="px-5 py-4 border-b border-gray-100 bg-gray-50">
                                <h3 className="font-semibold text-gray-800">Ticket #{selectedTicket.id}</h3>
                            </div>
                            <div className="flex-1 p-5 space-y-4 overflow-y-auto">
                                {/* Customer Info */}
                                <div>
                                    <label className="text-xs text-gray-500 uppercase">Customer</label>
                                    <div className="flex items-center gap-2 mt-1">
                                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                            <User size={16} className="text-primary" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-800">{selectedTicket.user?.name || 'Anonymous'}</p>
                                            <p className="text-xs text-gray-500">{selectedTicket.user?.email}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Summary */}
                                <div>
                                    <label className="text-xs text-gray-500 uppercase">Summary</label>
                                    <p className="mt-1 text-sm text-gray-700 bg-gray-50 rounded-lg p-3">
                                        {selectedTicket.conversationSummary}
                                    </p>
                                </div>

                                {/* Reason */}
                                <div>
                                    <label className="text-xs text-gray-500 uppercase">Reason</label>
                                    <p className="mt-1 text-sm text-gray-700">{selectedTicket.reason}</p>
                                </div>

                                {/* Sentiment */}
                                <div>
                                    <label className="text-xs text-gray-500 uppercase">Sentiment</label>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-2xl">
                                            {sentimentEmojis[selectedTicket.sentiment as keyof typeof sentimentEmojis]}
                                        </span>
                                        <span className="text-sm text-gray-700 capitalize">{selectedTicket.sentiment}</span>
                                    </div>
                                </div>

                                {/* Resolution */}
                                {selectedTicket.status !== 'resolved' && (
                                    <div>
                                        <label className="text-xs text-gray-500 uppercase">Add Resolution</label>
                                        <textarea
                                            value={resolution}
                                            onChange={(e) => setResolution(e.target.value)}
                                            placeholder="Enter resolution notes..."
                                            className="w-full mt-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                                            rows={3}
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Actions */}
                            {selectedTicket.status !== 'resolved' && (
                                <div className="px-5 py-4 border-t border-gray-100 space-y-2">
                                    <button
                                        onClick={() => handleUpdateTicket(selectedTicket.id, {
                                            status: 'resolved',
                                            resolution: resolution || 'Resolved by agent'
                                        })}
                                        className="w-full py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <CheckCircle2 size={18} />
                                        Mark as Resolved
                                    </button>
                                    {selectedTicket.status === 'pending' && (
                                        <button
                                            onClick={() => handleUpdateTicket(selectedTicket.id, { status: 'assigned' })}
                                            className="w-full py-2 border border-primary text-primary rounded-lg hover:bg-primary/5 transition-colors"
                                        >
                                            Assign to Me
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="h-full flex items-center justify-center text-gray-400">
                            <div className="text-center">
                                <MessageSquare size={40} className="mx-auto mb-3" />
                                <p>Select a ticket to view details</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CustomerService;
