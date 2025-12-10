import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  updateProfile,
  forgetPassword,
  resetPassword,
  verifyEmail,
  sendVerificationEmail,
} from "../controllers/authController";
import { validate } from "../middlewares/validate";
import { authMiddleware } from "../middlewares/authMiddleware";
import { uploadProfiles } from "../config/multer";
import {
  registerSchema,
  loginSchema,
  passwordResetSchema,
  resetPasswordSchema,
  verifyEmailSchema,
} from "../validators/authValidator";

const authRoutes = Router();

// Register new user
authRoutes.post("/register", validate(registerSchema, "body"), registerUser);

// Login user
authRoutes.post("/login", validate(loginSchema, "body"), loginUser);

// Logout user (protected)
authRoutes.post("/logout", authMiddleware, logoutUser);

// Get current user (protected)
authRoutes.get("/me", authMiddleware, getCurrentUser);

// Get user profile (protected)
authRoutes.get("/profile", authMiddleware, getCurrentUser);

// Update user profile (protected)
authRoutes.put("/profile", uploadProfiles.single("profileImage"), authMiddleware, updateProfile);

// Forget password (send reset link)
authRoutes.post("/forget-password", validate(passwordResetSchema, "body"), forgetPassword);

// Reset password
authRoutes.post("/reset-password", validate(resetPasswordSchema, "body"), resetPassword);

// Verify email
authRoutes.post("/verify-email", validate(verifyEmailSchema, "body"), verifyEmail);

// Send verification email (protected)
authRoutes.post("/send-verification", authMiddleware, sendVerificationEmail);

export default authRoutes;
