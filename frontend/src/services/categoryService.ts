import api from "./api";
import type { Category } from "../types/common";

export type { Category };

export const createCategory = async (data: { name: string; slug: string; image?: File }) => {
  const formData = new FormData();
  formData.append('name', data.name);
  formData.append('slug', data.slug);
  if (data.image) {
    formData.append('image', data.image);
  }
  return api.post('/categories', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const getCategories = async (): Promise<Category[]> => {
  const response = await api.get('/categories');
  return response.data.data;
};

export const updateCategory = async (id: number, data: { name: string; slug: string; image?: File }) => {
  const formData = new FormData();
  formData.append('name', data.name);
  formData.append('slug', data.slug);
  if (data.image) {
    formData.append('image', data.image);
  }
  const response = await api.put(`/categories/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data.data;
};

export const deleteCategory = async (id: number) => {
  const response = await api.delete(`/categories/${id}`);
  return response.data.data;
};
