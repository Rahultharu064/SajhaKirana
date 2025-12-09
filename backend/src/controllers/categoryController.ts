import type { Request, Response, NextFunction } from "express";
import { prismaClient } from "../config/client";

// Helper to format category image URL
const formatCategory = (category: any) => {
  if (!category) return null;
  if (!category.image) return category;

  // If image already has the path or is a full URL, return as is (normalized)
  if (category.image.startsWith('/uploads/') || category.image.startsWith('http')) {
    return category;
  }

  return {
    ...category,
    image: `/uploads/categories/${category.image}`
  };
};

// Create a new category
export const createCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, slug } = req.body;
    const image = req.file;

    // Check if category with same name already exists
    const existingCategory = await prismaClient.category.findUnique({
      where: { name },
    });

    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: "Category with this name already exists",
      });
    }

    // Check if category with same slug already exists
    const existingSlugCategory = await prismaClient.category.findUnique({
      where: { slug },
    });

    if (existingSlugCategory) {
      return res.status(400).json({
        success: false,
        message: "Category with this slug already exists",
      });
    }

    // Create new category
    const category = await prismaClient.category.create({
      data: {
        name,
        slug,
        image: image ? image.filename : null,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: formatCategory(category),
    });
  } catch (error) {
    next(error);
  }
};

// Get all categories
export const getAllCategories = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const categories = await prismaClient.category.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    const formattedCategories = categories.map(formatCategory);

    return res.status(200).json({
      success: true,
      message: "Categories retrieved successfully",
      data: formattedCategories,
    });
  } catch (error) {
    next(error);
  }
};

// Get category by ID
export const getCategoryById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    // Validate ID
    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID",
      });
    }

    const category = await prismaClient.category.findUnique({
      where: { id: parseInt(id) },
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Category retrieved successfully",
      data: formatCategory(category),
    });
  } catch (error) {
    next(error);
  }
};

// Update category
export const updateCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { name, slug } = req.body;
    const image = req.file;

    // Validate ID
    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID",
      });
    }

    // Validate input fields
    if (name && (typeof name !== 'string' || name.trim().length < 2 || name.length > 100)) {
      return res.status(400).json({
        success: false,
        message: "Category name must be between 2 and 100 characters",
      });
    }

    if (slug && (typeof slug !== 'string' || slug.trim().length < 2 || slug.length > 100)) {
      return res.status(400).json({
        success: false,
        message: "Category slug must be between 2 and 100 characters",
      });
    }

    // Check if category exists
    const existingCategory = await prismaClient.category.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingCategory) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // Check if new name is already taken by another category
    if (name && name.trim() !== existingCategory.name) {
      const duplicateCategory = await prismaClient.category.findUnique({
        where: { name: name.trim() },
      });

      if (duplicateCategory && duplicateCategory.id !== parseInt(id)) {
        return res.status(400).json({
          success: false,
          message: "Category with this name already exists",
        });
      }
    }

    // Check if new slug is already taken by another category
    if (slug && slug.trim() !== existingCategory.slug) {
      const duplicateSlugCategory = await prismaClient.category.findUnique({
        where: { slug: slug.trim() },
      });

      if (duplicateSlugCategory && duplicateSlugCategory.id !== parseInt(id)) {
        return res.status(400).json({
          success: false,
          message: "Category with this slug already exists",
        });
      }
    }

    // Prepare update data
    const updateData: any = {};
    if (name) updateData.name = name.trim();
    if (slug) updateData.slug = slug.trim();
    if (image) updateData.image = image.filename;

    // Update category
    const updatedCategory = await prismaClient.category.update({
      where: { id: parseInt(id) },
      data: updateData,
    });

    return res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: formatCategory(updatedCategory),
    });
  } catch (error) {
    console.error("Update category error:", error);
    next(error);
  }
};

// Delete category
export const deleteCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    // Validate ID
    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID",
      });
    }

    // Check if category exists
    const existingCategory = await prismaClient.category.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingCategory) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // Delete category
    await prismaClient.category.delete({
      where: { id: parseInt(id) },
    });

    return res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Search categories
export const searchCategories = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { search } = req.query;

    if (!search || typeof search !== "string") {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      });
    }

    const categories = await prismaClient.category.findMany({
      where: {
        name: {
          contains: search,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const formattedCategories = categories.map(formatCategory);

    return res.status(200).json({
      success: true,
      message: "Categories retrieved successfully",
      data: formattedCategories,
    });
  } catch (error) {
    next(error);
  }
};
