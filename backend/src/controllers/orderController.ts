import type { Request, Response, NextFunction } from "express";
import { prismaClient } from "../config/client";

// Create order (checkout)
export const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, paymentMethod, couponCode, items } = req.body;

    // Validate user
    const user = await prismaClient.user.findUnique({ where: { id: parseInt(userId) } });
    if (!user) {
      return res.status(404).json({ success: false, error: { code: "USER_NOT_FOUND", message: "User not found" } });
    }

    // For now, assume address is passed as JSON, not from DB
    // In future, can add Address model
    const shippingAddress = req.body.shippingAddress; // JSON in the order

    // Calculate total
    let total = 0;
    for (const item of items) {
      total += item.price * item.qty;
    }

    // Apply coupon if any (placeholder)
    if (couponCode) {
      // TODO: apply discount
    }

    // Create order
    const order = await prismaClient.order.create({
      data: {
        userId: parseInt(userId),
        items: JSON.stringify(items),
        total,
        paymentMethod,
        shippingAddress: JSON.stringify(shippingAddress),
      },
    });

    // Reserve inventory
    const inventoryItems = items.map((item: any) => ({ sku: item.sku, qty: item.qty }));
    // Call reserveStock internally or via service
    // For now, simulate
    try {
      const reserveResponse = await fetch(`${req.protocol}://${req.get('host')}/api/inventory/reserve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: order.id.toString(), items: inventoryItems }),
      });
      if (!reserveResponse.ok) {
        // If reserve fails, delete order
        await prismaClient.order.delete({ where: { id: order.id } });
        return res.status(400).json({ success: false, error: { code: "RESERVATION_FAILED", message: "Failed to reserve stock" } });
      }
    } catch (error) {
      await prismaClient.order.delete({ where: { id: order.id } });
      return next(error);
    }

    // Clear cart
    await prismaClient.cartItem.deleteMany({ where: { userId: parseInt(userId) } });

    // TODO: Initiate payment

    res.status(201).json({
      success: true,
      data: {
        orderId: order.id,
        total: order.total,
        // paymentIntent: ... 
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get order by ID
export const getOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({ success: false, error: { code: "INVALID_ID", message: "Invalid order ID" } });
    }
    const order = await prismaClient.order.findUnique({
      where: { id: parseInt(id) },
      include: { payments: true },
    });
    if (!order) {
      return res.status(404).json({ success: false, error: { code: "ORDER_NOT_FOUND", message: "Order not found" } });
    }
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

// Get user orders
export const getUserOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userIdStr = req.params.userId;
    if (!userIdStr || isNaN(parseInt(userIdStr))) {
      return res.status(400).json({ success: false, error: { code: "INVALID_USER_ID", message: "Invalid user ID" } });
    }
    const userId = parseInt(userIdStr);
    const orders = await prismaClient.order.findMany({
      where: { userId },
      include: { payments: true },
      orderBy: { createdAt: 'desc' },
    });
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    next(error);
  }
};

// Cancel order
export const cancelOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const idStr = req.params.id;
    if (!idStr || isNaN(parseInt(idStr))) {
      return res.status(400).json({ success: false, error: { code: "INVALID_ID", message: "Invalid order ID" } });
    }
    const id = parseInt(idStr);
    const order = await prismaClient.order.findUnique({ where: { id } });
    if (!order) {
      return res.status(404).json({ success: false, error: { code: "ORDER_NOT_FOUND", message: "Order not found" } });
    }
    if (order.orderStatus !== 'pending') {
      return res.status(400).json({ success: false, error: { code: "CANNOT_CANCEL", message: "Order cannot be cancelled" } });
    }

    // Update order status
    await prismaClient.order.update({
      where: { id },
      data: { orderStatus: 'cancelled' },
    });

    // Release reservation
    await fetch(`${req.protocol}://${req.get('host')}/api/inventory/release`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId: id.toString() }),
    });

    res.status(200).json({ success: true, message: "Order cancelled" });
  } catch (error) {
    next(error);
  }
};

// Confirm delivery
export const confirmDelivery = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const idStr = req.params.id;
    if (!idStr || isNaN(parseInt(idStr))) {
      return res.status(400).json({ success: false, error: { code: "INVALID_ID", message: "Invalid order ID" } });
    }
    const id = parseInt(idStr);
    const { otp } = req.body;
    const order = await prismaClient.order.findUnique({ where: { id } });
    if (!order) {
      return res.status(404).json({ success: false, error: { code: "ORDER_NOT_FOUND", message: "Order not found" } });
    }
    if (order.otp !== otp) {
      return res.status(400).json({ success: false, error: { code: "INVALID_OTP", message: "Invalid OTP" } });
    }

    // Update order status
    await prismaClient.order.update({
      where: { id },
      data: { orderStatus: 'delivered' },
    });

    // Commit reservation
    await fetch(`${req.protocol}://${req.get('host')}/api/inventory/commit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId: id.toString() }),
    });

    res.status(200).json({ success: true, message: "Delivery confirmed" });
  } catch (error) {
    next(error);
  }
};
