import api from './api';

export interface PendingReviewsResponse {
    data: any[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        pages: number;
    };
}

// Get pending reviews (admin only)
export const getPendingReviews = async (params?: {
    page?: number;
    limit?: number;
}): Promise<PendingReviewsResponse> => {
    const response = await api.get('/admin/reviews/pending', { params });
    return response.data;
};

// Approve a review (admin only)
export const approveReview = async (reviewId: number): Promise<void> => {
    await api.put(`/admin/reviews/${reviewId}/approve`);
};

// Reject a review (admin only)
export const rejectReview = async (reviewId: number, reason?: string): Promise<void> => {
    await api.put(`/admin/reviews/${reviewId}/reject`, { reason });
};

// Bulk approve reviews (admin only)
export const bulkApproveReviews = async (reviewIds: number[]): Promise<void> => {
    await api.post('/admin/reviews/bulk-approve', { reviewIds });
};

// Bulk reject reviews (admin only)
export const bulkRejectReviews = async (reviewIds: number[], reason?: string): Promise<void> => {
    await api.post('/admin/reviews/bulk-reject', { reviewIds, reason });
};
