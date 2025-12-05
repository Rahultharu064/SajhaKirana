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
