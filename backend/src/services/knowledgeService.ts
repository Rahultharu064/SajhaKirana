import { PrismaClient } from '@prisma/client';
import { embeddingService } from './embeddingService';

const prisma = new PrismaClient();

export class KnowledgeService {
    // Index all products
    async indexProducts() {
        try {
            console.log('🔄 Indexing products...');
            const products = await prisma.product.findMany({
                include: {
                    category: true,
                },
            });

            const documents = products.map((product) => ({
                text: `Product: ${product.title}. Description: ${product.description || 'No description'}. Price: Rs ${product.price}. Category: ${product.category?.name || 'Uncategorized'}. SKU: ${product.sku}. Stock: ${product.stock > 0 ? 'Available' : 'Out of stock'}.`,
                metadata: {
                    type: 'product',
                    productId: product.id,
                    name: product.title,
                    price: product.price,
                    categoryId: product.categoryId,
                    categoryName: product.category?.name,
                    sku: product.sku,
                    stock: product.stock,
                    slug: product.slug,
                },
            }));

            await embeddingService.batchStoreDocuments(documents);
            console.log(`✅ Indexed ${documents.length} products`);
        } catch (error) {
            console.error('❌ Error indexing products:', error);
            throw error;
        }
    }

    // Index all categories
    async indexCategories() {
        try {
            console.log('🔄 Indexing categories...');
            const categories = await prisma.category.findMany();

            const documents = categories.map((category) => ({
                text: `Category: ${category.name}. Slug: ${category.slug || 'No slug'}.`,
                metadata: {
                    type: 'category',
                    categoryId: category.id,
                    name: category.name,
                    slug: category.slug,
                },
            }));

            await embeddingService.batchStoreDocuments(documents);
            console.log(`✅ Indexed ${documents.length} categories`);
        } catch (error) {
            console.error('❌ Error indexing categories:', error);
            throw error;
        }
    }

