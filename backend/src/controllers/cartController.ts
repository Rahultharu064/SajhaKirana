import type { Request, Response , NextFunction } from "express";
import { prismaClient } from "../config/client";
// Add item to cart
interface cartitem {
    userId: string;
    productId: string;
    quantity: string;
}


export const addItemToCart = async ( req: Request , res: Response , next: NextFunction ) => {
    try {
        const { userId , productId, quantity } = req.body as cartitem;
        const userIdNum = parseInt(userId);
        const productIdNum = parseInt(productId);
        const quantityNum = parseInt(quantity);
        // Check if the product already exists in the user's cart
        const existingCartItem = await prismaClient.cart.findFirst({
            where: {
                userId: userIdNum,
                productId: productIdNum,
            },
        });
        if (existingCartItem) {
            // If it exists, update the quantity
            const updatedCartItem = await prismaClient.cart.update({
                where: { id: existingCartItem.id },
                data: { quantity: existingCartItem.quantity + quantityNum },
            });
            res.status(200).json(updatedCartItem);
        }
        else {
            // Get product price
            const product = await prismaClient.product.findUnique({
                where: { id: productIdNum },
            });
            if (!product) {
                return res.status(404).json({ error: "Product not found" });
            }
            // If it doesn't exist, create a new cart item
            const newCartItem = await prismaClient.cart.create({
                data: {
                    userId: userIdNum,
                    productId: productIdNum,
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
        await prismaClient.cart.delete({
            where: { id: cartItemIdNum },
        });
        res.status(200).json({ message: "Item removed from cart successfully" });
    } catch (error) {
        next(error);
    }
};


