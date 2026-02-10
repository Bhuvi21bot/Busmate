import { db } from '@/db';
import { driverWallets } from '@/db/schema';

async function main() {
    console.log('🚀 Starting driver wallets seeder...');
    
    const sampleWallets = [
        {
            driverId: 1,
            totalEarnings: 4850.50,
            pendingPayouts: 1200.00,
            lastPayoutAmount: 3500.00,
            lastPayoutDate: '2024-12-15T10:00:00.000Z',
            status: 'active',
            createdAt: '2024-01-18T00:00:00.000Z',
            updatedAt: '2024-12-15T10:00:00.000Z',
        },
        {
            driverId: 2,
            totalEarnings: 3200.75,
            pendingPayouts: 800.50,
            lastPayoutAmount: 2400.25,
            lastPayoutDate: '2024-12-10T14:30:00.000Z',
            status: 'active',
            createdAt: '2024-02-13T00:00:00.000Z',
            updatedAt: '2024-12-10T14:30:00.000Z',
        },
        {
            driverId: 3,
            totalEarnings: 1850.00,
            pendingPayouts: 650.00,
            lastPayoutAmount: 1200.00,
            lastPayoutDate: '2024-12-05T09:15:00.000Z',
            status: 'active',
            createdAt: '2024-03-08T00:00:00.000Z',
            updatedAt: '2024-12-05T09:15:00.000Z',
        },
    ];

    console.log('📝 Sample wallets data:', JSON.stringify(sampleWallets, null, 2));

    const result = await db.insert(driverWallets).values(sampleWallets);
    
    console.log('📊 Insert result:', result);
    console.log('✅ Driver wallets seeder completed successfully');
    console.log(`🎯 Inserted ${sampleWallets.length} wallet records`);
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
    console.error('Error details:', JSON.stringify(error, null, 2));
});