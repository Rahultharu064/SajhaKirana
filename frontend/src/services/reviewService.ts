import api from './api';

export interface Review {
    id: number;
    productId: number;
    userId: number;
    rating: number;
    comment: string;
    approvalStatus: string;
    createdAt: string;
    updatedAt: string;
    user: {
        id: number;
        name: string;
        email: string;
        profileImage?: string;
    };
    product?: {
        id: number;
        title: string;
        slug: string;
        images?: string[];
    };
    media?: ReviewMedia[];
}

export interface ReviewMedia {
    id: number;
    mediaType: 'image' | 'video';
    mediaUrl: string;
    fileSize: number;
    mimeType: string;
}

export interface ReviewsResponse {
    data: Review[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        pages: number;
    };
    stats?: {
        total: number;
        averageRating: number;
        ratingDistribution: Record<number, number>;
    };
}

export interface CreateReviewData {
    productId: number;
    rating: number;
    comment: string;
    media?: File[];
}

export interface UpdateReviewData {
    rating?: number;
    comment?: string;
}

// Create a new review
export const createReview = async (data: CreateReviewData): Promise<Review> => {
    const formData = new FormData();
    formData.append('productId', data.productId.toString());
    formData.append('rating', data.rating.toString());
    formData.append('comment', data.comment);

    if (data.media && data.media.length > 0) {
        data.media.forEach((file) => {
            formData.append('media', file);
        });
    }

    const response = await api.post('/reviews', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });

    return response.data.data;
};

// Get reviews for a product
export const getReviewsByProduct = async (
    productId: number,
    params?: {
        page?: number;
        limit?: number;
        sort?: 'newest' | 'oldest' | 'highest' | 'lowest';
        rating?: number;
    }
): Promise<ReviewsResponse> => {
    const response = await api.get(`/reviews/product/${productId}`, { params });
    return response.data;
};

// Get user's own reviews
export const getMyReviews = async (params?: {
    page?: number;
    limit?: number;
    sort?: 'newest' | 'oldest' | 'highest' | 'lowest';
}): Promise<ReviewsResponse> => {
    const response = await api.get('/reviews/my', { params });
    return response.data;
};

// Update a review
export const updateReview = async (
    reviewId: number,
    data: UpdateReviewData
): Promise<Review> => {
    const response = await api.put(`/reviews/${reviewId}`, data);
    return response.data.data;
};

// Delete a review
export const deleteReview = async (reviewId: number): Promise<void> => {
    await api.delete(`/reviews/${reviewId}`);
};
