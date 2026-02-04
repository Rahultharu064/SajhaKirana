import type { Request, Response, NextFunction } from "express";
import { prismaClient } from "../config/client";
import { processEsewaInitiation, processKhaltiInitiation } from "./paymentController.js";

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
    const baseUrl = `${req.protocol}://${req.get('host')}`;

    if (paymentMethod === 'esewa' || paymentMethod === 'khalti') {
      try {
        console.log(`🔄 Initiating ${paymentMethod} payment for order ${order.id}...`);

        if (paymentMethod === 'esewa') {
          const esewaData = await processEsewaInitiation(order.id, baseUrl);
          paymentResponse = { data: esewaData };
          console.log(`✅ eSewa payment initiated successfully`);
        } else if (paymentMethod === 'khalti') {
          const khaltiData = await processKhaltiInitiation(order.id, baseUrl, {
            name: user.name,
            email: user.email,
            phone: user.phone || '9800000000'
          });
          paymentResponse = { data: khaltiData };
          console.log(`✅ Khalti payment initiated successfully`);
        }
      } catch (error) {
        console.error(`💥 ${paymentMethod} initiation error:`, error);
        // We continue without payment data, causing frontend to show error toast
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

import { getIO } from "../utils/socket";

// Update order status (admin or system)
export const updateOrderStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const idStr = req.params.id;
    if (!idStr || isNaN(parseInt(idStr))) {
      return res.status(400).json({ success: false, error: { code: "INVALID_ID", message: "Invalid order ID" } });
    }
    const id = parseInt(idStr);
    const { status, notes } = req.body;
    const changedBy = (req as any).user?.id; // Admin who made the change

    const validStatuses = ['pending', 'processing', 'confirmed', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, error: { code: "INVALID_STATUS", message: "Invalid order status" } });
    }

    const order = await prismaClient.order.findUnique({ 
      where: { id },
      include: { user: true }
    });
    if (!order) {
      return res.status(404).json({ success: false, error: { code: "ORDER_NOT_FOUND", message: "Order not found" } });
    }

    let updateData: any = { orderStatus: status };

    // Add admin notes if provided
    if (notes) {
      updateData.adminNotes = order.adminNotes 
        ? `${order.adminNotes}\n\n[${new Date().toISOString()}] ${notes}`
        : notes;
    }

    // Generate OTP when status is shipped
    if (status === 'shipped' && !order.otp) {
      const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
      updateData.otp = otp;
    }

    const updatedOrder = await prismaClient.order.update({
      where: { id },
      data: updateData,
    });

    // Create status history record
    await prismaClient.orderStatusHistory.create({
      data: {
        orderId: id,
        status,
        notes: notes || null,
        changedBy: changedBy || null,
      }
    });

    // Send email notification
    try {
      const { sendOrderStatusEmail } = await import('../utils/verifyEmail');
      await sendOrderStatusEmail(
        order.user.email,
        order.user.name,
        id,
        status,
        updatedOrder.otp || undefined
      );
    } catch (emailError) {
      console.error('Failed to send status email:', emailError);
    }

    // Notify clients about the update
    try {
      getIO().emit("orderStatusUpdated", { orderId: id, status, updatedOrder });
    } catch (socketError) {
      console.error("Socket emit failed:", socketError);
    }

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

// Get order status history
export const getOrderStatusHistory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const idStr = req.params.id;
    if (!idStr || isNaN(parseInt(idStr))) {
      return res.status(400).json({ success: false, error: { code: "INVALID_ID", message: "Invalid order ID" } });
    }
    const id = parseInt(idStr);
    
    const history = await prismaClient.orderStatusHistory.findMany({
      where: { orderId: id },
      orderBy: { createdAt: 'asc' }
    });

    res.status(200).json({ success: true, data: history });
  } catch (error) {
    next(error);
  }
};

