import { Router } from "express";
import { addItemToCart , removeItemFromCart} from "../controllers/cartController";
import { addtoCartSchema , removeFromCartSchema } from "../validators/cartValidator";


const cartRoutes = Router();

