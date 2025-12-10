import api from './api';

// Types
interface CreateReviewData {
  productId: number;
  rating: number;
  comment: string;
}

interface UpdateReviewData {
  rating?: number;
  comment?: string;
}

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

interface ReviewsResponse {
  success: boolean;
  message: string;
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

// API functions
export const createReview = async (data: CreateReviewData): Promise<Review> => {
  const response = await api.post('/reviews', data);
  return response.data.data;
};

export const getAllReviews = async (params?: {
  productId?: number;
  userId?: number;
  rating?: number;
  sort?: 'newest' | 'oldest' | 'highest' | 'lowest';
  page?: number;
  limit?: number;
}): Promise<ReviewsResponse> => {
  const response = await api.get('/reviews', { params });
  return response.data;
};

export const getReviewById = async (id: number): Promise<Review> => {
  const response = await api.get(`/reviews/${id}`);
  return response.data.data;
};

export const getReviewsByProduct = async (
  productId: number,
  params?: {
    sort?: 'newest' | 'oldest' | 'highest' | 'lowest';
    page?: number;
    limit?: number;
  }
): Promise<ReviewsResponse> => {
  const response = await api.get(`/reviews/product/${productId}`, { params });
  return response.data;
};

export const getMyReviews = async (params?: {
  sort?: 'newest' | 'oldest' | 'highest' | 'lowest';
  page?: number;
  limit?: number;
}): Promise<ReviewsResponse> => {
  const response = await api.get('/reviews/my', { params });
  return response.data;
};

export const updateReview = async (
  id: number,
  data: UpdateReviewData
): Promise<Review> => {
  const response = await api.put(`/reviews/${id}`, data);
  return response.data.data;
};

export const deleteReview = async (id: number): Promise<void> => {
  await api.delete(`/reviews/${id}`);
};
