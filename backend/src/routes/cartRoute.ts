import { Router } from "express";
import { addItemToCart , removeItemFromCart} from "../controllers/cartController";
import { addtoCartSchema , removeFromCartSchema } from "../validators/cartValidator";
import { validate } from "../middlewares/validate";


const cartRoutes = Router();

// Add item to cart with validation
cartRoutes.post(
    "/add",
    validate(addtoCartSchema, "body"),
    addItemToCart
);
// Remove item from cart with validation
cartRoutes.post(
    "/remove",
    validate(removeFromCartSchema, "body"),
    removeItemFromCart
);
export default cartRoutes;

