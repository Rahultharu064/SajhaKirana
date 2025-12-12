import { prismaClient } from '../config/client';

async function checkAdminUser() {
    try {
        console.log('🔍 Checking for admin users in database...\n');

        // Find all admin users
        const admins = await prismaClient.user.findMany({
            where: { role: 'admin' },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
                password: true // We'll show first few chars only
            }
        });

        if (admins.length === 0) {
            console.log('❌ No admin users found in database!');
            console.log('\n💡 Run: npm run seed:admin');
        } else {
            console.log(`✅ Found ${admins.length} admin user(s):\n`);
            admins.forEach((admin, index) => {
                console.log(`Admin #${index + 1}:`);
                console.log(`  ID: ${admin.id}`);
                console.log(`  Name: ${admin.name}`);
                console.log(`  Email: ${admin.email}`);
                console.log(`  Role: ${admin.role}`);
                console.log(`  Created: ${admin.createdAt}`);
                console.log(`  Password Hash: ${admin.password.substring(0, 20)}...`);
                console.log('');
            });
        }

        // Also check for any users with the default admin email
        const defaultAdminEmail = 'admin@sajhakirana.com';
        const userByEmail = await prismaClient.user.findFirst({
            where: { email: defaultAdminEmail },
            select: {
                id: true,
                name: true,
                email: true,
                role: true
            }
        });

        if (userByEmail) {
            console.log(`\n📧 User with email '${defaultAdminEmail}':`);
            console.log(`  Role: ${userByEmail.role}`);
            if (userByEmail.role !== 'admin') {
                console.log(`  ⚠️  WARNING: This user exists but has role '${userByEmail.role}' instead of 'admin'`);
            }
        }

    } catch (error) {
        console.error('❌ Error checking admin users:', error);
    } finally {
        await prismaClient.$disconnect();
    }
}

checkAdminUser();
