import { Router } from "express";
import { searchProducts, getSearchSuggestions } from "../controllers/searchController";
const searchRoutes = Router();
// Main intelligent search
searchRoutes.get("/", searchProducts);
// Smart suggestions and autocomplete
searchRoutes.get("/suggestions", getSearchSuggestions);
export default searchRoutes;
//# sourceMappingURL=searchRoute.js.map