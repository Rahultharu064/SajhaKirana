import type { Request, Response, NextFunction } from "express";
import { prismaClient } from "../config/client";

// Initiate eSewa Payment
export const initiateEsewaPayment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { orderId } = req.params;
    if (!orderId || isNaN(parseInt(orderId))) {
      return res.status(400).json({ success: false, error: { code: "INVALID_ORDER_ID", message: "Invalid order ID" } });
    }
    const order = await prismaClient.order.findUnique({
      where: { id: parseInt(orderId) },
      include: { payments: true }
    });

    if (!order) {
      return res.status(404).json({ success: false, error: { code: "ORDER_NOT_FOUND", message: "Order not found" } });
    }

    if (order.paymentStatus === 'paid') {
      return res.status(400).json({ success: false, error: { code: "PAYMENT_ALREADY_COMPLETED", message: "Payment already completed" } });
    }

    // Check if payment already initiated for eSewa
    const existingPayment = order.payments.find(p => p.gateway === 'esewa' && p.status === 'pending');
    if (existingPayment) {
      return res.status(400).json({ success: false, error: { code: "PAYMENT_ALREADY_INITIATED", message: "Payment already initiated" } });
    }

    // Generate unique reference
    const referenceId = `esewa_${order.id}_${Date.now()}`;

    // Create payment record
    const payment = await prismaClient.payment.create({
      data: {
        orderId: order.id,
        gateway: 'esewa',
        amount: order.total,
        txnId: referenceId, // Temporary txnId until verified
        status: 'pending'
      }
    });

    // eSewa parameters
    const esewaConfig = {
      amt: order.total,
      psc: 0,
      pdc: 0,
      txAmt: 0,
      tAmt: order.total,
      pid: referenceId,
      scd: process.env.ESEWA_MERCHANT_ID || 'EPAYTEST',
      su: `${req.protocol}://${req.get('host')}/payment/esewa/verify?ref=${referenceId}`,
      fu: `${req.protocol}://${req.get('host')}/payment/esewa/failure?ref=${referenceId}`
    };

    res.status(200).json({
      success: true,
      data: {
        payment,
        esewaConfig,
        esewaURL: process.env.NODE_ENV === 'production'
          ? 'https://epay.esewa.com.np/api/epay/main/v2/form'
          : 'https://uat.esewa.com.np/epay/main'
      }
    });
  } catch (error) {
    next(error);
  }
};

// Initiate Khalti Payment
export const initiateKhaltiPayment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { orderId } = req.params;
    if (!orderId || isNaN(parseInt(orderId))) {
      return res.status(400).json({ success: false, error: { code: "INVALID_ORDER_ID", message: "Invalid order ID" } });
    }
    const order = await prismaClient.order.findUnique({
      where: { id: parseInt(orderId) },
      include: { payments: true }
    });

    if (!order) {
      return res.status(404).json({ success: false, error: { code: "ORDER_NOT_FOUND", message: "Order not found" } });
    }

    if (order.paymentStatus === 'paid') {
      return res.status(400).json({ success: false, error: { code: "PAYMENT_ALREADY_COMPLETED", message: "Payment already completed" } });
    }

    // Check if payment already initiated for Khalti
    const existingPayment = order.payments.find(p => p.gateway === 'khalti' && p.status === 'pending');
    if (existingPayment) {
      return res.status(400).json({ success: false, error: { code: "PAYMENT_ALREADY_INITIATED", message: "Payment already initiated" } });
    }

    const purchaseOrderId = `khalti_${order.id}_${Date.now()}`;

    // Create payment record
    const payment = await prismaClient.payment.create({
      data: {
        orderId: order.id,
        gateway: 'khalti',
        amount: order.total,
        txnId: purchaseOrderId, // Temporary txnId until verified
        status: 'pending'
      }
    });

    // Khalti API request
    const khaltiResponse = await fetch('https://a.khalti.com/api/v2/epayment/initiate/', {
      method: 'POST',
      headers: {
        'Authorization': `key ${process.env.KHALTI_SECRET_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        return_url: `${req.protocol}://${req.get('host')}/payment/khalti/verify?ref=${purchaseOrderId}`,
        website_url: `${req.protocol}://${req.get('host')}`,
        amount: Math.round(order.total * 100), // Convert to paisa
        purchase_order_id: purchaseOrderId,
        purchase_order_name: `Order #${order.id}`
      })
    });

    if (!khaltiResponse.ok) {
      await prismaClient.payment.delete({ where: { id: payment.id } });
      return res.status(500).json({ success: false, error: { code: "PAYMENT_INIT_FAILED", message: "Failed to initiate Khalti payment" } });
    }

    const khaltiData = await khaltiResponse.json();

    res.status(200).json({
      success: true,
      data: {
        payment,
        khaltiData,
        paymentUrl: khaltiData.payment_url
      }
    });
  } catch (error) {
    next(error);
  }
};

