import api from "./api";

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  profileImage: string | null;
  createdAt: string;
  updatedAt: string;
  _count?: {
    orders: number;
    carts: number;
  };
}

export interface UserListResponse {
  success: boolean;
  message: string;
  data: User[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface UserResponse {
  success: boolean;
  message: string;
  data: User;
}

// Get all users with pagination and filtering
export const getAllUsers = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
}): Promise<UserListResponse> => {
  const queryParams = new URLSearchParams();

  if (params?.page) queryParams.set('page', params.page.toString());
  if (params?.limit) queryParams.set('limit', params.limit.toString());
  if (params?.search) queryParams.set('search', params.search);
  if (params?.role) queryParams.set('role', params.role);

  const response = await api.get(`/users?${queryParams.toString()}`);
  return response.data;
};

// Get user by ID
export const getUserById = async (id: number): Promise<UserResponse> => {
  const response = await api.get(`/users/${id}`);
  return response.data;
};

// Update user
export const updateUser = async (
  id: number,
  data: { name?: string; phone?: string; role?: string }
) => {
  const response = await api.put(`/users/${id}`, data);
  return response.data;
};

// Delete user
export const deleteUser = async (id: number) => {
  const response = await api.delete(`/users/${id}`);
  return response.data;
};