// Generate PDF invoice for order
export const generateInvoice = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const idStr = req.params.id;
    if (!idStr || isNaN(parseInt(idStr))) {
      return res.status(400).json({ success: false, error: { code: "INVALID_ID", message: "Invalid order ID" } });
    }
    const id = parseInt(idStr);
    
    const order = await prismaClient.order.findUnique({
      where: { id },
      include: {
        user: true,
        orderItems: {
          include: {
            product: true
          }
        }
      }
    });

    if (!order) {
      return res.status(404).json({ success: false, error: { code: "ORDER_NOT_FOUND", message: "Order not found" } });
    }

    // Use dynamic import to avoid TypeScript issues
    const PDFDocument = (await import('pdfkit')).default;
    const doc = new PDFDocument({ margin: 50 });

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=invoice-${id}.pdf`);

    // Pipe PDF to response
    doc.pipe(res);

    // Parse shipping address
    let shippingAddress: any = {};
    try {
      shippingAddress = JSON.parse(order.shippingAddress);
    } catch (e) {
      shippingAddress = { address: order.shippingAddress };
    }

    // Header
    doc.fontSize(20).text('INVOICE', { align: 'center' });
    doc.fontSize(10).text(process.env.APP_NAME || 'SajhaKirana', { align: 'center' });
    doc.moveDown();

    // Order Info
    doc.fontSize(12).text(`Invoice #: ${id}`);
    doc.fontSize(10).text(`Order Date: ${new Date(order.createdAt).toLocaleDateString()}`);
    doc.text(`Order Status: ${order.orderStatus.toUpperCase()}`);
    doc.text(`Payment Method: ${order.paymentMethod.toUpperCase()}`);
    doc.text(`Payment Status: ${order.paymentStatus.toUpperCase()}`);
    doc.moveDown();

    // Customer Info
    doc.fontSize(12).text('Customer Details:');
    doc.fontSize(10).text(`Name: ${order.user.name}`);
    doc.text(`Email: ${order.user.email}`);
    if (order.user.phone) doc.text(`Phone: ${order.user.phone}`);
    doc.moveDown();

    // Shipping Address
    doc.fontSize(12).text('Shipping Address:');
    doc.fontSize(10).text(shippingAddress.fullName || order.user.name);
    doc.text(`${shippingAddress.address}, ${shippingAddress.city}`);
    doc.text(shippingAddress.district || '');
    if (shippingAddress.phone) doc.text(`Phone: ${shippingAddress.phone}`);
    doc.moveDown();

    // Items Table Header
    doc.fontSize(12).text('Order Items:');
    doc.moveDown(0.5);

    const tableTop = doc.y;
    const itemX = 50;
    const qtyX = 300;
    const priceX = 380;
    const totalX = 460;

    doc.fontSize(10).font('Helvetica-Bold');
    doc.text('Item', itemX, tableTop);
    doc.text('Qty', qtyX, tableTop);
    doc.text('Price', priceX, tableTop);
    doc.text('Total', totalX, tableTop);
    doc.moveTo(itemX, doc.y + 5).lineTo(totalX + 70, doc.y + 5).stroke();
    doc.font('Helvetica');

    // Items
    let yPosition = doc.y + 10;
    for (const item of order.orderItems) {
      if (yPosition > 700) {
        doc.addPage();
        yPosition = 50;
      }
      doc.text(item.product?.title || item.sku, itemX, yPosition, { width: 240 });
      doc.text(item.quantity.toString(), qtyX, yPosition);
      doc.text(`Rs. ${item.price}`, priceX, yPosition);
      doc.text(`Rs. ${(item.price * item.quantity).toFixed(2)}`, totalX, yPosition);
      yPosition = doc.y + 10;
    }

    // Totals
    doc.moveTo(itemX, yPosition).lineTo(totalX + 70, yPosition).stroke();
    yPosition += 10;
    doc.fontSize(12).font('Helvetica-Bold');
    doc.text('Total Amount:', priceX, yPosition);
    doc.text(`Rs. ${order.total.toFixed(2)}`, totalX, yPosition);

    // Footer
    doc.fontSize(10).font('Helvetica').moveDown(2);
    doc.text('Thank you for your business!', { align: 'center' });
    doc.fontSize(8).text(`Generated on ${new Date().toLocaleString()}`, { align: 'center' });

    // Finalize PDF
    doc.end();
  } catch (error) {
    console.error('PDF generation error:', error);
    next(error);
  }
};
