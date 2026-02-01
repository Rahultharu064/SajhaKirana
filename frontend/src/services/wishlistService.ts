import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5003';

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
};

export interface WishlistItem {
    id: number;
    userId: number;
    productId: number;
    createdAt: string;
    product: {
        id: number;
        title: string;
        slug: string;
        price: number;
        mrp: number;
        images: string;
        stock: number;
        isActive: boolean;
        category: {
            name: string;
            slug: string;
        };
    };
}

export const wishlistService = {
    // Get user's wishlist
    getWishlist: async () => {
        const response = await axios.get(`${API_URL}/wishlist`, getAuthHeaders());
        return response.data;
    },

    // Add product to wishlist
    addToWishlist: async (productId: number) => {
        const response = await axios.post(
            `${API_URL}/wishlist`,
            { productId },
            getAuthHeaders()
        );
        return response.data;
    },

    // Remove product from wishlist
    removeFromWishlist: async (productId: number) => {
        const response = await axios.delete(
            `${API_URL}/wishlist/${productId}`,
            getAuthHeaders()
        );
        return response.data;
    },

    // Check if product is in wishlist
    checkWishlistStatus: async (productId: number) => {
        const response = await axios.get(
            `${API_URL}/wishlist/${productId}/check`,
            getAuthHeaders()
        );
        return response.data;
    },
};
