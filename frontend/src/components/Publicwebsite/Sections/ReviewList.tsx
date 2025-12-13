import React, { useState, useEffect } from 'react';
import { Star, Edit, Trash2, Video } from 'lucide-react';
import { getReviewsByProduct, deleteReview } from '../../../services/reviewService';
import type { Review } from '../../../services/reviewService';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';

interface ReviewListProps {
    productId: number;
    onReviewEdit: (review: Review) => void;
    onReviewDeleted: () => void;
    refreshTrigger?: number;
}

const ReviewList: React.FC<ReviewListProps> = ({
    productId,
    onReviewEdit,
    onReviewDeleted,
    refreshTrigger
}) => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const { user, isAuthenticated } = useSelector((state: any) => state.auth);

    // Debug: Log user state on every render
    console.log('ReviewList user state:', { user, isAuthenticated });

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5003';

    useEffect(() => {
        fetchReviews();
    }, [productId, page, refreshTrigger]);

    const fetchReviews = async () => {
        try {
            setLoading(true);
            const response = await getReviewsByProduct(productId, {
                page,
                limit: 10,
                sort: 'newest'
            });
            setReviews(response.data);
            setTotalPages(response.pagination.pages);
        } catch (error) {
            console.error('Failed to fetch reviews:', error);
            toast.error('Failed to load reviews');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (reviewId: number) => {
        if (!window.confirm('Are you sure you want to delete this review?')) {
            return;
        }

        try {
            await deleteReview(reviewId);
            toast.success('Review deleted successfully');
            fetchReviews();
            onReviewDeleted();
        } catch (error: any) {
            console.error('Failed to delete review:', error);
            toast.error(error.response?.data?.message || 'Failed to delete review');
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse bg-gray-100 rounded-2xl p-6 h-32" />
                ))}
            </div>
        );
    }

    if (reviews.length === 0) {
        return (
            <div className="text-center py-12 bg-gray-50 rounded-2xl">
                <Star className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Reviews Yet</h3>
                <p className="text-gray-600">Be the first to review this product!</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {reviews.map((review) => (
                <div
                    key={review.id}
                    className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-md transition-shadow"
                >
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold text-lg">
                                {review.user.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-900">{review.user.name}</h4>
                                <div className="flex items-center gap-2 mt-1">
                                    <div className="flex items-center">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star
                                                key={star}
                                                className={`h-4 w-4 ${star <= review.rating
                                                        ? 'fill-yellow-400 text-yellow-400'
                                                        : 'text-gray-300'
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                    <span className="text-sm text-gray-500">•</span>
                                    <span className="text-sm text-gray-500">{formatDate(review.createdAt)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Edit/Delete buttons for own reviews */}
                        {(() => {
                            const showButtons = isAuthenticated && user?.id === review.user.id;
                            console.log('Review buttons check:', {
                                isAuthenticated,
                                userId: user?.id,
                                reviewUserId: review.user.id,
                                reviewId: review.id,
                                showButtons
                            });
                            return showButtons ? (
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => onReviewEdit(review)}
                                        className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                                        title="Edit review"
                                    >
                                        <Edit className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(review.id)}
                                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Delete review"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            ) : null;
                        })()}
                    </div>

                    <p className="text-gray-700 leading-relaxed mb-4">{review.comment}</p>

                    {/* Media Gallery */}
                    {review.media && review.media.length > 0 && (
                        <div className="grid grid-cols-4 gap-2 mt-4">
                            {review.media.map((media) => (
                                <div
                                    key={media.id}
                                    className="aspect-square rounded-lg overflow-hidden bg-gray-100 border border-gray-200 relative"
                                >
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
                                </div>
                            ))}
                        </div>
                    )}


                </div>
            ))}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-6">
                    <button
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Previous
                    </button>
                    <span className="text-sm text-gray-600">
                        Page {page} of {totalPages}
                    </span>
                    <button
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default ReviewList;
