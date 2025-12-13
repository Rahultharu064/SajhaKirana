import type { Request, Response, NextFunction } from "express";
import { prismaClient } from "../config/client";
import { deleteImageFiles } from "../config/multer";

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

    // Generate or clean slug
    if (!slug && title) {
      slug = generateSlug(title);
    } else if (slug) {
      slug = generateSlug(slug);
    }

    // Parse and validate input types
    const parsedPrice = parseFloat(price);
    const parsedMrp = parseFloat(mrp);
    const parsedStock = parseInt(stock);
    const parsedCategoryId = parseInt(categoryId);

    if (isNaN(parsedPrice) || isNaN(parsedMrp) || isNaN(parsedStock) || isNaN(parsedCategoryId)) {
      return res.status(400).json({
        success: false,
        error: {
          code: "INVALID_INPUT",
          message: "Invalid numeric values for price, mrp, stock, or categoryId",
        },
      });
    }

    if (!sku || typeof sku !== "string") {
      return res.status(400).json({
        success: false,
        error: {
          code: "INVALID_SKU",
          message: "SKU is required and must be a string",
        },
      });
    }

    // Handle file uploads
    const files = (req as any).files;
    let imagePaths: string[] = [];

    if (files && Array.isArray(files) && files.length > 0) {
      imagePaths = files.map((file) => `/uploads/products/${file.filename}`);
    } else if (!files || files.length === 0) {
      return res.status(400).json({
        success: false,
        error: {
          code: "NO_IMAGES",
          message: "At least one product image is required",
        },
      });
    }

    // Check if product with same title already exists
    const existingProductByTitle = await prismaClient.product.findUnique({
      where: { title },
    });

    if (existingProductByTitle) {
      // Delete uploaded files if title already exists
      deleteImageFiles(imagePaths, "products");
      return res.status(400).json({
        success: false,
        error: {
          code: "PRODUCT_TITLE_EXISTS",
          message: "A product with this title already exists",
        },
      });
    }

    // Check if product with same slug already exists
    const existingProductBySlug = await prismaClient.product.findUnique({
      where: { slug },
    });

    if (existingProductBySlug) {
      // Delete uploaded files if slug already exists
      deleteImageFiles(imagePaths, "products");
      return res.status(400).json({
        success: false,
        error: {
          code: "PRODUCT_SLUG_EXISTS",
          message: "A product with this slug already exists",
        },
      });
    }

    // Verify category exists
    const category = await prismaClient.category.findUnique({
      where: { id: parsedCategoryId },
    });

    if (!category) {
      // Delete uploaded files if category doesn't exist
      deleteImageFiles(imagePaths, "products");
      return res.status(404).json({
        success: false,
        error: {
          code: "CATEGORY_NOT_FOUND",
          message: "Category not found",
        },
      });
    }

    // Create new product
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
        isActive: isActive !== undefined ? isActive : true,
      },
      include: {
        category: true,
      },
    });

    // Parse images back to array for response
    const productResponse = {
      ...product,
      images: JSON.parse(product.images),
    };

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: productResponse,
    });
  } catch (error) {
    // Delete uploaded files on error
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
      isActive = true,
      inStock,
      ratingMin,
    } = req.query;

    // Build where clause for filtering
    const where: any = {};

    // Only filter by isActive if explicitly provided
    if (isActive !== undefined && isActive !== null) {
      where.isActive = isActive === "false" ? false : true;
    }

    if (q && typeof q === "string") {
      where.OR = [
        { title: { contains: q } },
        { description: { contains: q } },
        { slug: { contains: q } },
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
      if (priceMin) {
        where.price.gte = parseFloat(priceMin as string);
      }
      if (priceMax) {
        where.price.lte = parseFloat(priceMax as string);
      }
    }

    if (inStock === 'true') {
      where.stock = { gt: 0 };
    }

    if (ratingMin) {
      const minRating = parseFloat(ratingMin as string);
      if (!isNaN(minRating)) {
        // For products with average rating
        // We'll need to join with reviews to get average rating
        // For now, using a simple approach
        where.id = {
          in: await prismaClient.$queryRaw`
            SELECT productId
            FROM (SELECT productId, AVG(rating) as avgRating
                  FROM Review GROUP BY productId) r
            WHERE r.avgRating >= ${minRating}
          `,
        };
      }
    }

    // Build orderBy based on sort parameter
    const orderByMap: any = {
      newest: { createdAt: "desc" },
      oldest: { createdAt: "asc" },
      priceLow: { price: "asc" },
      priceHigh: { price: "desc" },
      popular: { _count: { reviews: "desc" } }, // Sort by review count as popularity
      rating: [{ reviews: { _count: "desc" } }], // Sort by rating count
    };

    const orderBy = orderByMap[sort as string] || { createdAt: "desc" };

    // Calculate pagination
    const pageNum = Math.max(1, parseInt(page as string) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit as string) || 10));
    const skip = (pageNum - 1) * limitNum;

    // Get products and total count
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

    // Parse images and calculate average rating for all products
    const productsResponse = await Promise.all(products.map(async (product: any) => {
      // Get average rating for this product
      const ratingResult = await prismaClient.$queryRaw`
        SELECT AVG(rating) as avgRating, COUNT(*) as reviewCount
        FROM Review
        WHERE productId = ${product.id}
      ` as any;

      const avgRating = ratingResult[0]?.avgRating || 0;
      const reviewCount = ratingResult[0]?.reviewCount || 0;

      return {
        ...product,
        images: JSON.parse(product.images),
        avgRating: parseFloat(avgRating.toString()) || 0,
        reviewCount: parseInt(reviewCount.toString()) || 0,
      };
    }));

    return res.status(200).json({
      success: true,
      message: "Products retrieved successfully",
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
    const { id } = req.params;

    // Validate ID
    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({
        success: false,
        error: {
          code: "INVALID_ID",
          message: "Invalid product ID",
        },
      });
    }

    const product = await prismaClient.product.findUnique({
      where: { id: parseInt(id) },
      include: {
        category: true,
      },
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        error: {
          code: "PRODUCT_NOT_FOUND",
          message: "Product not found",
        },
      });
    }

    // Parse images for response
    const productResponse = {
      ...product,
      images: JSON.parse(product.images),
    };

    return res.status(200).json({
      success: true,
      message: "Product retrieved successfully",
      data: productResponse,
    });
  } catch (error) {
    next(error);
  }
};
// similar products 
const getSimilarProducts = async (
  categoryId: number,
  excludeProductId: number,
  limit: number = 5
) => {
  const products = await prismaClient.product.findMany({
    where: {
      categoryId,
      id: { not: excludeProductId },
      isActive: true,
    },
    take: limit,
    include: {
      category: true,
    },
  });

  return products.map((product: any) => ({
    ...product,
    images: JSON.parse(product.images),
  }));
};


