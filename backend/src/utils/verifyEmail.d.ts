/**
 * Send email verification link to user
 * @param email - User's email address
 * @param verificationToken - JWT verification token
 * @param userName - User's name for personalization
 */
export declare const sendVerificationEmail: (email: string, verificationToken: string, userName: string) => Promise<void>;
/**
 * Send password reset email to user
 * @param email - User's email address
 * @param resetToken - JWT password reset token
 * @param userName - User's name for personalization
 */
export declare const sendPasswordResetEmail: (email: string, resetToken: string, userName: string) => Promise<void>;
/**
 * Test email configuration
 */
export declare const testEmailConnection: () => Promise<boolean>;
/**
 * Send order status update email to customer
 * @param email - Customer's email address
 * @param userName - Customer's name
 * @param orderId - Order ID
 * @param status - New order status
 * @param otp - Delivery OTP (optional, sent when status is shipped)
 */
export declare const sendOrderStatusEmail: (email: string, userName: string, orderId: number, status: string, otp?: string) => Promise<void>;
//# sourceMappingURL=verifyEmail.d.ts.map