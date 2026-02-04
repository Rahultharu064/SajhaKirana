import nodemailer from 'nodemailer';

// Email configuration (you should move these to environment variables)
const EMAIL_USER = process.env.EMAIL_USER || 'your-email@gmail.com';
const EMAIL_PASS = process.env.EMAIL_PASS || 'your-app-password';
const EMAIL_HOST = process.env.EMAIL_HOST || 'smtp.gmail.com';
const EMAIL_PORT = parseInt(process.env.EMAIL_PORT || '587');

// Create transporter
const transporter = nodemailer.createTransport({
  host: EMAIL_HOST,
  port: EMAIL_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

/**
 * Send email verification link to user
 * @param email - User's email address
 * @param verificationToken - JWT verification token
 * @param userName - User's name for personalization
 */
export const sendVerificationEmail = async (
  email: string,
  verificationToken: string,
  userName: string
): Promise<void> => {
  try {
    const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email?token=${verificationToken}`;

    const mailOptions = {
      from: `"${process.env.APP_NAME || 'SajhaKirana'}" <${EMAIL_USER}>`,
      to: email,
      subject: 'Verify Your Email Address',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #333; text-align: center;">Welcome to SajhaKirana!</h2>
          <p>Hi ${userName},</p>
          <p>Thank you for registering with SajhaKirana. Please verify your email address by clicking the button below:</p>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}"
               style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Verify Email Address
            </a>
          </div>

          <p>If the button doesn't work, you can also copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #666;">${verificationUrl}</p>

          <p>This link will expire in 24 hours for security reasons.</p>

          <p>If you didn't create an account with SajhaKirana, please ignore this email.</p>

          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
          <p style="color: #666; font-size: 12px; text-align: center;">
            This email was sent by SajhaKirana. If you have any questions, please contact our support team.
          </p>
        </div>
      `,
      text: `
        Welcome to SajhaKirana!

        Hi ${userName},

        Thank you for registering with SajhaKirana. Please verify your email address by visiting this link:
        ${verificationUrl}

        This link will expire in 24 hours for security reasons.

        If you didn't create an account with SajhaKirana, please ignore this email.

        This email was sent by SajhaKirana. If you have any questions, please contact our support team.
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Verification email sent:', info.messageId);

  } catch (error) {
    console.error('Error sending verification email:', error);
    throw new Error('Failed to send verification email');
  }
};

/**
 * Send password reset email to user
 * @param email - User's email address
 * @param resetToken - JWT password reset token
 * @param userName - User's name for personalization
 */
export const sendPasswordResetEmail = async (
  email: string,
  resetToken: string,
  userName: string
): Promise<void> => {
  try {
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;

    const mailOptions = {
      from: `"${process.env.APP_NAME || 'SajhaKirana'}" <${EMAIL_USER}>`,
      to: email,
      subject: 'Reset Your Password',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #333; text-align: center;">Password Reset Request</h2>
          <p>Hi ${userName},</p>
          <p>We received a request to reset your password for your SajhaKirana account. Click the button below to reset your password:</p>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}"
               style="background-color: #dc3545; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Reset Password
            </a>
          </div>

          <p>If the button doesn't work, you can also copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #666;">${resetUrl}</p>

          <p><strong>Important:</strong> This link will expire in 1 hour for security reasons.</p>

          <p>If you didn't request a password reset, please ignore this email. Your password will remain unchanged.</p>

          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
          <p style="color: #666; font-size: 12px; text-align: center;">
            This email was sent by SajhaKirana. If you have any questions, please contact our support team.
          </p>
        </div>
      `,
      text: `
        Password Reset Request

        Hi ${userName},

        We received a request to reset your password for your SajhaKirana account. Visit this link to reset your password:
        ${resetUrl}

        Important: This link will expire in 1 hour for security reasons.

        If you didn't request a password reset, please ignore this email. Your password will remain unchanged.

        This email was sent by SajhaKirana. If you have any questions, please contact our support team.
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Password reset email sent:', info.messageId);

  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw new Error('Failed to send password reset email');
  }
};

/**
 * Test email configuration
 */
export const testEmailConnection = async (): Promise<boolean> => {
  try {
    await transporter.verify();
    console.log('Email server connection successful');
    return true;
  } catch (error) {
    console.error('Email server connection failed:', error);
    return false;
  }
};

/**
 * Send order status update email to customer
 * @param email - Customer's email address
 * @param userName - Customer's name
 * @param orderId - Order ID
 * @param status - New order status
 * @param otp - Delivery OTP (optional, sent when status is shipped)
 */
export const sendOrderStatusEmail = async (
  email: string,
  userName: string,
  orderId: number,
  status: string,
  otp?: string
): Promise<void> => {
  try {
    const statusMessages: Record<string, { subject: string; title: string; message: string; color: string }> = {
      pending: {
        subject: 'Order Received',
        title: 'Order Confirmed',
        message: 'We have received your order and it is being processed.',
        color: '#6B7280'
      },
      processing: {
        subject: 'Order Processing',
        title: 'Order is Being Prepared',
        message: 'Your order is being prepared for shipment.',
        color: '#F59E0B'
      },
      confirmed: {
        subject: 'Order Confirmed',
        title: 'Order Confirmed',
        message: 'Your order has been confirmed and will be shipped soon.',
        color: '#10B981'
      },
      shipped: {
        subject: 'Order Shipped',
        title: 'Your Order is On the Way!',
        message: 'Your order has been shipped and is on its way to you.',
        color: '#3B82F6'
      },
      delivered: {
        subject: 'Order Delivered',
        title: 'Order Delivered Successfully',
        message: 'Your order has been delivered. Thank you for shopping with us!',
        color: '#10B981'
      },
      cancelled: {
        subject: 'Order Cancelled',
        title: 'Order Cancelled',
        message: 'Your order has been cancelled. If you have any questions, please contact our support team.',
        color: '#EF4444'
      }
    };

    const statusInfo = statusMessages[status] || statusMessages['pending'];
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

    const mailOptions = {
      from: `"${process.env.APP_NAME || 'SajhaKirana'}" <${EMAIL_USER}>`,
      to: email,
      subject: `${statusInfo.subject} - Order #${orderId}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: ${statusInfo.color}; color: white; padding: 20px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">${statusInfo.title}</h1>
          </div>
          
          <div style="background-color: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
            <p style="font-size: 16px; color: #374151;">Hi ${userName},</p>
            
            <p style="font-size: 16px; color: #374151; line-height: 1.6;">
              ${statusInfo.message}
            </p>

            <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid ${statusInfo.color};">
              <p style="margin: 0; color: #6B7280; font-size: 14px;">Order ID</p>
              <p style="margin: 5px 0 0 0; color: #111827; font-size: 20px; font-weight: bold;">#${orderId}</p>
            </div>

            ${otp ? `
              <div style="background-color: #FEF3C7; padding: 20px; border-radius: 8px; margin: 20px 0; border: 2px dashed #F59E0B;">
                <p style="margin: 0; color: #92400E; font-size: 14px; font-weight: bold;">🔐 Delivery OTP</p>
                <p style="margin: 10px 0 0 0; color: #78350F; font-size: 28px; font-weight: bold; letter-spacing: 4px;">${otp}</p>
                <p style="margin: 10px 0 0 0; color: #92400E; font-size: 12px;">Please provide this OTP to the delivery person upon receiving your order.</p>
              </div>
            ` : ''}

            <div style="text-align: center; margin: 30px 0;">
              <a href="${frontendUrl}/order/confirmation/${orderId}"
                 style="background-color: ${statusInfo.color}; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
                Track Your Order
              </a>
            </div>

            <p style="color: #6B7280; font-size: 14px; line-height: 1.6;">
              If you have any questions about your order, please don't hesitate to contact our customer support team.
            </p>
          </div>

          <hr style="margin: 30px 0; border: none; border-top: 1px solid #E5E7EB;">
          <p style="color: #9CA3AF; font-size: 12px; text-align: center;">
            This email was sent by ${process.env.APP_NAME || 'SajhaKirana'}.<br>
            © ${new Date().getFullYear()} All rights reserved.
          </p>
        </div>
      `,
      text: `
        ${statusInfo.title}

        Hi ${userName},

        ${statusInfo.message}

        Order ID: #${orderId}
        ${otp ? `\n\nDelivery OTP: ${otp}\nPlease provide this OTP to the delivery person upon receiving your order.` : ''}

        Track your order: ${frontendUrl}/order/confirmation/${orderId}

        If you have any questions about your order, please don't hesitate to contact our customer support team.

        This email was sent by ${process.env.APP_NAME || 'SajhaKirana'}.
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Order status email sent:', info.messageId);

  } catch (error) {
    console.error('Error sending order status email:', error);
    throw new Error('Failed to send order status email');
  }
};
