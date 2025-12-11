import api from "./api";

// Get all products with filters and pagination
export const getAllProducts = (params?: {
  q?: string;
  category?: number;
  priceMin?: number;
  priceMax?: number;
  sort?: 'newest' | 'oldest' | 'priceLow' | 'priceHigh' | 'popular';
  page?: number;
  limit?: number;
  isActive?: boolean;
}) => {
  return api.get('/products', { params });
}

// Get product by ID
export const getProductById = (productId: number) => {
  return api.get(`/products/${productId}`);
}

// Get product by slug
export const getProductBySlug = (slug: string) => {
  return api.get(`/products/slug/${slug}`);
}

// Create new product
export const createProduct = (data: {
  title: string;
  slug: string;
  description: string;
  price: number;
  mrp: number;
  stock: number;
  categoryId: number;
  sku: string;
  isActive?: boolean;
  images?: File[];
}) => {
  const formData = new FormData();
  formData.append('title', data.title);
  formData.append('slug', data.slug);
  formData.append('description', data.description);
  formData.append('price', data.price.toString());
  formData.append('mrp', data.mrp.toString());
  formData.append('stock', data.stock.toString());
  formData.append('categoryId', data.categoryId.toString());
  formData.append('sku', data.sku);
  if (data.isActive !== undefined) formData.append('isActive', data.isActive.toString());

  if (data.images) {
    data.images.forEach((image) => formData.append('images', image));
  }

  return api.post('/products', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

// Update product
export const updateProduct = (productId: number, data: {
  title?: string;
  slug?: string;
  description?: string;
  price?: number;
  mrp?: number;
  stock?: number;
  categoryId?: number;
  sku?: string;
  isActive?: boolean;
  images?: File[];
}) => {
  const formData = new FormData();
  if (data.title) formData.append('title', data.title);
  if (data.slug) formData.append('slug', data.slug);
  if (data.description) formData.append('description', data.description);
  if (data.price !== undefined) formData.append('price', data.price.toString());
  if (data.mrp !== undefined) formData.append('mrp', data.mrp.toString());
  if (data.stock !== undefined) formData.append('stock', data.stock.toString());
  if (data.categoryId !== undefined) formData.append('categoryId', data.categoryId.toString());
  if (data.sku) formData.append('sku', data.sku);
  if (data.isActive !== undefined) formData.append('isActive', data.isActive.toString());

  if (data.images) {
    data.images.forEach((image) => formData.append('images', image));
  }

  return api.put(`/products/${productId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

// Delete product
export const deleteProduct = (productId: number) => {
  return api.delete(`/products/${productId}`);
}

// Search products
export const searchProducts = (params: { search: string; categoryId?: number }) => {
  return api.get('/products/search', { params });
}

// Get products by category
export const getProductsByCategory = (categoryId: number, params?: { page?: number; limit?: number; sort?: string }) => {
  return api.get(`/products/category/${categoryId}`, { params });
}

// Bulk import products (array of product objects)
export const bulkImportProducts = (products: Array<any>) => {
  return api.post('/products/bulk-import', products);
}

// Update product stock only
export const updateProductStock = (productId: number, stock: number) => {
  return api.patch(`/products/${productId}/stock`, { stock });
}
