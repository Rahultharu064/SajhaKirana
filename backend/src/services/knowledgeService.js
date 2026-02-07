import { PrismaClient } from '@prisma/client';
import { embeddingService } from './embeddingService';
const prisma = new PrismaClient();
export class KnowledgeService {
    async indexProducts() {
        try {
            console.log('🔄 Indexing products...');
            const products = await prisma.product.findMany({
                include: {
                    category: true,
                    reviews: {
                        select: {
                            rating: true,
                        },
                    },
                },
            });
            const documents = products.map((product) => {
                const avgRating = product.reviews.length > 0
                    ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
                    : 0;
                // Smart Keyword Enrichment (Conceptual Search Support)
                const keywords = [];
                const lowerTitle = product.title.toLowerCase();
                const lowerDesc = (product.description || '').toLowerCase();
                const catName = (product.category?.name || '').toLowerCase();
                if (catName.includes('fruit') || catName.includes('veg') || lowerDesc.includes('fresh'))
                    keywords.push('healthy', 'fresh', 'organic');
                if (catName.includes('bakery') || catName.includes('dairy') || lowerTitle.includes('milk') || lowerTitle.includes('bread'))
                    keywords.push('breakfast', 'morning essentials');
                if (lowerDesc.includes('spicy') || lowerDesc.includes('momo') || lowerTitle.includes('masala'))
                    keywords.push('nepali spices', 'momo ingredients');
                if (product.price < 500)
                    keywords.push('budget friendly', 'affordable');
                const richText = [
                    `Product: ${product.title}`,
                    `Category: ${product.category?.name || 'Uncategorized'}`,
                    `Description: ${product.description || 'No description'}`,
                    `Tags: ${keywords.join(', ')}`,
                    `Price: Rs ${product.price}`,
                    `Availability: ${product.stock > 0 ? 'In Stock' : 'Out of Stock'}`,
                    `Rating: ${avgRating.toFixed(1)} stars`,
                    `Popularity: ${product.stock > 10 ? 'Trending' : 'Standard'}`
                ].join('. ');
                return {
                    text: richText,
                    metadata: {
                        type: 'product',
                        productId: product.id,
                        name: product.title,
                        price: product.price,
                        mrp: product.mrp,
                        categoryId: product.categoryId,
                        categoryName: product.category?.name,
                        sku: product.sku,
                        stock: product.stock,
                        slug: product.slug,
                        avgRating,
                        isAvailable: product.stock > 0,
                        isActive: product.isActive,
                        image: (() => {
                            try {
                                const images = JSON.parse(product.images);
                                return Array.isArray(images) && images.length > 0 ? images[0] : null;
                            }
                            catch (e) {
                                return null;
                            }
                        })(),
                    },
                };
            });
            await embeddingService.batchStoreDocuments(documents);
            console.log(`✅ Indexed ${documents.length} products`);
        }
        catch (error) {
            console.error('❌ Error indexing products:', error);
            throw error;
        }
    }
    async indexCategories() {
        try {
            console.log('🔄 Indexing categories...');
            const categories = await prisma.category.findMany();
            const documents = categories.map((category) => ({
                text: `Category: ${category.name}. Slug: ${category.slug}.`,
                metadata: {
                    type: 'category',
                    categoryId: category.id,
                    name: category.name,
                    slug: category.slug,
                    image: category.image,
                },
            }));
            await embeddingService.batchStoreDocuments(documents);
            console.log(`✅ Indexed ${documents.length} categories`);
        }
        catch (error) {
            console.error('❌ Error indexing categories:', error);
            throw error;
        }
    }
    async indexPlatformKnowledge() {
        try {
            console.log('🔄 Indexing platform knowledge...');
            const knowledgeDocs = [
                {
                    text: 'Sajha Kirana (साझा किराना) is a comprehensive e-commerce platform for grocery shopping in Nepal. Built with React 19, TypeScript, Node.js, Express, Prisma ORM, and MySQL database. We offer a wide range of groceries, household items, and daily essentials.',
                    metadata: { type: 'platform', category: 'overview' },
                },
                {
                    text: 'We offer personalized product recommendations based on your purchase history, browsing behavior, and price preferences. Our AI chatbot can suggest products within your budget and favorite categories.',
                    metadata: { type: 'platform', category: 'recommendations' },
                },
                {
                    text: 'Payment methods: We accept eSewa and Khalti digital payments. Both are secure and instant. No credit card required. Cash on delivery is also available.',
                    metadata: { type: 'platform', category: 'payments' },
                },
                {
                    text: 'Delivery information: We deliver within Kathmandu valley within 24 hours. Outside valley delivery takes 2-3 days. Minimum order: Rs 500. Free delivery on orders above Rs 2000.',
                    metadata: { type: 'platform', category: 'delivery' },
                },
                {
                    text: 'Return policy: You can return products within 7 days if unopened and in original packaging. Perishable items cannot be returned. Contact support for returns.',
                    metadata: { type: 'platform', category: 'returns' },
                },
                {
                    text: 'Customer support: Available 9 AM to 6 PM, 7 days a week. You can track your orders in real-time from your account dashboard.',
                    metadata: { type: 'platform', category: 'support' },
                },
                {
                    text: 'Special features: Voice search, image search, advanced filters, real-time order tracking, product reviews and ratings, coupon codes, and personalized recommendations.',
                    metadata: { type: 'platform', category: 'features' },
                },
                {
                    text: 'Budget shopping: We have a wide range of budget-friendly products. You can filter by price range, sort by lowest price first, and get recommendations based on your spending habits.',
                    metadata: { type: 'platform', category: 'budget_shopping' },
                },
            ];
            await embeddingService.batchStoreDocuments(knowledgeDocs);
            console.log(`✅ Indexed ${knowledgeDocs.length} platform knowledge documents`);
        }
        catch (error) {
            console.error('❌ Error indexing platform knowledge:', error);
            throw error;
        }
    }
    async indexAll() {
        try {
            console.log('🚀 Starting full knowledge base indexing...');
            await this.indexProducts();
            await this.indexCategories();
            await this.indexPlatformKnowledge();
            console.log('✅ Full knowledge base indexed successfully!');
        }
        catch (error) {
            console.error('❌ Error during full indexing:', error);
            throw error;
        }
    }
    // Webhook: Update single product
    async updateProduct(productId) {
        try {
            const id = typeof productId === 'string' ? parseInt(productId) : productId;
            const product = await prisma.product.findUnique({
                where: { id },
                include: {
                    category: true,
                    reviews: {
                        select: {
                            rating: true,
                        },
                    },
                },
            });
            if (!product) {
                throw new Error('Product not found');
            }
            // Delete old version
            await embeddingService.deleteDocuments({
                must: [{ key: 'productId', match: { value: productId } }],
            });
            const avgRating = product.reviews.length > 0
                ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
                : 0;
            // Add new version
            await embeddingService.storeDocument(`Product: ${product.title}. Description: ${product.description || 'No description'}. Price: Rs ${product.price}. MRP: Rs ${product.mrp || product.price}. Category: ${product.category?.name || 'Uncategorized'}. SKU: ${product.sku}. Stock: ${product.stock > 0 ? `${product.stock} units available` : 'Out of stock'}. Rating: ${avgRating.toFixed(1)} stars.`, {
                type: 'product',
                productId: product.id,
                name: product.title,
                price: product.price,
                mrp: product.mrp,
                categoryId: product.categoryId,
                categoryName: product.category?.name,
                sku: product.sku,
                stock: product.stock,
                slug: product.slug,
                avgRating,
                isAvailable: product.stock > 0,
                isActive: product.isActive,
                image: (() => {
                    try {
                        const images = JSON.parse(product.images);
                        return Array.isArray(images) && images.length > 0 ? images[0] : null;
                    }
                    catch (e) {
                        return null;
                    }
                })(),
            });
            console.log(`✅ Updated product in vector DB: ${product.title}`);
        }
        catch (error) {
            console.error('❌ Error updating product:', error);
            throw error;
        }
    }
    // Webhook: Delete product
    async deleteProduct(productId) {
        try {
            const id = typeof productId === 'string' ? parseInt(productId) : productId;
            await embeddingService.deleteDocuments({
                must: [{ key: 'productId', match: { value: id } }],
            });
            console.log(`✅ Deleted product from vector DB: ${productId}`);
        }
        catch (error) {
            console.error('❌ Error deleting product:', error);
            throw error;
        }
    }
}
export const knowledgeService = new KnowledgeService();
//# sourceMappingURL=knowledgeService.js.map