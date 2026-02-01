// frontend/src/components/chatbot/SatisfactionSurvey.tsx
// Customer satisfaction rating component for chatbot

import React, { useState } from 'react';
import { Star, Send, X } from 'lucide-react';
import customerServiceService from '../../services/customerServiceService';

interface SatisfactionSurveyProps {
    sessionId: string;
    onComplete: (rating: number) => void;
    onDismiss: () => void;
}

const SatisfactionSurvey: React.FC<SatisfactionSurveyProps> = ({
    sessionId,
    onComplete,
    onDismiss
}) => {
    const [rating, setRating] = useState<number>(0);
    const [hoveredRating, setHoveredRating] = useState<number>(0);
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [responseMessage, setResponseMessage] = useState('');

    const handleSubmit = async () => {
        if (rating === 0) return;

        setIsSubmitting(true);
        try {
            const message = await customerServiceService.submitFeedback(
                sessionId,
                rating,
                comment || undefined
            );
            setResponseMessage(message);
            setSubmitted(true);
            onComplete(rating);

            // Auto dismiss after 3 seconds
            setTimeout(() => {
                onDismiss();
            }, 3000);
        } catch (error) {
            console.error('Failed to submit feedback:', error);
            setResponseMessage('Thank you for your feedback!');
            setSubmitted(true);
        } finally {
            setIsSubmitting(false);
        }
    };

    const ratingLabels = ['Poor', 'Fair', 'Good', 'Great', 'Excellent'];
    const ratingEmojis = ['😞', '😐', '🙂', '😊', '🤩'];

    if (submitted) {
        return (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200 animate-in fade-in zoom-in duration-300">
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-xl">{ratingEmojis[rating - 1]}</span>
                    </div>
                    <div>
                        <h4 className="font-semibold text-green-800">Thank You!</h4>
                        <p className="text-sm text-green-600">{responseMessage}</p>
                    </div>
                </div>
                <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                            key={star}
                            size={20}
                            className={star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
                        />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-5 border border-blue-200 animate-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-start justify-between mb-4">
                <div>
                    <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                        📊 Quick Feedback
                    </h4>
                    <p className="text-sm text-gray-500 mt-1">
                        How was your experience today?
                    </p>
                </div>
                <button
                    onClick={onDismiss}
                    aria-label="Dismiss feedback survey"
                    className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-white/50 transition-colors"
                >
                    <X size={18} />
                </button>
            </div>

            {/* Star Rating */}
            <div className="flex items-center justify-center gap-2 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoveredRating(star)}
                        onMouseLeave={() => setHoveredRating(0)}
                        className="group relative p-1 transition-transform hover:scale-110"
                    >
                        <Star
                            size={32}
                            className={`transition-colors ${star <= (hoveredRating || rating)
                                ? 'text-yellow-400 fill-yellow-400'
                                : 'text-gray-300 group-hover:text-yellow-200'
                                }`}
                        />
                        {/* Tooltip */}
                        <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            {ratingLabels[star - 1]}
                        </span>
                    </button>
                ))}
            </div>

            {/* Selected Rating Display */}
            {rating > 0 && (
                <div className="text-center mb-4 animate-in fade-in duration-200">
                    <span className="text-2xl">{ratingEmojis[rating - 1]}</span>
                    <span className="ml-2 font-medium text-gray-700">{ratingLabels[rating - 1]}</span>
                </div>
            )}

            {/* Optional Comment */}
            {rating > 0 && rating < 4 && (
                <div className="mb-4 animate-in slide-in-from-top-2 duration-200">
                    <textarea
                        placeholder="Tell us how we can improve... (optional)"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                        rows={2}
                    />
                </div>
            )}

            {/* Submit Button */}
            <button
                onClick={handleSubmit}
                disabled={rating === 0 || isSubmitting}
                className={`w-full py-2.5 rounded-xl flex items-center justify-center gap-2 font-medium transition-all ${rating === 0
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-primary text-white hover:bg-primary-dark'
                    }`}
            >
                {isSubmitting ? (
                    <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Submitting...
                    </>
                ) : (
                    <>
                        <Send size={16} />
                        Submit Feedback
                    </>
                )}
            </button>
        </div>
    );
};

export default SatisfactionSurvey;