// Get product by slug
export const getProductBySlug = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { slug } = req.params;

    if (!slug || typeof slug !== "string") {
      return res.status(400).json({
        success: false,
        error: {
          code: "INVALID_SLUG",
          message: "Invalid product slug",
        },
      });
    }

    const product = await prismaClient.product.findUnique({
      where: { slug },
      include: {
        category: true,
      },
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        error: {
          code: "PRODUCT_NOT_FOUND",
          message: "Product not found",
        },
      });
    }

    // Parse images for response
    const productResponse = {
      ...product,
      images: JSON.parse(product.images),
    };

    return res.status(200).json({
      success: true,
      message: "Product retrieved successfully",
      data: productResponse,
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
    const { id } = req.params;
    let { title, slug, description, price, mrp, stock, categoryId, isActive } =
      req.body;

    // Clean slug if provided
    if (slug) {
      slug = generateSlug(slug);
    }

    // Validate ID
    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({
        success: false,
        error: {
          code: "INVALID_ID",
          message: "Invalid product ID",
        },
      });
    }

    // Check if product exists
    const existingProduct = await prismaClient.product.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        error: {
          code: "PRODUCT_NOT_FOUND",
          message: "Product not found",
        },
      });
    }

    // Check if new title is already taken by another product
    if (title && title !== existingProduct.title) {
      const duplicateTitle = await prismaClient.product.findUnique({
        where: { title },
      });

      if (duplicateTitle) {
        return res.status(400).json({
          success: false,
          error: {
            code: "PRODUCT_TITLE_EXISTS",
            message: "A product with this title already exists",
          },
        });
      }
    }

    // Check if new slug is already taken by another product
    if (slug && slug !== existingProduct.slug) {
      const duplicateSlug = await prismaClient.product.findUnique({
        where: { slug },
      });

      if (duplicateSlug) {
        return res.status(400).json({
          success: false,
          error: {
            code: "PRODUCT_SLUG_EXISTS",
            message: "A product with this slug already exists",
          },
        });
      }
    }

    // Verify category exists if categoryId is provided
    if (categoryId && categoryId !== existingProduct.categoryId) {
      const category = await prismaClient.category.findUnique({
        where: { id: categoryId },
      });

      if (!category) {
        return res.status(404).json({
          success: false,
          error: {
            code: "CATEGORY_NOT_FOUND",
            message: "Category not found",
          },
        });
      }
    }

    // Handle file uploads if new images are provided
    let imagePaths: string[] = JSON.parse(existingProduct.images);
    const files = (req as any).files;

    if (files && Array.isArray(files) && files.length > 0) {
      // Delete old images
      deleteImageFiles(imagePaths, "products");
      // Set new images
      imagePaths = files.map((file) => `/uploads/products/${file.filename}`);
    }

    // Build update data
    const updateData: any = {};
    if (title) updateData.title = title;
    if (slug) updateData.slug = slug;
    if (description) updateData.description = description;
    if (price !== undefined) updateData.price = price;
    if (mrp !== undefined) updateData.mrp = mrp;
    if (stock !== undefined) updateData.stock = stock;
    if (categoryId) updateData.categoryId = categoryId;
    if (imagePaths.length > 0) updateData.images = JSON.stringify(imagePaths);
    if (isActive !== undefined) updateData.isActive = isActive;

    // Update product
    const updatedProduct = await prismaClient.product.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: {
        category: true,
      },
    });

    // Parse images for response
    const productResponse = {
      ...updatedProduct,
      images: JSON.parse(updatedProduct.images),
    };

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: productResponse,
    });
  } catch (error) {
    // Delete uploaded files on error
    const files = (req as any).files;
    if (files && Array.isArray(files)) {
      const imagePaths = files.map((file) => `/uploads/products/${file.filename}`);
      deleteImageFiles(imagePaths, "products");
    }
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
    const { id } = req.params;

    // Validate ID
    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({
        success: false,
        error: {
          code: "INVALID_ID",
          message: "Invalid product ID",
        },
      });
    }

    // Check if product exists
    const existingProduct = await prismaClient.product.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        error: {
          code: "PRODUCT_NOT_FOUND",
          message: "Product not found",
        },
      });
    }

    // Delete product images from filesystem
    const imagePaths = JSON.parse(existingProduct.images);
    if (Array.isArray(imagePaths) && imagePaths.length > 0) {
      deleteImageFiles(imagePaths, "products");
    }

    // Delete product
    await prismaClient.product.delete({
      where: { id: parseInt(id) },
    });

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
    const {
      q,
      category,
      priceMin,
      priceMax,
      sort = "newest",
      page = 1,
      limit = 10,
    } = req.query;

    if (!q || typeof q !== "string") {
      return res.status(400).json({
        success: false,
        error: {
          code: "INVALID_SEARCH",
          message: "Search query is required",
        },
      });
    }

    // Build where clause for filtering
    const where: any = {
      isActive: true,
      OR: [
        { title: { contains: q } },
        { description: { contains: q } },
        { slug: { contains: q } },
      ],
    };

    if (category) {
      const categoryIds = (category as string).split(',').map(id => parseInt(id)).filter(id => !isNaN(id));
      if (categoryIds.length > 0) {
        where.categoryId = { in: categoryIds };
      }
    }

    if (priceMin || priceMax) {
      where.price = {};
      if (priceMin) {
        where.price.gte = parseFloat(priceMin as string);
      }
      if (priceMax) {
        where.price.lte = parseFloat(priceMax as string);
      }
    }

    // Build orderBy based on sort parameter
    const orderByMap: any = {
      newest: { createdAt: "desc" },
      oldest: { createdAt: "asc" },
      priceLow: { price: "asc" },
      priceHigh: { price: "desc" },
      popular: { createdAt: "desc" },
    };

    const orderBy = orderByMap[sort as string] || { createdAt: "desc" };

    // Calculate pagination
    const pageNum = Math.max(1, parseInt(page as string) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit as string) || 10));
    const skip = (pageNum - 1) * limitNum;

    // Get products and total count
    const [products, total] = await Promise.all([
      prismaClient.product.findMany({
        where,
        include: {
          category: true,
        },
        orderBy,
        skip,
        take: limitNum,
      }),
      prismaClient.product.count({ where }),
    ]);

    // Parse images for all products
    const productsResponse = products.map((product: any) => ({
      ...product,
      images: JSON.parse(product.images),
    }));

    return res.status(200).json({
      success: true,
      message: "Products retrieved successfully",
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

// Get products by category
export const getProductsByCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { categoryId } = req.params;
    const { page = 1, limit = 10, sort = "newest" } = req.query;

    if (!categoryId || isNaN(parseInt(categoryId))) {
      return res.status(400).json({
        success: false,
        error: {
          code: "INVALID_CATEGORY_ID",
          message: "Invalid category ID",
        },
      });
    }

    // Verify category exists
    const category = await prismaClient.category.findUnique({
      where: { id: parseInt(categoryId) },
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        error: {
          code: "CATEGORY_NOT_FOUND",
          message: "Category not found",
        },
      });
    }

    // Build orderBy based on sort parameter
    const orderByMap: any = {
      newest: { createdAt: "desc" },
      oldest: { createdAt: "asc" },
      priceLow: { price: "asc" },
      priceHigh: { price: "desc" },
    };

    const orderBy = orderByMap[sort as string] || { createdAt: "desc" };

    // Calculate pagination
    const pageNum = Math.max(1, parseInt(page as string) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit as string) || 10));
    const skip = (pageNum - 1) * limitNum;

    // Get products and total count
    const [products, total] = await Promise.all([
      prismaClient.product.findMany({
        where: {
          categoryId: parseInt(categoryId),
          isActive: true,
        },
        include: {
          category: true,
        },
        orderBy,
        skip,
        take: limitNum,
      }),
      prismaClient.product.count({
        where: {
          categoryId: parseInt(categoryId),
          isActive: true,
        },
      }),
    ]);

    // Parse images for all products
    const productsResponse = products.map((product: any) => ({
      ...product,
      images: JSON.parse(product.images),
    }));

    return res.status(200).json({
      success: true,
      message: "Products retrieved successfully",
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

// Bulk import products (CSV)
export const bulkImportProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // This would typically handle CSV file parsing
    // For now, we're providing the structure
    const products = req.body; // Expecting array of product objects

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({
        success: false,
        error: {
          code: "INVALID_FORMAT",
          message: "Products must be a non-empty array",
        },
      });
    }

    // Validate each product
    const validationErrors: any[] = [];
    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      if (!product.title || !product.slug || !product.categoryId) {
        validationErrors.push({
          row: i + 1,
          message: "Missing required fields: title, slug, or categoryId",
        });
      }
    }

    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Some rows have validation errors",
          details: validationErrors,
        },
      });
    }

    // Create products in bulk
    const createdProducts = await Promise.all(
      products.map((product) =>
        prismaClient.product.create({
          data: {
            ...product,
            images: JSON.stringify(product.images || []),
          },
          include: {
            category: true,
          },
        })
      )
    );

    const productsResponse = createdProducts.map((product: any) => ({
      ...product,
      images: JSON.parse(product.images),
    }));

    return res.status(201).json({
      success: true,
      message: `${createdProducts.length} products imported successfully`,
      data: productsResponse,
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
    const { id } = req.params;
    const { stock } = req.body;

    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({
        success: false,
        error: {
          code: "INVALID_ID",
          message: "Invalid product ID",
        },
      });
    }

    if (stock === undefined || isNaN(parseInt(stock)) || parseInt(stock) < 0) {
      return res.status(400).json({
        success: false,
        error: {
          code: "INVALID_STOCK",
          message: "Stock must be a non-negative integer",
        },
      });
    }

    const updatedProduct = await prismaClient.product.update({
      where: { id: parseInt(id) },
      data: { stock: parseInt(stock) },
    });

    return res.status(200).json({
      success: true,
      message: "Stock updated successfully",
      data: updatedProduct,
    });
  } catch (error) {
    next(error);
  }
};

