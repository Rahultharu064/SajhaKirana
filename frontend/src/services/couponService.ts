import api from "./api";

export interface Coupon {
  id: number;
  code: string;
  description: string;
  discountType: 'fixed' | 'percentage';
  discountValue: number;
  minOrderValue: number;
  maxDiscount: number | null;
  usageLimit: number;
  usageCount: number;
  expiryDate: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CouponWithDiscount extends Coupon {
  calculatedDiscount: number;
}

export interface CreateCouponData {
  code: string;
  description: string;
  discountType: 'fixed' | 'percentage';
  discountValue: number;
  minOrderValue?: number;
  maxDiscount?: number;
  usageLimit?: number;
  expiryDate: string;
  isActive?: boolean;
}

export interface UpdateCouponData {
  code?: string;
  description?: string;
  discountType?: 'fixed' | 'percentage';
  discountValue?: number;
  minOrderValue?: number;
  maxDiscount?: number;
  usageLimit?: number;
  expiryDate?: string;
  isActive?: boolean;
}

export interface CouponFilters {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedCoupons {
  data: Coupon[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApplyCouponRequest {
  code: string;
  orderValue: number;
}

export interface ApplyCouponResponse {
  coupon: CouponWithDiscount;
  originalValue: number;
  discountAmount: number;
  discountedAmount: number;
}

// Admin endpoints
export const createCoupon = async (data: CreateCouponData): Promise<Coupon> => {
  const response = await api.post('/coupons', data);
  return response.data.data;
};

export const getAllCoupons = async (filters: CouponFilters = {}): Promise<PaginatedCoupons> => {
  const params = new URLSearchParams();

  if (filters.page !== undefined) params.append('page', filters.page.toString());
  if (filters.limit !== undefined) params.append('limit', filters.limit.toString());
  if (filters.search) params.append('search', filters.search);
  if (filters.isActive !== undefined) params.append('isActive', filters.isActive.toString());
  if (filters.sortBy) params.append('sortBy', filters.sortBy);
  if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);

  const response = await api.get(`/coupons?${params.toString()}`);
  return response.data;
};

export const getCouponById = async (id: number): Promise<Coupon> => {
  const response = await api.get(`/coupons/${id}`);
  return response.data.data;
};

export const updateCoupon = async (id: number, data: UpdateCouponData): Promise<Coupon> => {
  const response = await api.put(`/coupons/${id}`, data);
  return response.data.data;
};

export const deleteCoupon = async (id: number): Promise<void> => {
  await api.delete(`/coupons/${id}`);
};

// User endpoints
export const applyCoupon = async (data: ApplyCouponRequest): Promise<ApplyCouponResponse> => {
  const response = await api.post('/coupons/apply', data);
  return response.data.data;
};

export const getValidCoupons = async (orderValue?: number): Promise<Coupon[]> => {
  const params = orderValue ? `?orderValue=${orderValue}` : '';
  const response = await api.get(`/coupons/public/valid${params}`);
  return response.data.data;
};

export const couponService = {
  createCoupon,
  getAllCoupons,
  getCouponById,
  updateCoupon,
  deleteCoupon,
  applyCoupon,
  getValidCoupons,
};

export default couponService;
