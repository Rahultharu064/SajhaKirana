import type { Request, Response, NextFunction } from "express";
import { prismaClient } from "../config/client";

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
      data: category,
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

    return res.status(200).json({
      success: true,
      message: "Categories retrieved successfully",
      data: categories,
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
      data: category,
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
    const { name } = req.body;

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

    // Check if new name is already taken by another category
    if (name) {
      const duplicateCategory = await prismaClient.category.findUnique({
        where: { name },
      });

      if (duplicateCategory && duplicateCategory.id !== parseInt(id)) {
        return res.status(400).json({
          success: false,
          message: "Category with this name already exists",
        });
      }
    }

    // Update category
    const updatedCategory = await prismaClient.category.update({
      where: { id: parseInt(id) },
      data: {
        ...(name && { name }),
      },
    });

    return res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: updatedCategory,
    });
  } catch (error) {
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

    return res.status(200).json({
      success: true,
      message: "Categories retrieved successfully",
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};
