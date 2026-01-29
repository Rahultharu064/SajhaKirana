import api from "./api";
import type { AddressData } from "../types/common";

export interface CreateOrderPayload {
    userId: number;
    shippingAddress: AddressData;
    paymentMethod: "cod" | "esewa" | "khalti";
    items: {
        sku: string;
        qty: number;
        price: number;
    }[];
    couponCode?: string;
}

export const orderService = {
    createOrder: async (data: CreateOrderPayload) => {
        return await api.post("/orders", data);
    },

    getOrder: async (id: number) => {
        return await api.get(`/orders/${id}`);
    },

    getUserOrders: async (userId: number) => {
        return await api.get(`/orders/user/${userId}`);
    },

    getAllOrders: async (params?: { status?: string; page?: number; limit?: number }) => {
        return await api.get("/orders", { params });
    },

    updateOrderStatus: async (id: number, status: string) => {
        return await api.put(`/orders/${id}/status`, { status });
    },

    cancelOrder: async (id: number) => {
        return await api.post(`/orders/${id}/cancel`);
    },

    confirmDelivery: async (id: number, otp: string) => {
        return await api.post(`/orders/${id}/confirm-delivery`, { otp });
    },

    validateFraud: async (data: { userId: number; orderDetails: any; deviceFingerprint?: string; ipAddress?: string }) => {
        return await api.post("/orders/validate-fraud", data);
    }
};
