import { prismaClient } from '../config/client';
import bcrypt from 'bcrypt';

/**
 * Seed script to create an initial admin user
 * Run with: npm run seed:admin
 */
async function seedAdmin() {
    try {
        console.log('🌱 Starting admin user seed...');

        // Check if admin already exists
        const existingAdmin = await prismaClient.user.findFirst({
            where: { role: 'admin' }
        });

        if (existingAdmin) {
            console.log('⚠️  Admin user already exists:');
            console.log(`   Email: ${existingAdmin.email}`);
            console.log(`   Name: ${existingAdmin.name}`);
            console.log('\n💡 If you want to create another admin, use the /auth/admin/create endpoint');
            return;
        }

        // Default admin credentials
        const adminData = {
            name: process.env.ADMIN_NAME || 'Admin User',
            email: process.env.ADMIN_EMAIL || 'admin@sajhakirana.com',
            password: process.env.ADMIN_PASSWORD || 'admin123',
        };

        console.log('\n📝 Creating admin user with:');
        console.log(`   Email: ${adminData.email}`);
        console.log(`   Name: ${adminData.name}`);
        console.log(`   Password: ${adminData.password}`);

        // Hash password
        const hashedPassword = await bcrypt.hash(adminData.password, 10);

        // Create admin user
        const admin = await prismaClient.user.create({
            data: {
                name: adminData.name,
                email: adminData.email,
                password: hashedPassword,
                role: 'admin',
            },
        });

        console.log('\n✅ Admin user created successfully!');
        console.log('\n🔐 Login credentials:');
        console.log(`   Email: ${admin.email}`);
        console.log(`   Password: ${adminData.password}`);
        console.log('\n🚀 You can now login at: http://localhost:5003/auth/admin/login');
        console.log('\n⚠️  IMPORTANT: Change the default password after first login!');

    } catch (error) {
        console.error('❌ Error seeding admin user:', error);
        throw error;
    } finally {
        await prismaClient.$disconnect();
    }
}

// Run the seed function
seedAdmin()
    .then(() => {
        console.log('\n✨ Seed completed successfully');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n💥 Seed failed:', error);
        process.exit(1);
    });
