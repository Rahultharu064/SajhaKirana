import React, { useState, useEffect } from 'react';
import StarRating from '../../ui/StarRating';
import { createReview, updateReview } from '@/services/reviewService';

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

interface ReviewFormProps {
  productId: number;
  editingReview?: Review | null;
  onReviewSubmit?: () => void;
  onReviewCancel?: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ productId, editingReview, onReviewSubmit, onReviewCancel }) => {
  const [rating, setRating] = useState(editingReview?.rating || 5);
  const [comment, setComment] = useState(editingReview?.comment || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingReview) {
      setRating(editingReview.rating);
      setComment(editingReview.comment);
    } else {
      setRating(5);
      setComment('');
    }
  }, [editingReview]);

  const isEditing = !!editingReview;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!comment.trim()) {
      setError('Please provide a comment for your review.');
      return;
    }

    if (comment.trim().length < 10) {
      setError('Review comment must be at least 10 characters long.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      if (isEditing && editingReview) {
        await updateReview(editingReview.id, {
          rating,
          comment: comment.trim(),
        });
      } else {
        await createReview({
          productId,
          rating,
          comment: comment.trim(),
        });
      }

      setRating(5);
      setComment('');
      if (onReviewSubmit) {
        onReviewSubmit();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4">{isEditing ? 'Edit Your Review' : 'Write a Review'}</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-2">
            Rating
          </label>
          <StarRating
            rating={rating}
            onRatingChange={setRating}
            className="mb-1"
          />
          <p className="text-xs text-gray-500">Select a rating from 0 to 5 stars</p>
        </div>

        <div>
          <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
            Your Review
          </label>
          <textarea
            id="comment"
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Share your experience with this product..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            disabled={isSubmitting}
          />
          <p className="text-xs text-gray-500 mt-1">
            Minimum 10 characters (current: {comment.length})
          </p>
        </div>

        {error && (
          <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">
            {error}
          </div>
        )}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isSubmitting || comment.trim().length < 10}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Submitting...' : isEditing ? 'Update Review' : 'Submit Review'}
          </button>
          {isEditing && (
            <button
              type="button"
              onClick={() => {
                if (onReviewCancel) {
                  onReviewCancel();
                } else {
                  setRating(5);
                  setComment('');
                }
              }}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ReviewForm;
