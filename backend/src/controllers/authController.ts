import type { Request, Response, NextFunction } from "express";
import { prismaClient } from "../config/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { string } from "joi";
import { error } from "console";
import { sendVerificationEmail as sendVerificationEmailUtil, sendPasswordResetEmail } from "../utils/verifyEmail";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";
const JWT_EXPIRES_IN = "10days"; // 10days
const COOKIE_OPTIONS ={
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 10 * 24 * 60 * 60 * 1000, // 10 days
}

//POST /auth/register — body: {name,email, password} → 201 { user, accessToken, refreshToken }


export const registerUser = async (req:Request , res:Response , next:NextFunction) : Promise<void>=> {

    try {
        const { name  , email , password , phone, profileImage}: { name:string , email:string , password:string, phone:string, profileImage?:string} = req.body;

        // Check if user already exists
        const existinguiser= await prismaClient.user.findUnique({where: {email}  })
        if (existinguiser) {
         res.status(400).json({ success: false, error: { code: "USER_EXISTS", message: "User with this email already exists" } });
         return;
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        // Create new user
        const newUser = await prismaClient.user.create({
            data: {
                name,
                email,
                phone,
                password: hashedPassword,
                profileImage: profileImage ?? null,
            },
        });
        // Generate JWT token
        const token = jwt.sign({
            userId: newUser.id,
        role :newUser.role
            },
         JWT_SECRET, { expiresIn: JWT_EXPIRES_IN
        })
        res.status(201).json({
            message:"User registered successfully",
            user:{
                userId:newUser.id,
                name:newUser.name,
                email:newUser.email,
                phone:newUser.phone,
                role:newUser.role,
                profileImage:newUser.profileImage
            }
        })
        return ;
    }
        catch (error) {
        res.status(500).json({
            message:"server erro",error:error});
        return ;

        }
    }


    // login with identifier(email or phone) and password

    export const loginUser = async (req:Request, res:Response , next:NextFunction) : Promise<void> =>{
        try {
            const {identifier , password} : {identifier:string , password:string} = req.body;
            // Find user by email or phone
            const user = await prismaClient.user.findFirst ({
                where: {
                    OR: [
                        { email: identifier },
                        { phone: identifier }

                    ]
                }
            })
            if (!user){
                res.status(400).json({ message:"Invalid creditendials"});
                return ;
            }
            const isPasswordValid = await bcrypt.compare(password , user.password);
            if (!isPasswordValid){
                res.status(400).json({ message:"Invalid creditendials"});
                return ;
            }
            // Generate JWT token
            const token = jwt.sign({
                userId: user.id,
                role :user.role
                },
             JWT_SECRET, { expiresIn: JWT_EXPIRES_IN
            })
            res.status(200).json({
                message:"Login successful",
                user:{
                    userId:user.id,
                    name:user.name,
                    email:user.email,
                    phone:user.phone,
                    role:user.role,
                    profileImage:user.profileImage
                }
                })
                return;}

                catch (error) {
                res.status(500).json({
                    message:"server erro",error:error});
                return;
                }
            }


            //logout user
            export const logoutUser = async (req:Request , res:Response , next:NextFunction) : Promise<void>=>{
                try {
                    // Invalidate the token on client side by clearing cookie or token storage
                    res.status(200).json({ message:"Logout successful"});
                    return ;
                } catch (error) {
                    res.status(500).json({
                        message:"server erro",error:error});
                    return ;
                }

            }

            //get current user
            export const getCurrentUser = async (req:Request , res:Response , next:NextFunction) : Promise<void>=>{
                try {
                    const userId = (req as any).user.userId;
                    if (!userId){
                        res.status(401).json({ message:"Unauthorized"});
                        return ;
                    }
                    const user = await prismaClient.user.findUnique({
                        where: { id: userId }
                    });
                    if (!user){
                        res.status(404).json({ message:"User not found"});
                        return ;
                    }
                    res.status(200).json({
                        message:"User fetched successfully",
                        user:{
                            userId:user.id,
                            name:user.name,
                            email:user.email,
                            phone:user.phone,
                            role:user.role,
                            profileImage:user.profileImage
                        }
                    });
                    return ;
                } catch (error) {
                    res.status(500).json({
                        message:"server error",error:error});
                    return ;
                }
            }

            //update user profile
            export const updateProfile = async (req:Request , res:Response , next:NextFunction) : Promise<void>=>{
                try {
                    const userId = (req as any).user.userId;
                    if (!userId){
                        res.status(401).json({ message:"Unauthorized"});
                        return ;
                    }
                    const { name, phone, profileImage }: { name?:string, phone?:string, profileImage?:string } = req.body;

                    const updateData: any = {};
                    if (name) updateData.name = name;
                    if (phone) updateData.phone = phone;
                    if (profileImage !== undefined) updateData.profileImage = profileImage;

                    const updatedUser = await prismaClient.user.update({
                        where: { id: userId },
                        data: updateData
                    });

                    res.status(200).json({
                        message:"Profile updated successfully",
                        user:{
                            userId:updatedUser.id,
                            name:updatedUser.name,
                            email:updatedUser.email,
                            phone:updatedUser.phone,
                            role:updatedUser.role,
                            profileImage:updatedUser.profileImage
                        }
                    });
                    return ;
                } catch (error) {
                    res.status(500).json({
                        message:"server error",error:error});
                    return ;
                }
            }

            // refresht eh token 
            const refreshToken = async (req:Request , res:Response , next:NextFunction) : Promise<void>=>{
                try {
                    const {refreshToken} : {refreshToken:string} = req.body;
                    if (!refreshToken){
                        res.status(400).json({ message:"Refresh token is required"});
                        return ;
                    }
                    // TODO: Implement refresh token logic
                    res.status(200).json({ message:"Token refreshed successfully"});
                    return ;
                } catch (error) {
                    res.status(500).json({
                        message:"server error",error:error});
                    return ;
                }
            }


            // forget password
            export const forgetPassword = async (req:Request , res:Response , next:NextFunction) : Promise<void>=>{
                try {
                    const {email} : {email:string} = req.body;
                    if (!email){
                        res.status(400).json({ message:"Email is required"});
                        return ;
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
                    return ;
                } catch (error) {
                    res.status(500).json({
                        message:"server error",error:error});
                    return ;
                }
            }


            // reset password
            export const resetPassword = async (req:Request , res:Response , next:NextFunction) : Promise<void>=>{
                try {
                    const {token , newPassword} : {token:string , newPassword:string} = req.body;
                    if (!token || !newPassword){
                        res.status(400).json({ message:"Token and new password are required"});
                        return ;
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

                    res.status(200).json({ message:"Password reset successful"});
                    return ;
                } catch (error) {
                    res.status(500).json({
                        message:"server error",error:error});
                    return ;
                }
            }


            // verify email
            export const verifyEmail = async (req:Request , res:Response , next:NextFunction) : Promise<void>=>{
                try {
                    const {token} : {token:string} = req.body;
                    if (!token){
                        res.status(400).json({ message:"Verification token is required"});
                        return ;
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

                    res.status(200).json({ message:"Email verified successfully"});
                    return ;
                } catch (error) {
                    res.status(500).json({
                        message:"server error",error:error});
                    return ;
                }
            }


            // send verification email
            export const sendVerificationEmail = async (req:Request , res:Response , next:NextFunction) : Promise<void>=>{
                try {
                    const userId = (req as any).user.userId;
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
                    return ;
                } catch (error) {
                    res.status(500).json({
                        message:"server error",error:error});
                    return ;
                }
            }
