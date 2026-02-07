import multer from "multer";
export declare const uploadCategories: multer.Multer;
export declare const uploadProducts: multer.Multer;
export declare const uploadProfiles: multer.Multer;
export declare const uploadReviews: multer.Multer;
export declare const deleteImageFile: (imagePath: string | null, folder?: "categories" | "products" | "profiles" | "reviews") => void;
export declare const deleteImageFiles: (imagePaths: string[], folder?: "categories" | "products" | "profiles" | "reviews") => void;
//# sourceMappingURL=multer.d.ts.map