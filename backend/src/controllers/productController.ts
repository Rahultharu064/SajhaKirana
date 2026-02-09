import type { Request, Response, NextFunction } from "express";
import { prismaClient } from "../config/client";
import { deleteImageFiles } from "../config/multer";
import { knowledgeService } from "../services/knowledgeService";

const generateSlug = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// Create a new product
export const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let { title, slug, description, price, mrp, stock, categoryId, isActive, sku } =
      req.body;

    if (!slug && title) {
      slug = generateSlug(title);
    } else if (slug) {
      slug = generateSlug(slug);
    }

    const parsedPrice = parseFloat(price);
    const parsedMrp = parseFloat(mrp);
    const parsedStock = parseInt(stock);
    const parsedCategoryId = parseInt(categoryId);

    if (isNaN(parsedPrice) || isNaN(parsedMrp) || isNaN(parsedStock) || isNaN(parsedCategoryId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid numeric values for price, mrp, stock, or categoryId",
      });
    }

    const files = (req as any).files;
    let imagePaths: string[] = [];

    if (files && Array.isArray(files) && files.length > 0) {
      imagePaths = files.map((file) => `/uploads/products/${file.filename}`);
    } else if (!files || files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one product image is required",
      });
    }

    const existingProductByTitle = await prismaClient.product.findUnique({
      where: { title },
    });

    if (existingProductByTitle) {
      deleteImageFiles(imagePaths, "products");
      return res.status(400).json({
        success: false,
        message: "A product with this title already exists",
      });
    }

    const existingProductBySlug = await prismaClient.product.findUnique({
      where: { slug },
    });

    if (existingProductBySlug) {
      deleteImageFiles(imagePaths, "products");
      return res.status(400).json({
        success: false,
        message: "A product with this slug already exists",
      });
    }

    const product = await prismaClient.product.create({
      data: {
        title,
        slug,
        sku,
        description,
        price: parsedPrice,
        mrp: parsedMrp,
        stock: parsedStock,
        categoryId: parsedCategoryId,
        images: JSON.stringify(imagePaths),
        isActive: isActive !== undefined ? isActive === 'true' || isActive === true : true,
      },
      include: {
        category: true,
      },
    });

    // Auto-index in vector database
    knowledgeService.updateProduct(product.id).catch(err => console.error('Failed to index product:', err));

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: {
        ...product,
        images: JSON.parse(product.images),
      },
    });
  } catch (error) {
    const files = (req as any).files;
    if (files && Array.isArray(files)) {
      const imagePaths = files.map((file) => `/uploads/products/${file.filename}`);
      deleteImageFiles(imagePaths, "products");
    }
    next(error);
  }
};

// Get all products with filters and pagination
export const getAllProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      q,
      category,
      priceMin,
      priceMax,
      sort = "newest",
      page = 1,
      limit = 10,
      isActive,
      inStock,
    } = req.query;

    const where: any = {};

    if (isActive !== undefined) {
      where.isActive = isActive === "true";
    }

    if (q && typeof q === "string") {
      where.OR = [
        { title: { contains: q } },
        { description: { contains: q } },
        { sku: { contains: q } },
      ];
    }

    if (category) {
      const categoryIds = (category as string).split(',').map(id => parseInt(id)).filter(id => !isNaN(id));
      if (categoryIds.length > 0) {
        where.categoryId = { in: categoryIds };
      }
    }

    if (priceMin || priceMax) {
      where.price = {};
      if (priceMin) where.price.gte = parseFloat(priceMin as string);
      if (priceMax) where.price.lte = parseFloat(priceMax as string);
    }

    if (inStock === 'true') {
      where.stock = { gt: 0 };
    }

    const orderByMap: any = {
      newest: { createdAt: "desc" },
      oldest: { createdAt: "asc" },
      priceLow: { price: "asc" },
      priceHigh: { price: "desc" },
      popular: { reviews: { _count: "desc" } },
    };

    const orderBy = orderByMap[sort as string] || { createdAt: "desc" };
    const pageNum = Math.max(1, parseInt(page as string) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit as string) || 10));
    const skip = (pageNum - 1) * limitNum;

    const [products, total] = await Promise.all([
      prismaClient.product.findMany({
        where,
        include: {
          category: true,
          _count: {
            select: { reviews: true }
          }
        },
        orderBy,
        skip,
        take: limitNum,
      }),
      prismaClient.product.count({ where }),
    ]);

    const productsResponse = products.map((product: any) => ({
      ...product,
      images: JSON.parse(product.images),
    }));

    return res.status(200).json({
      success: true,
      data: productsResponse,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get product by ID
export const getProductById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id as string;
    const product = await prismaClient.product.findUnique({
      where: { id: parseInt(id) },
      include: {
        category: true,
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                profileImage: true,
              }
            }
          }
        }
      },
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        ...product,
        images: JSON.parse(product.images),
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get product by slug
export const getProductBySlug = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const slug = req.params.slug as string;
    const product = await prismaClient.product.findUnique({
      where: { slug: slug },
      include: {
        category: true,
      },
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        ...product,
        images: JSON.parse(product.images),
      },
    });
  } catch (error) {
    next(error);
  }
};

