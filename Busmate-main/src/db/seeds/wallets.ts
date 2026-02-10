import { db } from '@/db';
import { wallets } from '@/db/schema';

async function main() {
    const sampleWallets = [
        {
            userId: 'test_user_001',
            balance: '2500.00',
            currency: 'INR',
            createdAt: new Date('2024-06-15'),
            updatedAt: new Date('2024-12-20'),
        },
        {
            userId: 'test_user_002',
            balance: '1850.50',
            currency: 'INR',
            createdAt: new Date('2024-07-22'),
            updatedAt: new Date('2024-12-18'),
        },
        {
            userId: 'test_user_003',
            balance: '450.00',
            currency: 'INR',
            createdAt: new Date('2024-08-10'),
            updatedAt: new Date('2024-12-19'),
        },
    ];

    await db.insert(wallets).values(sampleWallets);
    
    console.log('✅ Wallets seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});