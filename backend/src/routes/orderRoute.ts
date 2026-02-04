import { Router } from "express";
import { createOrder, getOrder, getUserOrders, getAllOrders, cancelOrder, confirmDelivery, updateOrderStatus, getOrderStatusHistory, generateInvoice } from "../controllers/orderController";
import { validateFraud } from "../controllers/fraudController";
import { createOrderSchema, confirmDeliverySchema, updateOrderStatusSchema } from "../validators/orderValidator";
import { validate } from "../middlewares/validate";

const orderRoutes = Router();

// Create order (checkout)
orderRoutes.post("/", validate(createOrderSchema, "body"), createOrder);

// Validate fraud
orderRoutes.post("/validate-fraud", validateFraud);

// Get order by ID
orderRoutes.get("/:id", getOrder);

// Get order status history
orderRoutes.get("/:id/history", getOrderStatusHistory);

// Get user orders
orderRoutes.get("/user/:userId", getUserOrders);

// Get all orders (admin)
orderRoutes.get("/", getAllOrders);

// Update order status (admin)
orderRoutes.put("/:id/status", validate(updateOrderStatusSchema, "body"), updateOrderStatus);

// Cancel order
orderRoutes.post("/:id/cancel", cancelOrder);

// Confirm delivery
orderRoutes.post("/:id/confirm-delivery", validate(confirmDeliverySchema, "body"), confirmDelivery);

// Generate invoice PDF
orderRoutes.get("/:id/invoice", generateInvoice);

export default orderRoutes;
