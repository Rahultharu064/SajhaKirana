import React, { useState, useEffect } from 'react';
import {
    getPendingReviews,
    approveReview,
    rejectReview,
    bulkApproveReviews,
    bulkRejectReviews
} from '@/services/reviewAdminService';
import { CheckCircle, XCircle, Image as ImageIcon, Video, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface ReviewMedia {
    id: number;
    mediaType: 'image' | 'video';
    mediaUrl: string;
    fileSize: number;
    mimeType: string;
}

interface PendingReview {
    id: number;
    productId: number;
    userId: number;
    rating: number;
    comment: string;
    hasMedia: boolean;
    approvalStatus: string;
    createdAt: string;
    user: {
        id: number;
        name: string;
        email: string;
        profileImage?: string;
    };
    product: {
        id: number;
        title: string;
        slug: string;
        images: string[];
    };
    media: ReviewMedia[];
}

const ReviewModeration: React.FC = () => {
    const [pendingReviews, setPendingReviews] = useState<PendingReview[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectingId, setRejectingId] = useState<number | null>(null);
    const [rejectionReason, setRejectionReason] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5003';

    useEffect(() => {
        fetchPendingReviews();
    }, [page]);

    const fetchPendingReviews = async () => {
        try {
            setLoading(true);
            const response = await getPendingReviews({ page, limit: 10 });
            setPendingReviews(response.data);
            setTotalPages(response.pagination.pages);
        } catch (error: any) {
            toast.error('Failed to load pending reviews');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (reviewId: number) => {
        try {
            await approveReview(reviewId);
            toast.success('Review approved successfully');
            fetchPendingReviews();
            setSelectedIds(selectedIds.filter(id => id !== reviewId));
        } catch (error: any) {
            toast.error(error.message || 'Failed to approve review');
        }
    };

    const handleReject = async (reviewId: number, reason?: string) => {
        try {
            await rejectReview(reviewId, reason);
            toast.success('Review rejected successfully');
            fetchPendingReviews();
            setSelectedIds(selectedIds.filter(id => id !== reviewId));
            setShowRejectModal(false);
            setRejectingId(null);
            setRejectionReason('');
        } catch (error: any) {
            toast.error(error.message || 'Failed to reject review');
        }
    };

    const handleBulkApprove = async () => {
        if (selectedIds.length === 0) {
            toast.error('Please select reviews to approve');
            return;
        }

        try {
            await bulkApproveReviews(selectedIds);
            toast.success(`${selectedIds.length} reviews approved successfully`);
            fetchPendingReviews();
            setSelectedIds([]);
        } catch (error: any) {
            toast.error(error.message || 'Failed to approve reviews');
        }
    };

    const handleBulkReject = async () => {
        if (selectedIds.length === 0) {
            toast.error('Please select reviews to reject');
            return;
        }

        setRejectingId(-1); // Bulk reject indicator
        setShowRejectModal(true);
    };

    const confirmBulkReject = async () => {
        try {
            await bulkRejectReviews(selectedIds, rejectionReason);
            toast.success(`${selectedIds.length} reviews rejected successfully`);
            fetchPendingReviews();
            setSelectedIds([]);
            setShowRejectModal(false);
            setRejectingId(null);
            setRejectionReason('');
        } catch (error: any) {
            toast.error(error.message || 'Failed to reject reviews');
        }
    };

    const toggleSelect = (reviewId: number) => {
        if (selectedIds.includes(reviewId)) {
            setSelectedIds(selectedIds.filter(id => id !== reviewId));
        } else {
            setSelectedIds([...selectedIds, reviewId]);
        }
    };

    const toggleSelectAll = () => {
        if (selectedIds.length === pendingReviews.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(pendingReviews.map(r => r.id));
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="p-6">
                <h2 className="text-2xl font-bold mb-6">Review Moderation</h2>
                <div className="animate-pulse space-y-4">
                    <div className="h-32 bg-gray-200 rounded"></div>
                    <div className="h-32 bg-gray-200 rounded"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Review Moderation</h2>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">
                        {pendingReviews.length} pending review{pendingReviews.length !== 1 ? 's' : ''}
                    </span>
                </div>
            </div>

            {/* Bulk Actions */}
            {selectedIds.length > 0 && (
                <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
                    <span className="text-sm font-medium text-blue-900">
                        {selectedIds.length} review{selectedIds.length !== 1 ? 's' : ''} selected
                    </span>
                    <div className="flex gap-2">
                        <button
                            onClick={handleBulkApprove}
                            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm font-medium"
                        >
                            Approve Selected
                        </button>
                        <button
                            onClick={handleBulkReject}
                            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm font-medium"
                        >
                            Reject Selected
                        </button>
                    </div>
                </div>
            )}

            {pendingReviews.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">All Caught Up!</h3>
                    <p className="text-gray-600">No pending reviews to moderate at the moment.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {/* Select All */}
                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                        <label htmlFor="selectAll">Select All</label>
                        <input
                            id="selectAll"
                            type="checkbox"
                            checked={selectedIds.length === pendingReviews.length}
                            onChange={toggleSelectAll}
                            className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        />
                        <span className="text-sm font-medium text-gray-700">Select All</span>
                    </div>

                    {/* Review Cards */}
                    {pendingReviews.map((review) => (
                        <div key={review.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                            <div className="flex items-start gap-4">
                                {/* Checkbox */}
                                <label htmlFor={`review-${review.id}`}>Select</label>
                                <input
                                    id={`review-${review.id}`}
                                    type="checkbox"
                                    checked={selectedIds.includes(review.id)}
                                    onChange={() => toggleSelect(review.id)}
                                    className="mt-1 h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                />

                                {/* Content */}
                                <div className="flex-1">
                                    {/* Header */}
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <h3 className="font-semibold text-gray-900">{review.product.title}</h3>
                                            <p className="text-sm text-gray-600">
                                                by {review.user.name} ({review.user.email})
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1">{formatDate(review.createdAt)}</p>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            {[...Array(5)].map((_, i) => (
                                                <span key={i} className={i < review.rating ? 'text-yellow-400' : 'text-gray-300'}>
                                                    ★
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Comment */}
                                    <p className="text-gray-700 mb-4">{review.comment}</p>

                                    {/* Media Preview */}
                                    {review.media && review.media.length > 0 && (
                                        <div className="mb-4">
                                            <p className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                                <AlertCircle className="h-4 w-4" />
                                                Media Attachments ({review.media.length})
                                            </p>
                                            <div className="grid grid-cols-4 gap-2">
                                                {review.media.map((media) => (
                                                    <div key={media.id} className="aspect-square rounded-lg overflow-hidden bg-gray-100 border border-gray-200 relative">
                                                        {media.mediaType === 'video' ? (
                                                            <>
                                                                <video
                                                                    src={`${API_BASE_URL}/uploads/reviews/${media.mediaUrl}`}
                                                                    className="w-full h-full object-cover"
                                                                />
                                                                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                                                                    <Video className="h-8 w-8 text-white" />
                                                                </div>
                                                            </>
                                                        ) : (
                                                            <img
                                                                src={`${API_BASE_URL}/uploads/reviews/${media.mediaUrl}`}
                                                                alt="Review media"
                                                                className="w-full h-full object-cover"
                                                            />
                                                        )}
                                                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white text-xs p-1 flex items-center justify-center gap-1">
                                                            {media.mediaType === 'video' ? <Video className="h-3 w-3" /> : <ImageIcon className="h-3 w-3" />}
                                                            {(media.fileSize / 1024 / 1024).toFixed(1)}MB
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Actions */}
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleApprove(review.id)}
                                            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm font-medium"
                                        >
                                            <CheckCircle className="h-4 w-4" />
                                            Approve
                                        </button>
                                        <button
                                            onClick={() => {
                                                setRejectingId(review.id);
                                                setShowRejectModal(true);
                                            }}
                                            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm font-medium"
                                        >
                                            <XCircle className="h-4 w-4" />
                                            Reject
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="mt-6 flex items-center justify-center gap-2">
                    <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Previous
                    </button>
                    <span className="text-sm text-gray-600">
                        Page {page} of {totalPages}
                    </span>
                    <button
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Next
                    </button>
                </div>
            )}

            {/* Reject Modal */}
            {showRejectModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg max-w-md w-full p-6">
                        <h3 className="text-lg font-semibold mb-4">
                            {rejectingId === -1 ? 'Reject Selected Reviews' : 'Reject Review'}
                        </h3>
                        <p className="text-sm text-gray-600 mb-4">
                            Please provide a reason for rejection (optional):
                        </p>
                        <textarea
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 mb-4"
                            rows={3}
                            placeholder="e.g., Inappropriate content, Low quality media, etc."
                        />
                        <div className="flex gap-2 justify-end">
                            <button
                                onClick={() => {
                                    setShowRejectModal(false);
                                    setRejectingId(null);
                                    setRejectionReason('');
                                }}
                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    if (rejectingId === -1) {
                                        confirmBulkReject();
                                    } else if (rejectingId) {
                                        handleReject(rejectingId, rejectionReason);
                                    }
                                }}
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                            >
                                Confirm Rejection
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReviewModeration;
