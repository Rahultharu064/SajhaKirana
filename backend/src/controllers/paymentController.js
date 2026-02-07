import { prismaClient } from "../config/client";
// Helper for eSewa
export const processEsewaInitiation = async (orderId, baseUrl) => {
    const order = await prismaClient.order.findUnique({
        where: { id: orderId },
        include: { payments: true }
    });
    if (!order) {
        throw { status: 404, message: "Order not found", code: "ORDER_NOT_FOUND" };
    }
    if (order.paymentStatus === 'paid') {
        throw { status: 400, message: "Payment already completed", code: "PAYMENT_ALREADY_COMPLETED" };
    }
    // Check if payment already initiated for eSewa
    const existingPayment = order.payments.find(p => p.gateway === 'esewa' && p.status === 'pending');
    if (existingPayment) {
        // Ideally we might want to return existing config, but for now throwing error or handling it.
        // Only throw if strictly creating new. To be safe, let's allow re-initiation if it's just pending but not finalized,
        // or we can just return the existing payment info if we wanted to be idempotent.
        // But keeping original logic:
        throw { status: 400, message: "Payment already initiated", code: "PAYMENT_ALREADY_INITIATED" };
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
        su: `${baseUrl}/payment/esewa/verify?ref=${referenceId}`,
        fu: `${baseUrl}/payment/esewa/failure?ref=${referenceId}`
    };
    return {
        payment,
        esewaConfig,
        esewaURL: process.env.NODE_ENV === 'production'
            ? 'https://epay.esewa.com.np/api/epay/main/v2/form'
            : 'https://uat.esewa.com.np/epay/main'
    };
};
// Initiate eSewa Payment (Controller)
export const initiateEsewaPayment = async (req, res, next) => {
    try {
        const { orderId } = req.params;
        if (!orderId || isNaN(parseInt(orderId))) {
            return res.status(400).json({ success: false, error: { code: "INVALID_ORDER_ID", message: "Invalid order ID" } });
        }
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        try {
            const data = await processEsewaInitiation(parseInt(orderId), baseUrl);
            res.status(200).json({ success: true, data });
        }
        catch (err) {
            if (err.status) {
                return res.status(err.status).json({ success: false, error: { code: err.code, message: err.message } });
            }
            throw err;
        }
    }
    catch (error) {
        next(error);
    }
};
// Helper for Khalti
export const processKhaltiInitiation = async (orderId, baseUrl, user) => {
    const order = await prismaClient.order.findUnique({
        where: { id: orderId },
        include: { payments: true }
    });
    if (!order) {
        throw { status: 404, message: "Order not found", code: "ORDER_NOT_FOUND" };
    }
    if (order.paymentStatus === 'paid') {
        throw { status: 400, message: "Payment already completed", code: "PAYMENT_ALREADY_COMPLETED" };
    }
    // Check if payment already initiated for Khalti
    const existingPayment = order.payments.find(p => p.gateway === 'khalti' && p.status === 'pending');
    if (existingPayment) {
        throw { status: 400, message: "Payment already initiated", code: "PAYMENT_ALREADY_INITIATED" };
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
            return_url: `${baseUrl}/payment/khalti/verify?ref=${purchaseOrderId}`,
            website_url: baseUrl,
            amount: Math.round(order.total * 100), // Convert to paisa
            purchase_order_id: purchaseOrderId,
            purchase_order_name: `Order #${order.id}`,
            customer_info: {
                name: user.name,
                email: user.email,
                phone: user.phone
            }
        })
    });
    if (!khaltiResponse.ok) {
        await prismaClient.payment.delete({ where: { id: payment.id } });
        const errorText = await khaltiResponse.text();
        console.error("Khalti Init Error:", errorText);
        throw { status: 500, message: "Failed to initiate Khalti payment", code: "PAYMENT_INIT_FAILED" };
    }
    const khaltiData = await khaltiResponse.json();
    return {
        payment,
        khaltiData,
        paymentUrl: khaltiData.payment_url
    };
};
// Initiate Khalti Payment (Controller)
export const initiateKhaltiPayment = async (req, res, next) => {
    try {
        const { orderId } = req.params;
        if (!orderId || isNaN(parseInt(orderId))) {
            return res.status(400).json({ success: false, error: { code: "INVALID_ORDER_ID", message: "Invalid order ID" } });
        }
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        // Validating user info availability might be needed, assume simple extraction or fallback
        // In controller context, we might not have full user object conveniently without database call if not attached to req
        // But let's fetch user from order userId
        const order = await prismaClient.order.findUnique({ where: { id: parseInt(orderId) }, select: { userId: true } });
        if (!order)
            return res.status(404).json({ success: false, error: { code: "ORDER_NOT_FOUND", message: "Order not found" } });
        const user = await prismaClient.user.findUnique({ where: { id: order.userId } });
        if (!user)
            return res.status(404).json({ success: false, error: { code: "USER_NOT_FOUND", message: "User not found" } });
        try {
            const data = await processKhaltiInitiation(parseInt(orderId), baseUrl, {
                name: user.name,
                email: user.email,
                phone: user.phone || '9800000000' // Fallback
            });
            res.status(200).json({ success: true, data });
        }
        catch (err) {
            if (err.status) {
                return res.status(err.status).json({ success: false, error: { code: err.code, message: err.message } });
            }
            throw err;
        }
    }
    catch (error) {
        next(error);
    }
};
// Verify eSewa Payment
export const verifyEsewaPayment = async (req, res, next) => {
    try {
        const { amt, rid, pid, scd } = req.query;
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
            // Redirect to frontend success page
            const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
            res.redirect(`${clientUrl}/payment/success?order=${payment.order.id}`);
        }
        else {
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
            const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
            res.redirect(`${clientUrl}/payment/failure?order=${failedPayment?.order.id || 'unknown'}`);
        }
    }
    catch (error) {
        next(error);
    }
};
// Verify Khalti Payment
export const verifyKhaltiPayment = async (req, res, next) => {
    try {
        const { pidx, purchase_order_id } = req.query;
        // Allow missing token/amount if pidx is present (Khalti sometimes changes params)
        if (!pidx) {
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
            console.error("Khalti Lookup Failed:", await verifyResponse.text());
            return res.status(500).json({ success: false, error: { code: "VERIFICATION_FAILED", message: "Payment verification failed" } });
        }
        const verifyData = await verifyResponse.json();
        console.log("Khalti Verify Response:", JSON.stringify(verifyData));
        console.log("Callback Params:", JSON.stringify(req.query));
        if (verifyData.status === 'Completed') {
            // Find payment
            // Initially, txnId stores the purchase_order_id.
            // We prioritize purchase_order_id from query if available.
            let payment = null;
            if (purchase_order_id) {
                payment = await prismaClient.payment.findFirst({
                    where: { txnId: purchase_order_id, gateway: 'khalti' },
                    include: { order: true }
                });
            }
            // Fallback: Check if we already updated it to pidx or if pidx was stored somehow
            if (!payment) {
                payment = await prismaClient.payment.findFirst({
                    where: { txnId: pidx, gateway: 'khalti' },
                    include: { order: true }
                });
            }
            if (!payment) {
                return res.status(404).json({ success: false, error: { code: "PAYMENT_NOT_FOUND", message: "Payment not found" } });
            }
            // Update payment
            await prismaClient.payment.update({
                where: { id: payment.id },
                data: {
                    status: 'paid',
                    txnId: verifyData.transaction_id || verifyData.pidx // Update to Khalti's ID for future reference
                }
            });
            // Update order
            await prismaClient.order.update({
                where: { id: payment.order.id },
                data: { paymentStatus: 'paid' }
            });
            const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
            res.redirect(`${clientUrl}/payment/success?order=${payment.order.id}`);
        }
        else {
            // Payment incomplete or failed
            // Try to find payment record to mark as failed
            let payment = null;
            if (purchase_order_id) {
                payment = await prismaClient.payment.findFirst({
                    where: { txnId: purchase_order_id, gateway: 'khalti' },
                    include: { order: true }
                });
            }
            if (!payment) {
                payment = await prismaClient.payment.findFirst({
                    where: { txnId: pidx, gateway: 'khalti' },
                    include: { order: true }
                });
            }
            if (payment) {
                await prismaClient.payment.update({
                    where: { id: payment.id },
                    data: { status: 'failed' }
                });
            }
            const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
            res.redirect(`${clientUrl}/payment/failure?order=${payment?.order.id || 'unknown'}`);
        }
    }
    catch (error) {
        next(error);
    }
};
// Get payment status
export const getPaymentStatus = async (req, res, next) => {
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
    }
    catch (error) {
        next(error);
    }
};
// Update payment status (admin function)
export const updatePaymentStatus = async (req, res, next) => {
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
    }
    catch (error) {
        next(error);
    }
};
//# sourceMappingURL=paymentController.js.map