// Verify eSewa Payment
export const verifyEsewaPayment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { amt, rid, pid, scd } = req.query as any;

    if (!amt || !rid || !pid || !scd) {
      return res.status(400).json({ success: false, error: { code: "MISSING_PARAMS", message: "Missing verification parameters" } });
    }

    // Verify with eSewa
    const verificationURL = process.env.NODE_ENV === 'production'
      ? 'https://epay.esewa.com.np/api/epay/transaction/status/'
      : 'https://uat.esewa.com.np/epay/transrec';

    const verifyResponse = await fetch(verificationURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        amt: amt,
        scd: scd,
        rid: rid,
        pid: pid
      })
    });

    if (!verifyResponse.ok) {
      return res.status(500).json({ success: false, error: { code: "VERIFICATION_FAILED", message: "Payment verification failed" } });
    }

    const verifyData = await verifyResponse.text();
    const isSuccess = verifyData.includes('<response_code>Success</response_code>') ||
                      verifyData.includes('Success');

    if (isSuccess) {
      // Find and update payment
      const payment = await prismaClient.payment.findFirst({
        where: { txnId: pid, gateway: 'esewa' },
        include: { order: true }
      });

      if (!payment) {
        return res.status(404).json({ success: false, error: { code: "PAYMENT_NOT_FOUND", message: "Payment not found" } });
      }

      // Update payment
      await prismaClient.payment.update({
        where: { id: payment.id },
        data: {
          status: 'paid',
          txnId: rid // Update with eSewa's reference ID
        }
      });

      // Update order
      await prismaClient.order.update({
        where: { id: payment.order.id },
        data: { paymentStatus: 'paid' }
      });

      res.redirect(`${req.protocol}://${req.get('host')}/payment/success?order=${payment.order.id}`);
    } else {
      // Payment failed
      const failedPayment = await prismaClient.payment.findFirst({
        where: { txnId: pid, gateway: 'esewa' },
        include: { order: true }
      });

      if (failedPayment) {
        await prismaClient.payment.update({
          where: { id: failedPayment.id },
          data: { status: 'failed' }
        });
      }

      res.redirect(`${req.protocol}://${req.get('host')|| 'localhost:5003'}/payment/failure?order=${failedPayment?.order.id || 'unknown'}`);
    }
  } catch (error) {
    next(error);
  }
};

// Verify Khalti Payment
export const verifyKhaltiPayment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token, amount } = req.query as any;
    const { pidx } = req.query as any; // Khalti payment id

    if (!token || !amount || !pidx) {
      return res.status(400).json({ success: false, error: { code: "MISSING_PARAMS", message: "Missing verification parameters" } });
    }

    // Verify with Khalti
    const verifyResponse = await fetch('https://a.khalti.com/api/v2/epayment/lookup/', {
      method: 'POST',
      headers: {
        'Authorization': `key ${process.env.KHALTI_SECRET_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        pidx: pidx
      })
    });

    if (!verifyResponse.ok) {
      return res.status(500).json({ success: false, error: { code: "VERIFICATION_FAILED", message: "Payment verification failed" } });
    }

    const verifyData = await verifyResponse.json();

    if (verifyData.status === 'Completed') {
      // Find and update payment
      const payment = await prismaClient.payment.findFirst({
        where: { txnId: pidx, gateway: 'khalti' },
        include: { order: true }
      });

      if (!payment) {
        return res.status(404).json({ success: false, error: { code: "PAYMENT_NOT_FOUND", message: "Payment not found" } });
      }

      // Update payment
      await prismaClient.payment.update({
        where: { id: payment.id },
        data: {
          status: 'paid',
          txnId: verifyData.transaction_id || verifyData.pidx
        }
      });

      // Update order
      await prismaClient.order.update({
        where: { id: payment.order.id },
        data: { paymentStatus: 'paid' }
      });

      res.redirect(`${req.protocol}://${req.get('host')}/payment/success?order=${payment.order.id}`);
    } else {
      // Payment incomplete or failed
      const payment = await prismaClient.payment.findFirst({
        where: { txnId: pidx, gateway: 'khalti' },
        include: { order: true }
      });

      if (payment) {
        await prismaClient.payment.update({
          where: { id: payment.id },
          data: { status: 'failed' }
        });
      }

      res.redirect(`${req.protocol}://${req.get('host')|| 'localhost:5003'}/payment/failure?order=${payment?.order.id || 'unknown'}`);
    }
  } catch (error) {
    next(error);
  }
};

// Get payment status
export const getPaymentStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { orderId } = req.params;
    if (!orderId || isNaN(parseInt(orderId))) {
      return res.status(400).json({ success: false, error: { code: "INVALID_ORDER_ID", message: "Invalid order ID" } });
    }
    const payment = await prismaClient.payment.findMany({
      where: { orderId: parseInt(orderId) },
      include: { order: { select: { id: true, paymentStatus: true } } },
      orderBy: { createdAt: 'desc' }
    });

    res.status(200).json({ success: true, data: payment });
  } catch (error) {
    next(error);
  }
};

// Update payment status (admin function)
export const updatePaymentStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { orderId, status } = req.body;

    const order = await prismaClient.order.findUnique({
      where: { id: orderId },
      include: { payments: true }
    });

    if (!order) {
      return res.status(404).json({ success: false, error: { code: "ORDER_NOT_FOUND", message: "Order not found" } });
    }

    // Update order payment status
    await prismaClient.order.update({
      where: { id: orderId },
      data: { paymentStatus: status }
    });

    // Update latest payment record
    const latestPayment = order.payments.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0];
    if (latestPayment) {
      await prismaClient.payment.update({
        where: { id: latestPayment.id },
        data: { status: status === 'paid' ? 'paid' : status === 'failed' ? 'failed' : 'pending' }
      });
    }

    res.status(200).json({ success: true, message: "Payment status updated" });
  } catch (error) {
    next(error);
  }
};
