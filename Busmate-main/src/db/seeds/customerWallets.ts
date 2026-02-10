import { db } from '@/db';
import { customerWallets } from '@/db/schema';

async function main() {
    const sampleWallets = [
        {
            userId: 'TEu8VB1NnDXbBdv22B99eFal54MN0WBb',
            balance: 500.00,
            totalSpent: 1500.00,
            totalAdded: 2000.00,
            status: 'active',
            createdAt: '2024-01-10T08:00:00.000Z',
            updatedAt: '2024-12-18T14:20:00.000Z',
        },
    ];

    await db.insert(customerWallets).values(sampleWallets);
    
    console.log('✅ Customer wallets seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});