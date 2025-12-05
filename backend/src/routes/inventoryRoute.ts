import { Router } from "express";
import {
  getInventoryBySku,
  adjustStock,
  reserveStock,
  commitReservation,
  releaseReservation,
} from "../controllers/inventoryController";
import { validate } from "../middlewares/validate";
import {
  adjustStockSchema,
  reserveStockSchema,
  commitReservationSchema,
  releaseReservationSchema,
  skuParamSchema,
} from "../validators/inventoryValidator";

const inventoryRoutes = Router();

// Get inventory by SKU
inventoryRoutes.get(
  "/sku/:sku",
  validate(skuParamSchema, "params"),
  getInventoryBySku
);

// Adjust stock (admin)
inventoryRoutes.post(
  "/adjust",
  validate(adjustStockSchema, "body"),
  adjustStock
);

// Reserve stock
inventoryRoutes.post(
  "/reserve",
  validate(reserveStockSchema, "body"),
  reserveStock
);

// Commit reservation
inventoryRoutes.post(
  "/commit",
  validate(commitReservationSchema, "body"),
  commitReservation
);

// Release reservation
inventoryRoutes.post(
  "/release",
  validate(releaseReservationSchema, "body"),
  releaseReservation
);

export default inventoryRoutes;
