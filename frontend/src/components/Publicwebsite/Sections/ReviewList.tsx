import React, { useState, useEffect } from 'react';
import StarRating from '../../ui/StarRating';
import { getReviewsByProduct, deleteReview } from '../../../services/reviewService';
import { useSelector } from 'react-redux';
import { Edit, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface Review {
  id: number;
  productId: number;
  userId: number;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: number;
    name: string;
    profileImage?: string;
  };
  product: {
    id: number;
    title: string;
    slug: string;
  };
}

interface ReviewListProps {
  productId: number;
  onReviewEdit?: (review: Review) => void;
  onReviewDeleted?: () => void;
}

const ReviewList: React.FC<ReviewListProps> = ({ productId, onReviewEdit, onReviewDeleted }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<{
    total: number;
    averageRating: number;
    ratingDistribution: Record<number, number>;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useSelector((state: any) => state.auth);

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await getReviewsByProduct(productId, { page: 1, limit: 20 });
      setReviews(response.data);
      setStats(response.stats || null);
    } catch (err: any) {
      setError('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleEditReview = (review: Review) => {
    if (onReviewEdit) {
      onReviewEdit(review);
    }
  };

  const handleDeleteReview = async (reviewId: number) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await deleteReview(reviewId);
        toast.success('Review deleted successfully');
        await fetchReviews(); // Refresh reviews
        if (onReviewDeleted) {
          onReviewDeleted();
        }
      } catch (err: any) {
        toast.error(err.message || 'Failed to delete review');
      }
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Customer Reviews</h3>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Customer Reviews</h3>
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4">Customer Reviews</h3>

      {stats && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center mb-2">
            <StarRating rating={Math.round(stats.averageRating)} readonly />
            <span className="ml-2 text-lg font-semibold">
              {stats.averageRating.toFixed(1)} out of 5
            </span>
          </div>
          <p className="text-sm text-gray-600">
            Based on {stats.total} review{stats.total !== 1 ? 's' : ''}
          </p>
        </div>
      )}

      {reviews.length === 0 ? (
        <p className="text-gray-500 text-center py-8">
          No reviews yet. Be the first to review this product!
        </p>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-300 rounded-full mr-3 flex items-center justify-center">
                    {review.user.profileImage ? (
                      <img
                        src={`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/uploads/profiles/${review.user.profileImage}`}
                        alt={review.user.name}
                        className="w-10 h-10 rounded-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = '';
                          e.currentTarget.style.display = 'none';
                          const parent = e.currentTarget.parentElement;
                          const fallback = parent?.querySelector('.fallback-letter');
                          (fallback as HTMLElement)?.classList.remove('hidden');
                        }}
                      />
                    ) : null}
                    {(!review.user.profileImage || false) && (
                      <span className="text-gray-600 font-medium">
                        {review.user.name.charAt(0).toUpperCase()}
                      </span>
                    )}
                    {review.user.profileImage && (
                      <span className="text-gray-600 font-medium hidden fallback-letter">
                        {review.user.name.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="flex-grow">
                    <p className="font-medium text-gray-900">{review.user.name}</p>
                    <p className="text-sm text-gray-500">{formatDate(review.createdAt)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <StarRating rating={review.rating} readonly />
                    {user && user.userId === review.userId && (
                      <div className="flex items-center gap-1 ml-2">
                        <button
                          onClick={() => handleEditReview(review)}
                          className="p-1 text-gray-400 hover:text-blue-600 rounded transition-colors"
                          title="Edit review"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteReview(review.id)}
                          className="p-1 text-gray-400 hover:text-red-600 rounded transition-colors"
                          title="Delete review"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed">{review.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewList;
