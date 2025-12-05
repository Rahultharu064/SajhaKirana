import type { Request, Response , NextFunction } from "express";
import { prismaClient } from "../config/client";
// Add item to cart
interface CartItemRequest {
    userId: string;
    sku: string;
    quantity: string;
}


export const addItemToCart = async ( req: Request , res: Response , next: NextFunction ) => {
    try {
        const { userId , sku, quantity } = req.body as CartItemRequest;
        const userIdNum = parseInt(userId);
        const quantityNum = parseInt(quantity);
        // Check if the product already exists in the user's cart
        const existingCartItem = await prismaClient.cartItem.findFirst({
            where: {
                userId: userIdNum,
                sku: sku,
            },
        });
        if (existingCartItem) {
            // If it exists, update the quantity
            const updatedCartItem = await prismaClient.cartItem.update({
                where: { id: existingCartItem.id },
                data: { quantity: existingCartItem.quantity + quantityNum },
            });
            res.status(200).json(updatedCartItem);
        }
        else {
            // Get product price
            const product = await prismaClient.product.findUnique({
                where: { sku: sku },
            });
            if (!product) {
                return res.status(404).json({ error: "Product not found" });
            }
            // If it doesn't exist, create a new cart item
            const newCartItem = await prismaClient.cartItem.create({
                data: {
                    userId: userIdNum,
                    sku: sku,
                    quantity: quantityNum,
                    price: product.price,
                },
            });
            res.status(201).json(newCartItem);
        }
    } catch (error) {
        next(error);
    }
};

export const removeItemFromCart = async ( req: Request , res: Response , next: NextFunction ) => {
    try {
        const { cartItemId } = req.params;
        const cartItemIdNum = parseInt(cartItemId as string);
        // Delete the cart item
        await prismaClient.cartItem.delete({
            where: { id: cartItemIdNum },
        });
        res.status(200).json({ message: "Item removed from cart successfully" });
    } catch (error) {
        next(error);
    }
};

export const getCart = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId } = req.params;
        const userIdNum = parseInt(userId as string);
        const cartItems = await prismaClient.cartItem.findMany({
            where: { userId: userIdNum },
            include: {
                user: false, // don't include user data
            },
        });
        const totals = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
        res.status(200).json({ items: cartItems, totals });
    } catch (error) {
        next(error);
    }
};
