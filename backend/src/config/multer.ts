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

if (!fs.existsSync(categoriesUploadDir)) {
    fs.mkdirSync(categoriesUploadDir, { recursive: true });
}

if (!fs.existsSync(productsUploadDir)) {
    fs.mkdirSync(productsUploadDir, { recursive: true });
}

if (!fs.existsSync(profilesUploadDir)) {
    fs.mkdirSync(profilesUploadDir, { recursive: true });
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

// File filter to accept only images
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowedMimeTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];

    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed."));
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

// Helper function to delete image files
export const deleteImageFile = (imagePath: string | null, folder: "categories" | "products" | "profiles" = "categories") => {
    if (!imagePath) return;

    try {
        let uploadDir: string;
        if (folder === "products") {
            uploadDir = productsUploadDir;
        } else if (folder === "profiles") {
            uploadDir = profilesUploadDir;
        } else {
            uploadDir = categoriesUploadDir;
        }
        const fullPath = path.join(uploadDir, path.basename(imagePath));
        if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
        }
    } catch (error) {
        console.error("Error deleting image file:", error);
    }
};

// Helper function to delete multiple image files
export const deleteImageFiles = (imagePaths: string[], folder: "categories" | "products" | "profiles" = "categories") => {
    if (!Array.isArray(imagePaths)) return;

    imagePaths.forEach((imagePath) => {
        deleteImageFile(imagePath, folder);
    });
};
