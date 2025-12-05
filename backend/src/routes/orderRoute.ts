import { Router } from "express";
import { createOrder, getOrder, getUserOrders, cancelOrder, confirmDelivery } from "../controllers/orderController";
import { createOrderSchema, confirmDeliverySchema } from "../validators/orderValidator";
import { validate } from "../middlewares/validate";

const orderRoutes = Router();

// Create order (checkout)
orderRoutes.post("/", validate(createOrderSchema, "body"), createOrder);

// Get order by ID
orderRoutes.get("/:id", getOrder);

// Get user orders
orderRoutes.get("/user/:userId", getUserOrders);

// Cancel order
orderRoutes.post("/:id/cancel", cancelOrder);

// Confirm delivery
orderRoutes.post("/:id/confirm-delivery", validate(confirmDeliverySchema, "body"), confirmDelivery);

export default orderRoutes;
