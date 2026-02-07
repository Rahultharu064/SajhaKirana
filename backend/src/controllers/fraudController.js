import { fraudService } from "../services/fraudService";
export const validateFraud = async (req, res, next) => {
    try {
        const { userId, orderDetails, deviceFingerprint, ipAddress } = req.body;
        if (!userId || !orderDetails) {
            return res.status(400).json({
                success: false,
                error: { code: "MISSING_FIELDS", message: "User ID and order details are required" }
            });
        }
        const clientIp = ipAddress || req.ip || req.headers['x-forwarded-for'] || '0.0.0.0';
        const result = await fraudService.validateFraud({
            userId: parseInt(userId),
            orderDetails,
            deviceFingerprint: deviceFingerprint || 'unknown',
            ipAddress: Array.isArray(clientIp) ? clientIp[0] : clientIp
        });
        res.status(200).json({
            success: true,
            data: result
        });
    }
    catch (error) {
        next(error);
    }
};
//# sourceMappingURL=fraudController.js.map