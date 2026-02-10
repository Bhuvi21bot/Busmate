import { db } from '@/db';
import { customerSettings } from '@/db/schema';

async function main() {
    const sampleCustomerSettings = [
        {
            userId: 'TEu8VB1NnDXbBdv22B99eFal54MN0WBb',
            notificationsEnabled: 1,
            emailNotifications: 1,
            smsNotifications: 1,
            rideReminders: 1,
            promotionalEmails: 0,
            language: 'en',
            theme: 'light',
            createdAt: '2024-01-10T08:00:00.000Z',
            updatedAt: '2024-12-05T16:45:00.000Z',
        }
    ];

    await db.insert(customerSettings).values(sampleCustomerSettings);
    
    console.log('✅ Customer settings seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});