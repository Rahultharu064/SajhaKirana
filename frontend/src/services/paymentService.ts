import api from "./api";

export const paymentService = {
    // eSewa
    initiateEsewaPayment: async (orderId: number) => {
        return await api.post(`/payments/${orderId}/esewa/initiate`);
    },

    // Khalti
    initiateKhaltiPayment: async (orderId: number) => {
        return await api.post(`/payments/${orderId}/khalti/initiate`);
    },

    // Get payment status for an order
    getPaymentStatus: async (orderId: number) => {
        return await api.get(`/payments/${orderId}/status`);
    },

    // Admin: Update payment status manually
    updatePaymentStatus: async (orderId: number, status: string) => {
        return await api.put(`/payments/status`, { orderId, status });
    }
};