// Update product
export const updateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id as string;
    if (!id) return res.status(400).json({ success: false, message: "ID is required" });
    let { title, slug, description, price, mrp, stock, categoryId, isActive, sku } = req.body;

    const existingProduct = await prismaClient.product.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (slug) {
      slug = generateSlug(slug);
    } else if (title && title !== existingProduct.title) {
      slug = generateSlug(title);
    }

    // Handle images
    let imagePaths: string[] = JSON.parse(existingProduct.images);
    const files = (req as any).files;

    if (files && Array.isArray(files) && files.length > 0) {
      deleteImageFiles(imagePaths, "products");
      imagePaths = files.map((file) => `/uploads/products/${file.filename}`);
    }

    const updateData: any = {};
    if (title) updateData.title = title;
    if (slug) updateData.slug = slug;
    if (sku) updateData.sku = sku;
    if (description) updateData.description = description;
    if (price) updateData.price = parseFloat(price);
    if (mrp) updateData.mrp = parseFloat(mrp);
    if (stock) updateData.stock = parseInt(stock);
    if (categoryId) updateData.categoryId = parseInt(categoryId);
    if (imagePaths.length > 0) updateData.images = JSON.stringify(imagePaths);
    if (isActive !== undefined) updateData.isActive = isActive === 'true' || isActive === true;

    const updatedProduct = await prismaClient.product.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: {
        category: true,
      },
    });

    // Update in vector database
    knowledgeService.updateProduct(updatedProduct.id).catch(err => console.error('Failed to update index:', err));

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: {
        ...updatedProduct,
        images: JSON.parse(updatedProduct.images),
      },
    });
  } catch (error) {
    next(error);
  }
};

// Delete product
export const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id as string;
    if (!id) return res.status(400).json({ success: false, message: "ID is required" });
    const product = await prismaClient.product.findUnique({
      where: { id: parseInt(id) },
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const imagePaths = JSON.parse(product.images);
    deleteImageFiles(imagePaths, "products");

    await prismaClient.product.delete({
      where: { id: parseInt(id) },
    });

    // Remove from vector database
    knowledgeService.deleteProduct(parseInt(id)).catch(err => console.error('Failed to remove from index:', err));

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Search products
export const searchProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { q, page = 1, limit = 10 } = req.query;

    if (!q || typeof q !== "string") {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      });
    }

    const pageNum = parseInt(page as string) || 1;
    const limitNum = parseInt(limit as string) || 10;
    const skip = (pageNum - 1) * limitNum;

    const [products, total] = await Promise.all([
      prismaClient.product.findMany({
        where: {
          isActive: true,
          OR: [
            { title: { contains: q } },
            { description: { contains: q } },
          ],
        },
        include: { category: true },
        skip,
        take: limitNum,
      }),
      prismaClient.product.count({
        where: {
          isActive: true,
          OR: [
            { title: { contains: q } },
            { description: { contains: q } },
          ],
        },
      }),
    ]);

    return res.status(200).json({
      success: true,
      data: products.map(p => ({ ...p, images: JSON.parse(p.images) })),
      pagination: { total, page: pageNum, limit: limitNum, pages: Math.ceil(total / limitNum) },
    });
  } catch (error) {
    next(error);
  }
};

// Get products by category
export const getProductsByCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const categoryId = req.params.categoryId as string;
    const products = await prismaClient.product.findMany({
      where: {
        categoryId: parseInt(categoryId),
        isActive: true,
      },
      include: { category: true },
    });

    return res.status(200).json({
      success: true,
      data: products.map(p => ({ ...p, images: JSON.parse(p.images) })),
    });
  } catch (error) {
    next(error);
  }
};

