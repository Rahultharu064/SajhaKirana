import { Router } from "express";
import { getAllUsers, getUserById, updateUser, deleteUser, } from "../controllers/userController";
import { validate } from "../middlewares/validate";
import { requireRole } from "../middlewares/roleMiddleware";
const userRoutes = Router();
// All user routes require admin role
userRoutes.use(requireRole(["ADMIN"]));
// Get all users with pagination and filtering
userRoutes.get("/", getAllUsers);
// Get user by ID
userRoutes.get("/:id", getUserById);
// Update user
userRoutes.put("/:id", updateUser);
// Delete user
userRoutes.delete("/:id", deleteUser);
export default userRoutes;
//# sourceMappingURL=userRoute.js.map