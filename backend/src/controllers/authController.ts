import type { Request, Response, NextFunction } from "express";
import { prismaClient } from "../config/client";
import { Prisma } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { sendVerificationEmail as sendVerificationEmailUtil, sendPasswordResetEmail } from "../utils/verifyEmail";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";
const JWT_EXPIRES_IN = "10d"; // shorter token example

export const registerUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { name, email, password, phone } = req.body as {
            name?: string;
            email?: string;
            password?: string;
            phone?: string;
        };

        // Basic validation
        if (!name || !email || !password) {
            res.status(400).json({ success: false, error: { code: "INVALID_INPUT", message: "name, email and password are required" } });
            return;
        }
        if (typeof password !== "string" || password.length < 6) {
            res.status(400).json({ success: false, error: { code: "WEAK_PASSWORD", message: "Password must be at least 6 characters" } });
            return;
        }

        // Use findFirst to avoid findUnique errors if email is not unique in schema
        const existingUser = await prismaClient.user.findFirst({
            where: { email },
            select: { id: true, name: true, email: true, password: true } // only select columns that exist in current database
        });
        if (existingUser) {
            res.status(409).json({ success: false, error: { code: "USER_EXISTS", message: "User with this email already exists" } });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prismaClient.user.create({
            data: {
                name,
                email,
                phone: phone ?? null, // added back since phone exists in schema
                password: hashedPassword,
            },
        });

        const token = jwt.sign(
            { userId: newUser.id, role: newUser.role ?? "user" },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: {
                userId: newUser.id,
                name: newUser.name,
                email: newUser.email,
                phone: newUser.phone,
                role: newUser.role,
            },
            token,
        });
        return;
    } catch (error: any) {
        // Prisma unique constraint error (duplicate)
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
            res.status(409).json({ success: false, error: { code: "UNIQUE_CONSTRAINT", message: "A user with that unique field already exists." } });
            return;
        }

        console.error("Error in registerUser:", error && (error.stack || error.message || error));
        res.status(500).json({ success: false, error: { code: "SERVER_ERROR", message: "Internal server error" } });
        return;
    }
};

// login with identifier(email or phone) and password

export const loginUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { identifier, password }: { identifier: string, password: string } = req.body;
        // Find user by email (phone check temporarily commented out due to missing column in database)
        const user = await prismaClient.user.findFirst({
            where: {
                email: identifier

            },
            select: { id: true, name: true, email: true, password: true } // only select columns that exist in current database
        })
        if (!user) {
            res.status(400).json({ message: "Invalid creditendials" });
            return;
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(400).json({ message: "Invalid creditendials" });
            return;
        }

        // Update last login timestamp
        await prismaClient.user.update({
            where: { id: user.id },
            data: { lastLogin: new Date() }
        });

        // Generate JWT token
        const token = jwt.sign({
            userId: user.id,
            role: (user as any).role ?? "customer" // fallback since role column may not exist yet
        },
            JWT_SECRET, {
            expiresIn: JWT_EXPIRES_IN
        })
        res.status(200).json({
            message: "Login successful",
            user: {
                userId: user.id,
                name: user.name,
                email: user.email,
                phone: (user as any).phone ?? null, // fallback since phone column may not exist yet
                address: (user as any).address ?? null, // fallback since address column may not exist yet
                role: (user as any).role ?? "customer" // fallback since role column may not exist yet
            },
            token
        })
        return;
    }

    catch (error) {
        res.status(500).json({
            message: "server erro", error: error
        });
        return;
    }
}


//logout user
export const logoutUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        // Invalidate the token on client side by clearing cookie or token storage
        res.status(200).json({ message: "Logout successful" });
        return;
    } catch (error) {
        res.status(500).json({
            message: "server erro", error: error
        });
        return;
    }

}

//get current user
export const getCurrentUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        console.log('getCurrentUser: Request user object:', (req as any).user);
        const userId = (req as any).user?.id;
        if (!userId) {
            console.log('getCurrentUser: No userId found, returning 401');
            res.status(401).json({ message: "Unauthorized", debug: 'No userId in request.user' });
            return;
        }

        console.log('getCurrentUser: Fetching user with ID:', userId);
        const user = await prismaClient.user.findUnique({
            where: { id: userId }
        });
        if (!user) {
            console.log('getCurrentUser: User not found in database, returning 401');
            res.status(401).json({ message: "User not authenticated" });
            return;
        }
        res.status(200).json({
            message: "User fetched successfully",
            user: {
                userId: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                role: (user as any).role ?? "customer", // fallback since role column may not exist yet
                profileImage: user.profileImage,
                lastLogin: user.lastLogin
            }
        });
        return;
    } catch (error) {
        res.status(500).json({
            message: "server error", error: error
        });
        return;
    }
}

