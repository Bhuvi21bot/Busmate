import { db } from '@/db';
import { customerProfiles } from '@/db/schema';

async function main() {
    const sampleCustomerProfiles = [
        {
            userId: 'TEu8VB1NnDXbBdv22B99eFal54MN0WBb',
            phone: '+91-9876543210',
            address: '123, MG Road, Residency Area',
            city: 'Bangalore',
            state: 'Karnataka',
            pincode: '560001',
            emergencyContact: '+91-9988776655',
            emergencyContactName: 'Ravi Kumar (Brother)',
            createdAt: '2024-01-10T08:00:00.000Z',
            updatedAt: '2024-12-15T10:30:00.000Z',
        }
    ];

    await db.insert(customerProfiles).values(sampleCustomerProfiles);
    
    console.log('✅ Customer profiles seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});