// Update product stock
export const updateProductStock = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id as string;
    if (!id) return res.status(400).json({ success: false, message: "ID is required" });
    const { stock } = req.body;

    const updatedProduct = await prismaClient.product.update({
      where: { id: parseInt(id) },
      data: { stock: parseInt(stock) },
    });

    // Update in vector database
    knowledgeService.updateProduct(parseInt(id)).catch(err => console.error('Failed to update index:', err));

    return res.status(200).json({
      success: true,
      message: "Stock updated successfully",
      data: updatedProduct,
    });
  } catch (error) {
    next(error);
  }
};

// Bulk import products
export const bulkImportProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const products = req.body;

    if (!Array.isArray(products)) {
      return res.status(400).json({
        success: false,
        message: "Products must be an array",
      });
    }

    const results = await prismaClient.product.createMany({
      data: products.map(p => ({
        ...p,
        images: JSON.stringify(p.images || []),
      })),
      skipDuplicates: true,
    });

    // Trigger full re-index for bulk imports
    knowledgeService.indexAll().catch(err => console.error('Failed to re-index after bulk import:', err));

    return res.status(201).json({
      success: true,
      message: `${results.count} products imported successfully`,
    });
  } catch (error) {
    next(error);
  }
};

// Get autocomplete suggestions
export const getAutocompleteSuggestions = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { q } = req.query;
    if (!q || typeof q !== "string") return res.json({ success: true, data: [] });

    const products = await prismaClient.product.findMany({
      where: {
        isActive: true,
        title: { contains: q },
      },
      select: { id: true, title: true, slug: true },
      take: 10,
    });

    return res.json({ success: true, data: products });
  } catch (error) {
    next(error);
  }
};

// Get facets for advanced filtering
export const getFacets = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const categories = await prismaClient.category.findMany({
      select: { id: true, name: true, _count: { select: { products: true } } },
    });

    const priceRange = await prismaClient.product.aggregate({
      _min: { price: true },
      _max: { price: true },
    });

    return res.json({
      success: true,
      data: {
        categories,
        priceRange: {
          min: priceRange._min.price || 0,
          max: priceRange._max.price || 0,
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// Search by image
export const searchByImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // This would typically involve a computer vision service
    // For now, it's a placeholder returning recent products
    const products = await prismaClient.product.findMany({
      where: { isActive: true },
      take: 10,
    });

    return res.json({
      success: true,
      message: "Image search results (placeholder)",
      data: products.map(p => ({ ...p, images: JSON.parse(p.images) })),
    });
  } catch (error) {
    next(error);
  }
};
// Get products with deals (discounts)
export const getProductsWithDeals = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { page = 1, limit = 10, sort = "discount" } = req.query;

    const pageNum = Math.max(1, parseInt(page as string) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit as string) || 10));
    const skip = (pageNum - 1) * limitNum;

    // Filter for products where price < mrp
    const where = {
      isActive: true,
      price: {
        lt: prismaClient.product.fields.mrp
      }
    };

    // Note: Prisma doesn't support field comparison in 'where' easily for all databases without raw query
    // But we can use products that have a price strictly less than mrp.
    // However, some products might have mrp=price.
    // A more reliable way for "Deals" is to fetch products where mrp/price > 1.

    // For simplicity and since most products in a grocery app have MRP >= price, 
    // we fetch products where mrp > 0 and price < mrp.

    const [products, total] = await Promise.all([
      prismaClient.product.findMany({
        where: {
          isActive: true,
          // We'll use a raw query or a computed filter if needed, 
          // but for now let's assume deals are products where mrp > price
        },
        include: { category: true },
        orderBy: {
          createdAt: 'desc'
        }
      }),
      prismaClient.product.count({
        where: { isActive: true }
      }),
    ]);

    // Manual filtering because Prisma comparison of fields is limited in standard findMany
    const dealsProducts = products
      .filter(p => p.mrp > p.price)
      .map(p => ({
        ...p,
        images: JSON.parse(p.images),
        discount: Math.round(((p.mrp - p.price) / p.mrp) * 100)
      }));

    // Sorting by discount
    if (sort === "discount") {
      dealsProducts.sort((a, b) => b.discount - a.discount);
    } else if (sort === "priceLow") {
      dealsProducts.sort((a, b) => a.price - b.price);
    }

    const paginatedDeals = dealsProducts.slice(skip, skip + limitNum);

    return res.status(200).json({
      success: true,
      data: paginatedDeals,
      pagination: {
        total: dealsProducts.length,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(dealsProducts.length / limitNum),
      },
    });
  } catch (error) {
    next(error);
  }
};