//update user profile
export const updateProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = (req as any).user.id;
        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const { name, phone, address }: { name?: string, phone?: string, address?: string } = req.body;

        const updateData: any = {};
        if (name) updateData.name = name;
        if (phone) updateData.phone = phone;
        if (address !== undefined) updateData.address = address;

        // Handle profile image upload
        if (req.file) {
            // Get current user to check for existing profile image
            const currentUser = await prismaClient.user.findUnique({
                where: { id: userId }
            });

            // Delete old profile image if exists
            if (currentUser?.profileImage) {
                const { deleteImageFile } = await import("../config/multer");
                deleteImageFile(currentUser.profileImage, "profiles");
            }

            // Set new profile image path
            updateData.profileImage = req.file.filename;
        }

        const updatedUser = await prismaClient.user.update({
            where: { id: userId },
            data: updateData
        });

        res.status(200).json({
            message: "Profile updated successfully",
            user: {
                userId: updatedUser.id,
                name: updatedUser.name,
                email: updatedUser.email,
                phone: updatedUser.phone,
                address: updatedUser.address,
                role: (updatedUser as any).role ?? "customer", // fallback since role column may not exist yet
                profileImage: updatedUser.profileImage,
                lastLogin: updatedUser.lastLogin
            }
        });
        return;
    } catch (error) {
        res.status(500).json({
            message: "server error", error: error
        });
        return;
    }
}

// refresht eh token
const refreshToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { refreshToken }: { refreshToken: string } = req.body;
        if (!refreshToken) {
            res.status(400).json({ message: "Refresh token is required" });
            return;
        }
        // TODO: Implement refresh token logic
        res.status(200).json({ message: "Token refreshed successfully" });
        return;
    } catch (error) {
        res.status(500).json({
            message: "server error", error: error
        });
        return;
    }
}


// forget password
export const forgetPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { email }: { email: string } = req.body;
        if (!email) {
            res.status(400).json({ message: "Email is required" });
            return;
        }

        const user = await prismaClient.user.findUnique({ where: { email } });
        if (!user) {
            // Don't reveal if email exists or not for security
            res.status(200).json({ message: "If the email exists, a password reset link has been sent" });
            return;
        }

        // Generate reset token (simple implementation - in production use JWT or secure tokens)
        const resetToken = jwt.sign(
            { userId: user.id, type: 'password_reset' },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Send password reset email
        try {
            await sendPasswordResetEmail(user.email, resetToken, user.name);
            res.status(200).json({ message: "Password reset link sent to email" });
        } catch (emailError) {
            console.error('Failed to send password reset email:', emailError);
            res.status(500).json({ message: "Failed to send password reset email" });
        }
        return;
    } catch (error) {
        res.status(500).json({
            message: "server error", error: error
        });
        return;
    }
}


// reset password
export const resetPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { token, newPassword }: { token: string, newPassword: string } = req.body;
        if (!token || !newPassword) {
            res.status(400).json({ message: "Token and new password are required" });
            return;
        }

        // Verify token
        let decoded;
        try {
            decoded = jwt.verify(token, JWT_SECRET) as { userId: number; type: string };
            if (decoded.type !== 'password_reset') {
                throw new Error('Invalid token type');
            }
        } catch (error) {
            res.status(400).json({ message: "Invalid or expired reset token" });
            return;
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update user password
        await prismaClient.user.update({
            where: { id: decoded.userId },
            data: { password: hashedPassword }
        });

        res.status(200).json({ message: "Password reset successful" });
        return;
    } catch (error) {
        res.status(500).json({
            message: "server error", error: error
        });
        return;
    }
}


// verify email
export const verifyEmail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { token }: { token: string } = req.body;
        if (!token) {
            res.status(400).json({ message: "Verification token is required" });
            return;
        }

        // Verify token
        let decoded;
        try {
            decoded = jwt.verify(token, JWT_SECRET) as { userId: number; type: string };
            if (decoded.type !== 'email_verification') {
                throw new Error('Invalid token type');
            }
        } catch (error) {
            res.status(400).json({ message: "Invalid or expired verification token" });
            return;
        }

        // TODO: Add isVerified field to User model in schema.prisma
        // For now, just mark as verified (you can add a field later)
        // await prismaClient.user.update({
        //     where: { id: decoded.userId },
        //     data: { isVerified: true }
        // });

        res.status(200).json({ message: "Email verified successfully" });
        return;
    } catch (error) {
        res.status(500).json({
            message: "server error", error: error
        });
        return;
    }
}