    // Index platform features and documentation
    async indexPlatformKnowledge() {
        try {
            console.log('🔄 Indexing platform knowledge...');
            const knowledgeDocs = [
                {
                    text: 'Sajha Kirana is a comprehensive e-commerce platform for grocery shopping built with React 19, TypeScript, Node.js, Express, Prisma ORM, and MySQL database.',
                    metadata: { type: 'platform', category: 'overview' },
                },
                {
                    text: 'Frontend Tech Stack: React 19, TypeScript, Vite, Tailwind CSS, Redux Toolkit, React Router, Framer Motion, Lucide React, Socket.io Client',
                    metadata: { type: 'platform', category: 'frontend_tech' },
                },
                {
                    text: 'Backend Tech Stack: Node.js, Express, TypeScript, Prisma ORM, MySQL, JWT for authentication, Socket.io for real-time, Multer for file uploads, Nodemailer for emails, Joi for validation',
                    metadata: { type: 'platform', category: 'backend_tech' },
                },
                {
                    text: 'Payment Integration: eSewa and Khalti payment gateways with webhook handling for payment verification',
                    metadata: { type: 'platform', category: 'payments' },
                },
                {
                    text: 'User Features: Registration and login, email verification, profile management with photo upload, role-based access (Customer/Admin), shopping cart, order tracking, product reviews',
                    metadata: { type: 'platform', category: 'user_features' },
                },
                {
                    text: 'Advanced Search Features: Text search with autocomplete, voice search using speech-to-text, image search with machine learning, real-time suggestions, price filters, category filters',
                    metadata: { type: 'platform', category: 'search_features' },
                },
                {
                    text: 'Admin Dashboard Features: Product CRUD operations, bulk import via CSV, inventory management with stock tracking, order management with status updates, user management, coupon system, analytics and reporting',
                    metadata: { type: 'platform', category: 'admin_features' },
                },
                {
                    text: 'API Endpoints - Authentication: POST /api/auth/register for user registration, POST /api/auth/login for login, POST /api/auth/refresh for token refresh',
                    metadata: { type: 'platform', category: 'api_auth' },
                },
                {
                    text: 'API Endpoints - Products: GET /api/products to list products with filters, GET /api/products/:slug for product details, GET /api/categories for categories, POST /api/products for creating products (admin)',
                    metadata: { type: 'platform', category: 'api_products' },
                },
                {
                    text: 'API Endpoints - Cart & Orders: GET /api/cart for user cart, POST /api/cart to add items, POST /api/orders to create order, GET /api/orders for order list, GET /api/orders/:id for order details',
                    metadata: { type: 'platform', category: 'api_cart_orders' },
                },
                {
                    text: 'API Endpoints - Payments: POST /api/payments/initiate to initialize payment, POST /api/payments/webhook/:gateway for payment webhooks',
                    metadata: { type: 'platform', category: 'api_payments' },
                },
                {
                    text: 'API Endpoints - Admin: GET /api/admin/dashboard for statistics, GET /api/admin/products for product management, GET /api/admin/orders for order management, GET /api/admin/users for user management, GET /api/admin/inventory for inventory',
                    metadata: { type: 'platform', category: 'api_admin' },
                },
                {
                    text: 'Security Features: JWT-based authentication with refresh tokens, role-based access control, comprehensive Joi validation schemas, rate limiting for API protection, file upload security with type and size validation, password hashing with bcrypt',
                    metadata: { type: 'platform', category: 'security' },
                },
                {
                    text: 'Real-time Features: Order status updates via Socket.io, low inventory alerts, live chat support, real-time dashboard updates for admins',
                    metadata: { type: 'platform', category: 'realtime' },
                },
                {
                    text: 'Database Schema: User (customers and admins), Product (items for sale), Category (product categorization), CartItem (shopping cart), Order and OrderItem (purchases), Payment (payment records), Review (customer feedback), Coupon (discounts), Inventory (stock management), Reservation (stock reservation)',
                    metadata: { type: 'platform', category: 'database' },
                },
            ];

            await embeddingService.batchStoreDocuments(knowledgeDocs);
            console.log(`✅ Indexed ${knowledgeDocs.length} platform knowledge documents`);
        } catch (error) {
            console.error('❌ Error indexing platform knowledge:', error);
            throw error;
        }
    }

    // Index everything
    async indexAll() {
        try {
            console.log('🚀 Starting full knowledge base indexing...');
            await this.indexProducts();
            await this.indexCategories();
            await this.indexPlatformKnowledge();
            console.log('✅ Full knowledge base indexed successfully!');
        } catch (error) {
            console.error('❌ Error during full indexing:', error);
            throw error;
        }
    }

    // Update single product
    async updateProduct(productId: string | number) {
        try {
            const id = Number(productId);
            const product = await prisma.product.findUnique({
                where: { id },
                include: { category: true },
            });

            if (!product) {
                throw new Error('Product not found');
            }

            // Delete old version
            await embeddingService.deleteDocuments({
                must: [{ key: 'productId', match: { value: productId } }],
            });

            // Add new version
            await embeddingService.storeDocument(
                `Product: ${product.title}. Description: ${product.description || 'No description'}. Price: Rs ${product.price}. Category: ${product.category?.name || 'Uncategorized'}. SKU: ${product.sku}. Stock: ${product.stock > 0 ? 'Available' : 'Out of stock'}.`,
                {
                    type: 'product',
                    productId: product.id,
                    name: product.title,
                    price: product.price,
                    categoryId: product.categoryId,
                    categoryName: product.category?.name,
                    sku: product.sku,
                    stock: product.stock,
                    slug: product.slug,
                }
            );

            console.log(`✅ Updated product: ${product.title}`);
        } catch (error) {
            console.error('❌ Error updating product:', error);
            throw error;
        }
    }
}

export const knowledgeService = new KnowledgeService();
