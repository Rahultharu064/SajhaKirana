import type { Request, Response, NextFunction } from "express";
import { prismaClient } from "../config/client";

// Get inventory by SKU
export const getInventoryBySku = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { sku } = req.params;

    if (!sku || typeof sku !== "string") {
      return res.status(400).json({
        success: false,
        error: {
          code: "INVALID_SKU",
          message: "SKU is required and must be a string",
        },
      });
    }

    const inventory = await prismaClient.inventory.findUnique({
      where: { sku },
    });

    if (!inventory) {
      return res.status(404).json({
        success: false,
        error: {
          code: "INVENTORY_NOT_FOUND",
          message: "Inventory not found for this SKU",
        },
      });
    }

    return res.status(200).json({
      success: true,
      message: "Inventory retrieved successfully",
      data: {
        sku: inventory.sku,
        stock: inventory.availableStock,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Adjust stock (admin)
export const adjustStock = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { sku, qty, type, note } = req.body;

    // Validate inputs
    const parsedQty = parseInt(qty);
    if (isNaN(parsedQty)) {
      return res.status(400).json({
        success: false,
        error: {
          code: "INVALID_QUANTITY",
          message: "Quantity must be a valid integer",
        },
      });
    }

    if (!["add", "subtract", "set"].includes(type)) {
      return res.status(400).json({
        success: false,
        error: {
          code: "INVALID_TYPE",
          message: "Type must be add, subtract, or set",
        },
      });
    }

    // Check if product exists
    const product = await prismaClient.product.findUnique({
      where: { sku },
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        error: {
          code: "PRODUCT_NOT_FOUND",
          message: "Product not found for this SKU",
        },
      });
    }

    // Get or create inventory
    let inventory = await prismaClient.inventory.findUnique({
      where: { sku },
    });

    if (!inventory) {
      inventory = await prismaClient.inventory.create({
        data: { sku, totalStock: 0, availableStock: 0 },
      });
    }

    let newTotalStock: number;
    let newAvailableStock: number;

    switch (type) {
      case "add":
        newTotalStock = inventory.totalStock + parsedQty;
        newAvailableStock = inventory.availableStock + parsedQty;
        break;
      case "subtract":
        newTotalStock = Math.max(0, inventory.totalStock - parsedQty);
        newAvailableStock = Math.max(0, inventory.availableStock - parsedQty);
        break;
      case "set":
        newTotalStock = Math.max(0, parsedQty);
        newAvailableStock = Math.max(0, parsedQty - (inventory.totalStock - inventory.availableStock));
        break;
      default:
        return res.status(400).json({
          success: false,
          error: {
            code: "INVALID_TYPE",
            message: "Invalid adjustment type",
          },
        });
    }

    // Update inventory
    const updatedInventory = await prismaClient.inventory.update({
      where: { sku },
      data: {
        totalStock: newTotalStock,
        availableStock: newAvailableStock,
      },
    });

    // Log the adjustment (could be stored in a separate table if needed)
    console.log(`Stock adjusted for SKU ${sku}: ${type} ${parsedQty}, note: ${note || "N/A"}`);

    return res.status(200).json({
      success: true,
      message: "Stock adjusted successfully",
      data: {
        sku: updatedInventory.sku,
        totalStock: updatedInventory.totalStock,
        availableStock: updatedInventory.availableStock,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Reserve stock
export const reserveStock = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { orderId, items } = req.body;

    // Validate orderId doesn't already have reservations
    const existingReservations = await prismaClient.reservation.findMany({
      where: { orderId },
    });

    if (existingReservations.length > 0) {
      return res.status(400).json({
        success: false,
        error: {
          code: "ORDER_ALREADY_RESERVED",
          message: "Stock already reserved for this order",
        },
      });
    }

    // Check availability and prepare reservations
    const reservationsToCreate: Array<{ orderId: string; sku: string; quantity: number }> = [];
    for (const item of items) {
      let inventory = await prismaClient.inventory.findUnique({
        where: { sku: item.sku },
      });

      // Create inventory record if it doesn't exist (with 0 stock)
      if (!inventory) {
        inventory = await prismaClient.inventory.create({
          data: {
            sku: item.sku,
            totalStock: 0,
            availableStock: 0
          },
        });
      }

      if (inventory.availableStock < item.qty) {
        return res.status(400).json({
          success: false,
          error: {
            code: "INSUFFICIENT_STOCK",
            message: `Insufficient stock for SKU: ${item.sku}. Available: ${inventory.availableStock}, Requested: ${item.qty}`,
          },
        });
      }

      reservationsToCreate.push({
        orderId,
        sku: item.sku,
        quantity: item.qty,
      });
    }

    // Create reservations in transaction
    await prismaClient.$transaction(async (tx) => {
      // Create reservations
      await tx.reservation.createMany({
        data: reservationsToCreate,
      });

      // Update available stock for each SKU
      for (const item of items) {
        await tx.inventory.update({
          where: { sku: item.sku },
          data: {
            availableStock: {
              decrement: item.qty,
            },
          },
        });
      }
    });

    return res.status(200).json({
      success: true,
      message: "Stock reserved successfully",
      data: {
        orderId,
        items: items.map((item: any) => ({ sku: item.sku, quantity: item.qty })),
      },
    });
  } catch (error) {
    next(error);
  }
};

// Commit reservation
export const commitReservation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { orderId } = req.body;

    // Get reservations for this order
    const reservations = await prismaClient.reservation.findMany({
      where: {
        orderId,
        status: "RESERVED",
      },
    });

    if (reservations.length === 0) {
      return res.status(404).json({
        success: false,
        error: {
          code: "RESERVATIONS_NOT_FOUND",
          message: "No active reservations found for this order",
        },
      });
    }

    // Update reservations to committed
    await prismaClient.reservation.updateMany({
      where: {
        orderId,
        status: "RESERVED",
      },
      data: {
        status: "COMMITTED",
      },
    });

    // Note: Committed stock remains deducted from available stock

    return res.status(200).json({
      success: true,
      message: "Reservations committed successfully",
      data: {
        orderId,
        committedItems: reservations.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Release reservation
export const releaseReservation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { orderId } = req.body;

    // Get reservations for this order
    const reservations = await prismaClient.reservation.findMany({
      where: {
        orderId,
        status: "RESERVED",
      },
    });

    if (reservations.length === 0) {
      return res.status(404).json({
        success: false,
        error: {
          code: "RESERVATIONS_NOT_FOUND",
          message: "No active reservations found for this order",
        },
      });
    }

    // Collect quantities to release per SKU
    const releaseQuantities: { [sku: string]: number } = {};
    for (const res of reservations) {
      releaseQuantities[res.sku] = (releaseQuantities[res.sku] || 0) + res.quantity;
    }

    // Update reservations to released and restore stock in transaction
    await prismaClient.$transaction(async (tx) => {
      // Update reservations
      await tx.reservation.updateMany({
        where: {
          orderId,
          status: "RESERVED",
        },
        data: {
          status: "RELEASED",
        },
      });

      // Restore available stock
      for (const [sku, qty] of Object.entries(releaseQuantities)) {
        await tx.inventory.update({
          where: { sku },
          data: {
            availableStock: {
              increment: qty,
            },
          },
        });
      }
    });

    return res.status(200).json({
      success: true,
      message: "Reservations released successfully",
      data: {
        orderId,
        releasedItems: reservations.length,
        restoredStock: releaseQuantities,
      },
    });
  } catch (error) {
    next(error);
  }
};