// send verification email
export const sendVerificationEmail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = (req as any).user.id;
        const user = await prismaClient.user.findUnique({ where: { id: userId } });
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        // Generate verification token
        const verificationToken = jwt.sign(
            { userId: user.id, type: 'email_verification' },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Send verification email
        try {
            await sendVerificationEmailUtil(user.email, verificationToken, user.name);
            res.status(200).json({ message: "Verification email sent" });
        } catch (emailError) {
            console.error('Failed to send verification email:', emailError);
            res.status(500).json({ message: "Failed to send verification email" });
        }
        return;
    } catch (error) {
        res.status(500).json({
            message: "server error", error: error
        });
        return;
    }
}

// Admin login function
export const loginAdmin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { identifier, password }: { identifier: string, password: string } = req.body;

        console.log('[Admin Login] Attempting login for:', identifier);

        // First, check if user exists at all
        const userExists = await prismaClient.user.findFirst({
            where: { email: identifier },
            select: { id: true, email: true, role: true }
        });

        if (!userExists) {
            console.log('[Admin Login] User not found:', identifier);
            res.status(401).json({
                success: false,
                message: "Invalid credentials",
                error: "User with this email does not exist"
            });
            return;
        }

        // Check if user has admin role
        if (userExists.role !== 'admin') {
            console.log('[Admin Login] User exists but is not an admin. Role:', userExists.role);
            res.status(401).json({
                success: false,
                message: "Access denied",
                error: "This account does not have admin privileges. Please use the regular login."
            });
            return;
        }

        // Find admin user with password
        const user = await prismaClient.user.findFirst({
            where: {
                AND: [
                    { email: identifier },
                    { role: 'admin' }
                ]
            },
            select: { id: true, name: true, email: true, password: true, role: true, profileImage: true, lastLogin: true }
        });

        if (!user) {
            console.log('[Admin Login] Unexpected error: Admin user not found in second query');
            res.status(401).json({
                success: false,
                message: "Invalid admin credentials"
            });
            return;
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            console.log('[Admin Login] Invalid password for:', identifier);
            res.status(401).json({
                success: false,
                message: "Invalid credentials",
                error: "Incorrect password"
            });
            return;
        }

        console.log('[Admin Login] Login successful for:', identifier);

        // Update last login timestamp
        await prismaClient.user.update({
            where: { id: user.id },
            data: { lastLogin: new Date() }
        });

        // Generate JWT token with admin role
        const token = jwt.sign({
            userId: user.id,
            role: user.role
        },
            JWT_SECRET, {
            expiresIn: JWT_EXPIRES_IN
        });

        res.status(200).json({
            success: true,
            message: "Admin login successful",
            user: {
                userId: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                profileImage: user.profileImage,
                lastLogin: user.lastLogin
            },
            token
        });
        return;
    } catch (error) {
        console.error('[Admin Login] Server error:', error);
        res.status(500).json({
            success: false,
            message: "Server error during admin login",
            error: error
        });
        return;
    }
};

// Create admin user (for initial setup)
export const createAdmin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { name, email, password, phone } = req.body as {
            name?: string;
            email?: string;
            password?: string;
            phone?: string;
        };

        // Basic validation
        if (!name || !email || !password) {
            res.status(400).json({ success: false, error: { code: "INVALID_INPUT", message: "name, email and password are required" } });
            return;
        }
        if (typeof password !== "string" || password.length < 6) {
            res.status(400).json({ success: false, error: { code: "WEAK_PASSWORD", message: "Password must be at least 6 characters" } });
            return;
        }

        // Check if admin already exists
        const existingAdmin = await prismaClient.user.findFirst({
            where: { role: 'admin' }
        });

        const hashedPassword = await bcrypt.hash(password, 10);

        const newAdmin = await prismaClient.user.create({
            data: {
                name,
                email,
                phone: phone ?? null,
                password: hashedPassword,
                role: 'admin',
            },
        });

        const token = jwt.sign(
            { userId: newAdmin.id, role: newAdmin.role },
            JWT_SECRET,
            { expiresIn: '24h' } // Longer expiration for initial admin setup
        );

        res.status(201).json({
            success: true,
            message: "Admin user created successfully",
            isFirstAdmin: !existingAdmin,
            user: {
                userId: newAdmin.id,
                name: newAdmin.name,
                email: newAdmin.email,
                phone: newAdmin.phone,
                role: newAdmin.role,
            },
            token,
        });
        return;
    } catch (error: any) {
        // Prisma unique constraint error (duplicate)
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
            res.status(409).json({ success: false, error: { code: "USER_EXISTS", message: "User with that email already exists" } });
            return;
        }

        console.error("Error in createAdmin:", error && (error.stack || error.message || error));
        res.status(500).json({ success: false, error: { code: "SERVER_ERROR", message: "Internal server error" } });
        return;
    }
};
