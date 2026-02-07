import { Router } from "express";
import { initiateEsewaPayment, initiateKhaltiPayment, verifyEsewaPayment, verifyKhaltiPayment, getPaymentStatus, updatePaymentStatus } from "../controllers/paymentController";
import { validate } from "../middlewares/validate";
import { esewaInitSchema, khaltiInitSchema, paymentStatusSchema } from "../validators/paymentValidator";
import { authMiddleware } from "../middlewares/authMiddleware";
const paymentRoutes = Router();
// eSewa payment routes
paymentRoutes.post("/:orderId/esewa/initiate", initiateEsewaPayment);
// Khalti payment routes
paymentRoutes.post("/:orderId/khalti/initiate", initiateKhaltiPayment);
// Payment verification routes (webhooks)
paymentRoutes.get("/esewa/verify", verifyEsewaPayment);
paymentRoutes.get("/khalti/verify", verifyKhaltiPayment);
// Get payment status for an order
paymentRoutes.get("/:orderId/status", authMiddleware, getPaymentStatus);
// Admin: Update payment status
paymentRoutes.put("/status", authMiddleware, validate(paymentStatusSchema, "body"), updatePaymentStatus);
export default paymentRoutes;
//# sourceMappingURL=paymentRoute.js.map