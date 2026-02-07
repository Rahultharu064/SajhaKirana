import { prismaClient } from "../config/client";
// Helper to format user data (exclude sensitive information)
const formatUser = (user) => {
    if (!user)
        return null;
    const { password, resetPasswordToken, resetPasswordExpires, ...safeUser } = user;
    if (safeUser.profileImage && !safeUser.profileImage.startsWith('/uploads/') && !safeUser.profileImage.startsWith('http')) {
        safeUser.profileImage = `/uploads/profiles/${safeUser.profileImage}`;
    }
    return safeUser;
};
// Get all users (admin only)
export const getAllUsers = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, search, role } = req.query;
        const pageNum = parseInt(page, 10) || 1;
        const limitNum = parseInt(limit, 10) || 10;
        const skip = (pageNum - 1) * limitNum;
        const whereConditions = {};
        if (search && typeof search === "string" && search.trim()) {
            whereConditions.OR = [
                { name: { contains: search.trim(), mode: 'insensitive' } },
                { email: { contains: search.trim(), mode: 'insensitive' } },
            ];
        }
        if (role && typeof role === "string") {
            whereConditions.role = role;
        }
        // Exclude admin users from user management
        whereConditions.role = { not: 'ADMIN' };
        const users = await prismaClient.user.findMany({
            where: whereConditions,
            skip,
            take: limitNum,
            orderBy: {
                createdAt: "desc",
            },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                role: true,
                profileImage: true,
                createdAt: true,
                updatedAt: true,
                _count: {
                    select: {
                        orders: true,
                        carts: true,
                    },
                },
            },
        });
        const total = await prismaClient.user.count({
            where: whereConditions,
        });
        const formattedUsers = users.map(formatUser);
        return res.status(200).json({
            success: true,
            message: "Users retrieved successfully",
            data: formattedUsers,
            pagination: {
                page: pageNum,
                limit: limitNum,
                total,
                pages: Math.ceil(total / limitNum),
            },
        });
    }
    catch (error) {
        next(error);
    }
};
// Get user by ID (admin only)
export const getUserById = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!id || isNaN(parseInt(id))) {
            return res.status(400).json({
                success: false,
                message: "Invalid user ID",
            });
        }
        const user = await prismaClient.user.findUnique({
            where: { id: parseInt(id) },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                role: true,
                profileImage: true,
                createdAt: true,
                updatedAt: true,
                _count: {
                    select: {
                        orders: true,
                        carts: true,
                    },
                },
            },
        });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        return res.status(200).json({
            success: true,
            message: "User retrieved successfully",
            data: formatUser(user),
        });
    }
    catch (error) {
        next(error);
    }
};
// Update user (admin only)
export const updateUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, phone, role } = req.body;
        if (!id || isNaN(parseInt(id))) {
            return res.status(400).json({
                success: false,
                message: "Invalid user ID",
            });
        }
        const existingUser = await prismaClient.user.findUnique({
            where: { id: parseInt(id) },
        });
        if (!existingUser) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        // Prevent admin from modifying other admin accounts
        if (existingUser.role === 'ADMIN') {
            return res.status(403).json({
                success: false,
                message: "Cannot modify admin accounts",
            });
        }
        // Validate role
        if (role && !['USER', 'ADMIN'].includes(role)) {
            return res.status(400).json({
                success: false,
                message: "Invalid role. Must be USER or ADMIN",
            });
        }
        const updateData = {};
        if (name && typeof name === 'string')
            updateData.name = name.trim();
        if (phone && typeof phone === 'string')
            updateData.phone = phone.trim();
        if (role)
            updateData.role = role;
        const updatedUser = await prismaClient.user.update({
            where: { id: parseInt(id) },
            data: updateData,
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                role: true,
                profileImage: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        return res.status(200).json({
            success: true,
            message: "User updated successfully",
            data: formatUser(updatedUser),
        });
    }
    catch (error) {
        next(error);
    }
};
// Delete user (admin only) - soft delete by marking as inactive if they have orders
export const deleteUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!id || isNaN(parseInt(id))) {
            return res.status(400).json({
                success: false,
                message: "Invalid user ID",
            });
        }
        const existingUser = await prismaClient.user.findUnique({
            where: { id: parseInt(id) },
            include: {
                _count: {
                    select: {
                        orders: true,
                    },
                },
            },
        });
        if (!existingUser) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        // Prevent admin from deleting other admin accounts
        if (existingUser.role === 'ADMIN') {
            return res.status(403).json({
                success: false,
                message: "Cannot delete admin accounts",
            });
        }
        // If user has orders, mark as inactive instead of deleting
        if (existingUser._count.orders > 0) {
            await prismaClient.user.update({
                where: { id: parseInt(id) },
                data: { role: 'INACTIVE' }, // Assuming you add an INACTIVE role
            });
            return res.status(200).json({
                success: true,
                message: "User marked as inactive (has existing orders)",
            });
        }
        // Otherwise, hard delete
        await prismaClient.user.delete({
            where: { id: parseInt(id) },
        });
        return res.status(200).json({
            success: true,
            message: "User deleted successfully",
        });
    }
    catch (error) {
        next(error);
    }
};
//# sourceMappingURL=userController.js.map