// Autocomplete search suggestions
export const getAutocompleteSuggestions = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { q } = req.query;

    if (!q || typeof q !== "string" || q.length < 2) {
      return res.status(200).json({
        success: true,
        data: [],
        total: 0,
      });
    }

    // Get product titles and categories that match the query
    const products = await prismaClient.product.findMany({
      where: {
        isActive: true,
        OR: [
          { title: { contains: q } },
          { category: { name: { contains: q } } },
        ],
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
      take: 10, // Limit suggestions
    });

    const categories = await prismaClient.category.findMany({
      where: {
        name: { contains: q },
      },
      select: {
        id: true,
        name: true,
        slug: true,
      },
      take: 5,
    });

    // Combine and deduplicate suggestions
    const suggestions = [
      ...products.map((p: any) => ({
        type: "product",
        id: p.id,
        text: p.title,
        category: p.category.name,
        url: `/products/${p.category.slug}/${p.id}`,
      })),
      ...categories
        .filter((cat) => !products.some((p: any) => p.category.name === cat.name))
        .map((cat) => ({
          type: "category",
          id: cat.id,
          text: cat.name,
          url: `/categories/${cat.slug}`,
        })),
    ];

    return res.status(200).json({
      success: true,
      data: suggestions,
      total: suggestions.length,
    });
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
    const { category } = req.query;

    const where: any = { isActive: true };
    if (category) {
      const categoryIds = (category as string).split(',').map(id => parseInt(id)).filter(id => !isNaN(id));
      if (categoryIds.length > 0) {
        where.categoryId = { in: categoryIds };
      }
    }

    // Get price range
    const priceStats = await prismaClient.product.aggregate({
      where,
      _min: { price: true },
      _max: { price: true },
    });

    // Get categories with product counts
    const categoryFacets = await prismaClient.category.findMany({
      where: {
        products: {
          some: {
            isActive: true,
            ...category ? {} : {},
          },
        },
      },
      select: {
        id: true,
        name: true,
        slug: true,
        _count: {
          select: {
            products: {
              where: where,
            },
          },
        },
      },
    });

    // Get availability stats
    const inStockCount = await prismaClient.product.count({
      where: {
        ...where,
        stock: { gt: 0 },
      },
    });

    const outOfStockCount = await prismaClient.product.count({
      where: {
        ...where,
        stock: { lte: 0 },
      },
    });

    // Get rating distribution
    const ratingStats = await prismaClient.$queryRaw`
      SELECT
        FLOOR(avgRating) as rating,
        COUNT(*) as count
      FROM (
        SELECT
          productId,
          AVG(rating) as avgRating
        FROM Review
        WHERE productId IN (SELECT id FROM Product WHERE ${where.isActive ? "isActive = 1" : "1=1"})
        GROUP BY productId
      ) r
      GROUP BY FLOOR(avgRating)
    ` as any[];

    return res.status(200).json({
      success: true,
      data: {
        priceRange: {
          min: priceStats._min.price || 0,
          max: priceStats._max.price || 0,
        },
        categories: categoryFacets.map(cat => ({
          id: cat.id,
          name: cat.name,
          slug: cat.slug,
          count: cat._count.products,
        })),
        availability: {
          inStock: inStockCount,
          outOfStock: outOfStockCount,
        },
        ratings: ratingStats.map((stat: any) => ({
          rating: parseInt(stat.rating),
          count: parseInt(stat.count),
        })),
        sortOptions: [
          { value: "newest", label: "Newest First" },
          { value: "oldest", label: "Oldest First" },
          { value: "priceLow", label: "Price: Low to High" },
          { value: "priceHigh", label: "Price: High to Low" },
          { value: "popular", label: "Most Popular" },
          { value: "rating", label: "Highest Rated" },
        ],
      },
    });
  } catch (error) {
    next(error);
  }
};

// Image search - placeholder for AI integration
export const searchByImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // For now, return a placeholder response
    // In a real implementation, this would use an AI vision API
    // like Google Vision AI, Azure Computer Vision, etc.

    // Simulate some delay as if processing image
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Return some random products as "similar"
    const products = await prismaClient.product.findMany({
      where: { isActive: true },
      include: { category: true },
      take: 20,
      orderBy: { createdAt: "desc" },
    });

    // Parse images and add similarity scores
    const productsResponse = products.map((product: any, index) => ({
      ...product,
      images: JSON.parse(product.images),
      similarityScore: Math.random(), // placeholder similarity score
    }));

    // Sort by similarity score (descending)
    productsResponse.sort((a, b) => b.similarityScore - a.similarityScore);

    return res.status(200).json({
      success: true,
      message: "Image search completed (placeholder implementation)",
      data: productsResponse.slice(0, 10),
      pagination: {
        total: productsResponse.length,
        page: 1,
        limit: 10,
        pages: 1,
      },
    });
  } catch (error) {
    next(error);
  }
};
