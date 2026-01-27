import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const generateSlug = (text: string) => {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/[\s\W-]+/g, '-')
        .replace(/^-+|-+$/g, '');
};

const categories = [
    { name: 'Fresh Vegetables', slug: 'fresh-vegetables', image: '/uploads/categories/vegetables.jpg' },
    { name: 'Fresh Fruits', slug: 'fresh-fruits', image: '/uploads/categories/fruits.jpg' },
    { name: 'Dairy & Eggs', slug: 'dairy-eggs', image: '/uploads/categories/dairy.jpg' },
    { name: 'Bakery & Snacks', slug: 'bakery-snacks', image: '/uploads/categories/bakery.jpg' },
    { name: 'Beverages', slug: 'beverages', image: '/uploads/categories/beverages.jpg' },
    { name: 'Household Essentials', slug: 'household', image: '/uploads/categories/household.jpg' },
    { name: 'Rice & Pulses', slug: 'rice-pulses', image: '/uploads/categories/rice.jpg' },
    { name: 'Meat & Seafood', slug: 'meat-seafood', image: '/uploads/categories/meat.jpg' },
];

const products = [
    // Fresh Vegetables
    {
        title: 'Local Tomato (Golbheda)',
        description: 'Fresh local tomatoes sourced directly from farms in Bhaktapur. High in Vitamin C and antioxidants.',
        sku: 'VEG-TOM-001',
        price: 80,
        mrp: 95,
        stock: 50,
        categorySlug: 'fresh-vegetables',
        isActive: true,
    },
    {
        title: 'Potato (Alu) - 1kg',
        description: 'High-quality Mude potatoes, known for their great taste and texture. Perfect for any Nepali dish.',
        sku: 'VEG-POT-001',
        price: 65,
        mrp: 75,
        stock: 200,
        categorySlug: 'fresh-vegetables',
        isActive: true,
    },
    {
        title: 'Cabbage (Bandakopi)',
        description: 'Fresh and crunchy cabbage, perfect for salads or traditional Tarkari.',
        sku: 'VEG-CAB-001',
        price: 45,
        mrp: 55,
        stock: 30,
        categorySlug: 'fresh-vegetables',
        isActive: true,
    },

    // Fresh Fruits
    {
        title: 'Fuji Apple - 1kg',
        description: 'Sweet and crunchy Fuji apples. Rich in fiber and perfectly ripe.',
        sku: 'FRU-APP-001',
        price: 280,
        mrp: 320,
        stock: 40,
        categorySlug: 'fresh-fruits',
        isActive: true,
    },
    {
        title: 'Banana (Chini Champa) - 1 Dozen',
        description: 'Local small sweet bananas (Chini Champa) from Saptari. Great for kids and quick energy.',
        sku: 'FRU-BAN-001',
        price: 120,
        mrp: 140,
        stock: 25,
        categorySlug: 'fresh-fruits',
        isActive: true,
    },

    // Dairy & Eggs
    {
        title: 'Fresh Milk - 500ml',
        description: 'Pasteurized whole milk from local dairies. Rich in Calcium.',
        sku: 'DAI-MIL-001',
        price: 50,
        mrp: 50,
        stock: 100,
        categorySlug: 'dairy-eggs',
        isActive: true,
    },
    {
        title: 'Local Eggs - 1 Crate (30 pcs)',
        description: 'Farm-fresh local eggs. High protein source for your daily needs.',
        sku: 'DAI-EGG-001',
        price: 480,
        mrp: 520,
        stock: 15,
        categorySlug: 'dairy-eggs',
        isActive: true,
    },
    {
        title: 'Paneer - 200g',
        description: 'Soft and fresh cottage cheese (Paneer). Perfect for Paneer Butter Masala.',
        sku: 'DAI-PAN-001',
        price: 180,
        mrp: 200,
        stock: 20,
        categorySlug: 'dairy-eggs',
        isActive: true,
    },

    // Rice & Pulses
    {
        title: 'Jira Masino Rice - 20kg',
        description: 'Premium quality Jira Masino rice. Long grains with a wonderful aroma.',
        sku: 'RIC-JIR-001',
        price: 2250,
        mrp: 2500,
        stock: 50,
        categorySlug: 'rice-pulses',
        isActive: true,
    },
    {
        title: 'Mustang Simi (Pulses) - 1kg',
        description: 'Authentic Simi from Mustang. Known for its unique taste and nutritional value.',
        sku: 'RIC-PUL-001',
        price: 350,
        mrp: 400,
        stock: 25,
        categorySlug: 'rice-pulses',
        isActive: true,
    },

    // Beverages
    {
        title: 'Real Juice Mixed Fruit - 1L',
        description: 'Refreshing mixed fruit juice from Real. No added preservatives.',
        sku: 'BEV-JUI-001',
        price: 240,
        mrp: 260,
        stock: 60,
        categorySlug: 'beverages',
        isActive: true,
    },
    {
        title: 'Tokla Chiya (Tea) - 500g',
        description: 'Authentic Nepali CTC tea from the gardens of Ilam.',
        sku: 'BEV-TEA-001',
        price: 215,
        mrp: 230,
        stock: 80,
        categorySlug: 'beverages',
        isActive: true,
    },

    // Bakery & Snacks
    {
        title: 'Current 2PM Spicy Noodles - Pack of 5',
        description: 'The most popular spicy noodles in Nepal. Extra spicy (Akabare flavor).',
        sku: 'BAK-NOO-001',
        price: 240,
        mrp: 250,
        stock: 150,
        categorySlug: 'bakery-snacks',
        isActive: true,
    },
    {
        title: 'Digestive Biscuits - 200g',
        description: 'Healthy and fiber-rich biscuits, perfect with your morning tea.',
        sku: 'BAK-BIS-001',
        price: 60,
        mrp: 70,
        stock: 100,
        categorySlug: 'bakery-snacks',
        isActive: true,
    },
];

async function main() {
    console.log('🌱 Starting seeding...');

    // 1. Seed Categories
    console.log('📂 Seeding categories...');
    for (const cat of categories) {
        await prisma.category.upsert({
            where: { slug: cat.slug },
            update: cat,
            create: cat,
        });
    }

    // 2. Get all categories to map IDs
    const allCategories = await prisma.category.findMany();
    const categoryMap = new Map(allCategories.map(c => [c.slug, c.id]));

    // 3. Seed Products
    console.log('🛒 Seeding products...');
    for (const prod of products) {
        const categoryId = categoryMap.get(prod.categorySlug);
        if (!categoryId) continue;

        const { categorySlug, ...productData } = prod;
        const slug = generateSlug(prod.title);

        await prisma.product.upsert({
            where: { sku: prod.sku },
            update: {
                ...productData,
                categoryId,
                slug,
                images: JSON.stringify([`/uploads/products/${prod.sku.toLowerCase()}.jpg`]),
            },
            create: {
                ...productData,
                categoryId,
                slug,
                images: JSON.stringify([`/uploads/products/${prod.sku.toLowerCase()}.jpg`]),
            },
        });
    }

    console.log('✅ Seeding completed successfully!');
}

main()
    .catch((e) => {
        console.error('❌ Seeding failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
