import type { Request, Response, NextFunction } from "express";
import { prismaClient } from "../config/client";

// Create order (checkout)
export const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, paymentMethod, couponCode, items } = req.body;
    console.log("Create Order Payload:", JSON.stringify(req.body, null, 2));

    // Validate user
    const user = await prismaClient.user.findUnique({ where: { id: parseInt(userId) } });
    if (!user) {
      console.error(`Create Order Failed: User ${userId} not found`);
      return res.status(404).json({ success: false, error: { code: "USER_NOT_FOUND", message: "User not found" } });
    }

    // For now, assume address is passed as JSON, not from DB
    // In future, can add Address model
    const shippingAddress = req.body.shippingAddress; // JSON in the order

    // Validate and get product details
    const orderItems = [];
    let total = 0;
    for (const item of items) {
      const product = await prismaClient.product.findUnique({ where: { sku: item.sku } });
      if (!product) {
        console.error(`Create Order Failed: Product SKU ${item.sku} not found`);
        return res.status(404).json({ success: false, error: { code: "PRODUCT_NOT_FOUND", message: `Product with SKU ${item.sku} not found` } });
      }
      if (product.stock < item.qty) {
        console.error(`Create Order Failed: Insufficient stock for ${product.title} (Requested: ${item.qty}, Available: ${product.stock})`);
        return res.status(400).json({ success: false, error: { code: "INSUFFICIENT_STOCK", message: `Insufficient stock for ${product.title}` } });
      }
      total += item.price * item.qty;
      orderItems.push({
        productId: product.id,
        sku: item.sku,
        quantity: item.qty,
        price: item.price,
      });
    }

    // Apply coupon if any (placeholder)
    if (couponCode) {
      // TODO: apply discount
    }

    // Create order
    const order = await prismaClient.order.create({
      data: {
        userId: parseInt(userId),
        total,
        paymentMethod,
        shippingAddress: JSON.stringify(shippingAddress),
        orderItems: {
          create: orderItems,
        },
      },
    });

    // Initiate payment based on method
    let paymentResponse = null;
    if (paymentMethod === 'esewa' || paymentMethod === 'khalti') {
      try {
        console.log(`🔄 Initiating ${paymentMethod} payment for order ${order.id}...`);

        // Import and call the payment controller functions directly
        const { initiateEsewaPayment, initiateKhaltiPayment } = await import('./paymentController.js');

        // Create a simple request object
        const paymentReq = {
          ...req,
          params: { orderId: order.id.toString() }
        } as any;

        // Call the appropriate payment initiation function
        if (paymentMethod === 'esewa') {
          let responseCaptured: any = null;
          const paymentRes = {
            status: (code: number) => ({
              json: (data: any) => {
                responseCaptured = data;
                return paymentRes;
              }
            })
          } as any;

          await initiateEsewaPayment(paymentReq, paymentRes, (err: any) => {
            if (err) {
              console.error(`❌ eSewa initiation failed:`, err);
            }
          });

          if (responseCaptured) {
            paymentResponse = { data: responseCaptured.data };
            console.log(`✅ eSewa payment initiated successfully:`, paymentResponse);
          }
        } else if (paymentMethod === 'khalti') {
          let responseCaptured: any = null;
          const paymentRes = {
            status: (code: number) => ({
              json: (data: any) => {
                responseCaptured = data;
                return paymentRes;
              }
            })
          } as any;

          await initiateKhaltiPayment(paymentReq, paymentRes, (err: any) => {
            if (err) {
              console.error(`❌ Khalti initiation failed:`, err);
            }
          });

          if (responseCaptured) {
            paymentResponse = { data: responseCaptured.data };
            console.log(`✅ Khalti payment initiated successfully:`, paymentResponse);
          }
        }
      } catch (error) {
        console.error(`💥 ${paymentMethod} initiation error:`, error);
      }
    }

    console.log(`📦 Order ${order.id} created successfully`);

    // Clear cart
    await prismaClient.cartItem.deleteMany({ where: { userId: parseInt(userId) } });

    res.status(201).json({
      success: true,
      data: {
        orderId: order.id,
        total: order.total,
        ...paymentResponse,  // Include payment redirect details
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
      include: { payments: true, orderItems: { include: { product: true } } },
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
      include: { payments: true, orderItems: { include: { product: true } } },
      orderBy: { createdAt: 'desc' },
    });
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    next(error);
  }
};

// Get all orders (admin)
export const getAllOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
    const where: any = {};
    if (status) {
      where.orderStatus = status;
    }
    const orders = await prismaClient.order.findMany({
      where,
      include: { user: { select: { id: true, name: true, email: true } }, payments: true, orderItems: { include: { product: true } } },
      orderBy: { createdAt: 'desc' },
      skip,
      take: parseInt(limit as string),
    });
    const total = await prismaClient.order.count({ where });
    res.status(200).json({ success: true, data: orders, pagination: { page: parseInt(page as string), limit: parseInt(limit as string), total } });
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
    await fetch(`${req.protocol}://${req.get('host')}/inventory/release`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId: id.toString() }),
    });

    res.status(200).json({ success: true, message: "Order cancelled" });
  } catch (error) {
    next(error);
  }
};

// Update order status (admin or system)
export const updateOrderStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const idStr = req.params.id;
    if (!idStr || isNaN(parseInt(idStr))) {
      return res.status(400).json({ success: false, error: { code: "INVALID_ID", message: "Invalid order ID" } });
    }
    const id = parseInt(idStr);
    const { status } = req.body;

    const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, error: { code: "INVALID_STATUS", message: "Invalid order status" } });
    }

    const order = await prismaClient.order.findUnique({ where: { id } });
    if (!order) {
      return res.status(404).json({ success: false, error: { code: "ORDER_NOT_FOUND", message: "Order not found" } });
    }

    let updateData: any = { orderStatus: status };

    // Generate OTP when status is shipped
    if (status === 'shipped' && !order.otp) {
      const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
      updateData.otp = otp;
    }

    await prismaClient.order.update({
      where: { id },
      data: updateData,
    });

    res.status(200).json({ success: true, message: `Order status updated to ${status}` });
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
    await fetch(`${req.protocol}://${req.get('host')}/inventory/commit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId: id.toString() }),
    });

    res.status(200).json({ success: true, message: "Delivery confirmed" });
  } catch (error) {
    next(error);
  }
};
