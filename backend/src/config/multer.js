import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Ensure uploads directories exist
const categoriesUploadDir = path.join(__dirname, "../../uploads/categories");
const productsUploadDir = path.join(__dirname, "../../uploads/products");
const profilesUploadDir = path.join(__dirname, "../../uploads/profiles");
const reviewsUploadDir = path.join(__dirname, "../../uploads/reviews");
if (!fs.existsSync(categoriesUploadDir)) {
    fs.mkdirSync(categoriesUploadDir, { recursive: true });
}
if (!fs.existsSync(productsUploadDir)) {
    fs.mkdirSync(productsUploadDir, { recursive: true });
}
if (!fs.existsSync(profilesUploadDir)) {
    fs.mkdirSync(profilesUploadDir, { recursive: true });
}
if (!fs.existsSync(reviewsUploadDir)) {
    fs.mkdirSync(reviewsUploadDir, { recursive: true });
}
// Configure storage for categories
const categoriesStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, categoriesUploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        const name = path.basename(file.originalname, ext).replace(/\s+/g, "-");
        cb(null, `${name}-${uniqueSuffix}${ext}`);
    }
});
// Configure storage for products
const productsStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, productsUploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        const name = path.basename(file.originalname, ext).replace(/\s+/g, "-");
        cb(null, `${name}-${uniqueSuffix}${ext}`);
    }
});
// Configure storage for profiles
const profilesStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, profilesUploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        const name = path.basename(file.originalname, ext).replace(/\s+/g, "-");
        cb(null, `profile-${uniqueSuffix}${ext}`);
    }
});
// Configure storage for reviews (photos and videos)
const reviewsStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, reviewsUploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        const name = path.basename(file.originalname, ext).replace(/\s+/g, "-");
        const mediaType = file.mimetype.startsWith('video/') ? 'video' : 'photo';
        cb(null, `review-${mediaType}-${uniqueSuffix}${ext}`);
    }
});
// File filter to accept only images
const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(new Error("Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed."));
    }
};
// File filter for reviews (images and videos)
const reviewFileFilter = (req, file, cb) => {
    const allowedImageTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
    const allowedVideoTypes = ["video/mp4", "video/webm", "video/quicktime", "video/x-msvideo"];
    const allAllowedTypes = [...allowedImageTypes, ...allowedVideoTypes];
    if (allAllowedTypes.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(new Error("Invalid file type. Only JPEG, PNG, GIF, WebP images and MP4, WebM, MOV, AVI videos are allowed."));
    }
};
// Create multer upload instances
export const uploadCategories = multer({
    storage: categoriesStorage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});
export const uploadProducts = multer({
    storage: productsStorage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit for products
    }
});
export const uploadProfiles = multer({
    storage: profilesStorage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit for profiles
    }
});
export const uploadReviews = multer({
    storage: reviewsStorage,
    fileFilter: reviewFileFilter,
    limits: {
        fileSize: 50 * 1024 * 1024 // 50MB limit for reviews (to accommodate videos)
    }
});
// Helper function to delete image files
export const deleteImageFile = (imagePath, folder = "categories") => {
    if (!imagePath)
        return;
    try {
        let uploadDir;
        if (folder === "products") {
            uploadDir = productsUploadDir;
        }
        else if (folder === "profiles") {
            uploadDir = profilesUploadDir;
        }
        else if (folder === "reviews") {
            uploadDir = reviewsUploadDir;
        }
        else {
            uploadDir = categoriesUploadDir;
        }
        const fullPath = path.join(uploadDir, path.basename(imagePath));
        if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
        }
    }
    catch (error) {
        console.error("Error deleting image file:", error);
    }
};
// Helper function to delete multiple image files
export const deleteImageFiles = (imagePaths, folder = "categories") => {
    if (!Array.isArray(imagePaths))
        return;
    imagePaths.forEach((imagePath) => {
        deleteImageFile(imagePath, folder);
    });
};
//# sourceMappingURL=multer.js.map