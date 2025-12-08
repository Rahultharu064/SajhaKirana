import api from "./api";

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

export const getCategories = async () => {
  const response = await api.get('/categories');
  return response.data.data;
};
