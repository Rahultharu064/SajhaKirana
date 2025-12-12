import { prismaClient } from '../config/client';
import bcrypt from 'bcrypt';

async function testAdminLogin() {
    try {
        const testEmail = 'admin@sajhakirana.com';
        const testPassword = 'admin123';

        console.log('🧪 Testing admin login...\n');
        console.log(`Email: ${testEmail}`);
        console.log(`Password: ${testPassword}\n`);

        // Step 1: Check if user exists
        console.log('Step 1: Checking if user exists...');
        const userExists = await prismaClient.user.findFirst({
            where: { email: testEmail },
            select: { id: true, email: true, role: true }
        });

        if (!userExists) {
            console.log('❌ User not found!');
            return;
        }
        console.log(`✅ User found: ID=${userExists.id}, Role=${userExists.role}\n`);

        // Step 2: Check if user is admin
        console.log('Step 2: Checking if user has admin role...');
        if (userExists.role !== 'admin') {
            console.log(`❌ User is not admin! Role: ${userExists.role}`);
            return;
        }
        console.log('✅ User has admin role\n');

        // Step 3: Get user with password
        console.log('Step 3: Fetching user with password...');
        const user = await prismaClient.user.findFirst({
            where: {
                AND: [
                    { email: testEmail },
                    { role: 'admin' }
                ]
            },
            select: { id: true, name: true, email: true, password: true, role: true }
        });

        if (!user) {
            console.log('❌ User not found in second query!');
            return;
        }
        console.log(`✅ User fetched: ${user.name}\n`);

        // Step 4: Verify password
        console.log('Step 4: Verifying password...');
        console.log(`Password hash: ${user.password.substring(0, 30)}...`);

        const isPasswordValid = await bcrypt.compare(testPassword, user.password);

        if (!isPasswordValid) {
            console.log('❌ Password is INVALID!');
            console.log('\n🔍 Debugging password:');
            console.log(`  Input password: "${testPassword}"`);
            console.log(`  Hash in DB: ${user.password}`);

            // Try to create a new hash and compare
            console.log('\n🧪 Creating new hash for comparison...');
            const newHash = await bcrypt.hash(testPassword, 10);
            console.log(`  New hash: ${newHash}`);
            const testCompare = await bcrypt.compare(testPassword, newHash);
            console.log(`  New hash validates: ${testCompare}`);

            return;
        }
        console.log('✅ Password is VALID!\n');

        console.log('🎉 All checks passed! Login should work.');

    } catch (error) {
        console.error('❌ Error during test:', error);
    } finally {
        await prismaClient.$disconnect();
    }
}

testAdminLogin();
