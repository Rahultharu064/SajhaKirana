import React, { useState, useEffect } from 'react';
import { Star, X, Upload } from 'lucide-react';
import { createReview, updateReview } from '../../../services/reviewService';
import Button from '../../ui/Button';
import toast from 'react-hot-toast';

interface ReviewFormProps {
    productId: number;
    editingReview?: any;
    onReviewSubmit: () => void;
    onReviewCancel?: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({
    productId,
    editingReview,
    onReviewSubmit,
    onReviewCancel
}) => {
    const [rating, setRating] = useState(editingReview?.rating || 0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState(editingReview?.comment || '');
    const [mediaFiles, setMediaFiles] = useState<File[]>([]);
    const [mediaPreviews, setMediaPreviews] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (editingReview) {
            setRating(editingReview.rating);
            setComment(editingReview.comment);
        }
    }, [editingReview]);

    const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);

        if (files.length + mediaFiles.length > 5) {
            toast.error('You can upload a maximum of 5 media files');
            return;
        }

        const newPreviews: string[] = [];
        files.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                newPreviews.push(reader.result as string);
                if (newPreviews.length === files.length) {
                    setMediaPreviews([...mediaPreviews, ...newPreviews]);
                }
            };
            reader.readAsDataURL(file);
        });

        setMediaFiles([...mediaFiles, ...files]);
    };

    const removeMedia = (index: number) => {
        setMediaFiles(mediaFiles.filter((_, i) => i !== index));
        setMediaPreviews(mediaPreviews.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (rating === 0) {
            toast.error('Please select a rating');
            return;
        }

        if (comment.trim().length < 10) {
            toast.error('Review comment must be at least 10 characters');
            return;
        }

        setIsSubmitting(true);

        try {
            if (editingReview) {
                // Update existing review
                await updateReview(editingReview.id, {
                    rating,
                    comment
                });
                toast.success('Review updated successfully! It will be visible after admin approval.');
            } else {
                // Create new review
                await createReview({
                    productId,
                    rating,
                    comment,
                    media: mediaFiles
                });
                toast.success('Review submitted successfully! It will be visible after admin approval.');
            }

            // Reset form
            setRating(0);
            setComment('');
            setMediaFiles([]);
            setMediaPreviews([]);

            onReviewSubmit();
        } catch (error: any) {
            console.error('Review submission error:', error);
            toast.error(error.response?.data?.message || 'Failed to submit review');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <h4 className="text-lg font-bold mb-4">
                {editingReview ? 'Edit Your Review' : 'Write a Review'}
            </h4>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Rating */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Your Rating *
                    </label>
                    <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                onClick={() => setRating(star)}
                                onMouseEnter={() => setHoverRating(star)}
                                onMouseLeave={() => setHoverRating(0)}
                                className="transition-transform hover:scale-110"
                            >
                                <Star
                                    className={`h-8 w-8 ${star <= (hoverRating || rating)
                                            ? 'fill-yellow-400 text-yellow-400'
                                            : 'text-gray-300'
                                        }`}
                                />
                            </button>
                        ))}
                        {rating > 0 && (
                            <span className="ml-2 text-sm text-gray-600">
                                {rating} star{rating !== 1 ? 's' : ''}
                            </span>
                        )}
                    </div>
                </div>

                {/* Comment */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Your Review *
                    </label>
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        rows={5}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Share your experience with this product..."
                        required
                        minLength={10}
                        maxLength={1000}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        {comment.length}/1000 characters (minimum 10)
                    </p>
                </div>

                {/* Media Upload (only for new reviews) */}
                {!editingReview && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Add Photos or Videos (Optional)
                        </label>
                        <div className="flex items-center gap-4">
                            <label className="cursor-pointer">
                                <div className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-xl hover:border-primary-500 transition-colors">
                                    <Upload className="h-5 w-5 text-gray-400" />
                                    <span className="text-sm text-gray-600">Upload Media</span>
                                </div>
                                <input
                                    type="file"
                                    accept="image/*,video/*"
                                    multiple
                                    onChange={handleMediaChange}
                                    className="hidden"
                                    disabled={mediaFiles.length >= 5}
                                />
                            </label>
                            <span className="text-xs text-gray-500">
                                Max 5 files (images or videos)
                            </span>
                        </div>

                        {/* Media Previews */}
                        {mediaPreviews.length > 0 && (
                            <div className="grid grid-cols-5 gap-2 mt-4">
                                {mediaPreviews.map((preview, index) => (
                                    <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200">
                                        {mediaFiles[index].type.startsWith('video/') ? (
                                            <video src={preview} className="w-full h-full object-cover" />
                                        ) : (
                                            <img src={preview} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => removeMedia(index)}
                                            className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t border-gray-100">
                    <Button
                        type="submit"
                        variant="primary"
                        className="flex-1"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Submitting...' : editingReview ? 'Update Review' : 'Submit Review'}
                    </Button>
                    {onReviewCancel && (
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onReviewCancel}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default ReviewForm;
