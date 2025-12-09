import type { Request, Response , NextFunction } from "express";
import { prismaClient } from "../config/client";
// Add item to cart
interface CartItemRequest {
    userId: number;
    sku: string;
    quantity: number;
}


export const addItemToCart = async ( req: Request , res: Response , next: NextFunction ) => {
    try {
        const { userId , sku, quantity } = req.body as CartItemRequest;
        console.log('addItemToCart: Received', { userId, sku, quantity, type: typeof userId });
        const userIdNum = userId;
        const quantityNum = quantity;
        // Check if the product already exists in the user's cart
        const existingCartItem = await prismaClient.cartItem.findFirst({
            where: {
                userId: userIdNum,
                sku: sku,
            },
        });
        console.log('addItemToCart: existingCartItem', existingCartItem);
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
            console.log('addItemToCart: product found', product);
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
            console.log('addItemToCart: newCartItem created', newCartItem);
            res.status(201).json(newCartItem);
        }
    } catch (error) {
        console.error('addItemToCart: error', error);
        next(error);
    }
};

export const removeItemFromCart = async ( req: Request , res: Response , next: NextFunction ) => {
    try {
        const { cartItemId } = req.body;
        const cartItemIdNum = parseInt(cartItemId as string);
        // Delete the cart item
        await prismaClient.cartItem.delete({
            where: { id: cartItemIdNum },
        });
        res.status(200).json({ message: "Item removed from cart successfully" });
    } catch (error) {
        console.error('removeItemFromCart: error', error);
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
