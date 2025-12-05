# Product Controller & Validation Documentation

## Overview
Complete product management system with full validation, filtering, pagination, and search capabilities.

---

## File: `productValidator.ts`

### Schemas

#### 1. **createProductSchema**
Validates new product creation with the following rules:
- **title**: Required, 3-255 characters, unique
- **slug**: Required, lowercase, alphanumeric + hyphens only, 3-255 characters, unique
- **description**: Required, 10-5000 characters
- **price**: Required, positive number with 2 decimal places
- **mrp**: Required, must be ≥ price
- **stock**: Optional, non-negative integer (default: 0)
- **categoryId**: Required, positive integer
- **images**: Required array, 1-10 valid URIs
- **isActive**: Optional boolean (default: true)

#### 2. **updateProductSchema**
Same as create but all fields optional (partial updates allowed).

#### 3. **idParamSchema**
Validates ID parameters: positive integer.

#### 4. **searchProductSchema**
Validates search and filtering query parameters:
- **q**: Search string (max 100 chars)
- **category**: Category ID filter
- **priceMin/priceMax**: Price range filters (priceMax ≥ priceMin)
- **sort**: "newest", "oldest", "priceLow", "priceHigh", "popular"
- **page**: Pagination (default: 1)
- **limit**: Results per page, 1-100 (default: 10)
- **isActive**: Filter by status

---

## File: `productController.ts`

### Controller Functions

#### 1. **createProduct**
- Creates new product with validation
- Checks for duplicate title/slug
- Verifies category exists
- Stores images as JSON
- Returns: 201 with product data

#### 2. **getAllProducts**
- Retrieves products with filters and pagination
- Supports: search (title/description/slug), category filter, price range
- Sorting options: newest, oldest, priceLow, priceHigh, popular
- Returns: paginated results with metadata

#### 3. **getProductById**
- Fetches single product by ID
- Includes category relation
- Returns: 404 if not found

#### 4. **getProductBySlug**
- Fetches single product by slug (for frontend URLs)
- Includes category relation

#### 5. **updateProduct**
- Updates product with partial data
- Validates unique title/slug against other products
- Verifies category exists if changed
- Returns: updated product data

#### 6. **deleteProduct**
- Deletes product by ID
- Verifies existence before deletion

#### 7. **searchProducts**
- Simplified search across title, description, slug
- Supports category filtering
- Returns: up to 20 results

#### 8. **getProductsByCategory**
- Fetches all products in a category
- Supports pagination and sorting
- Only returns active products

#### 9. **bulkImportProducts**
- Bulk creates products from array
- Validates each product
- Returns: created products + validation errors if any

---

## Prisma Schema Updates

Added `Product` model with relations:

```prisma
model Product {
  id          Int      @id @default(autoincrement())
  title       String   @unique
  slug        String   @unique
  description String   @db.LongText
  price       Float
  mrp         Float
  stock       Int      @default(0)
  categoryId  Int
  category    Category @relation(fields: [categoryId], references: [id], onDelete: Cascade)
  images      String   @db.LongText // JSON array as string
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([categoryId])
  @@index([slug])
}
```

---

## Error Response Format

All errors follow consistent format:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable message"
  }
}
```

Common error codes:
- `PRODUCT_TITLE_EXISTS`
- `PRODUCT_SLUG_EXISTS`
- `CATEGORY_NOT_FOUND`
- `PRODUCT_NOT_FOUND`
- `INVALID_ID`
- `INVALID_SEARCH`

---

## Success Response Format

```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

For paginated responses:

```json
{
  "success": true,
  "message": "...",
  "data": [ ... ],
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "pages": 10
  }
}
```

---

## Features

✅ **Full Validation**: Joi schemas for all inputs  
✅ **Search & Filtering**: By title, description, slug, category, price range  
✅ **Sorting**: Multiple options (newest, oldest, price, popularity)  
✅ **Pagination**: Configurable page/limit with metadata  
✅ **Relationship Handling**: Automatic category validation  
✅ **Unique Constraints**: Title and slug uniqueness checks  
✅ **JSON Storage**: Images stored as JSON array  
✅ **Bulk Operations**: CSV import support structure  
✅ **Soft Filters**: isActive flag for status filtering  
✅ **Error Handling**: Comprehensive error codes and messages

---

## Next Steps

1. Run migration: `npx prisma migrate dev --name add-product-model`
2. Create `productRoute.ts` for endpoints
3. Add validation middleware to routes
4. Create tests for all functions
5. Implement file upload for images (optional)
