import { db } from '@/db';
import { driverSettings } from '@/db/schema';

async function main() {
    const sampleDriverSettings = [
        {
            driverId: 1,
            notificationsEnabled: true,
            emailNotifications: true,
            smsNotifications: true,
            autoAcceptRides: false,
            availabilityStatus: 'available',
            preferredRoutes: JSON.stringify([
                'Connaught Place to IGI Airport',
                'Rajouri Garden to Noida Sector 18',
                'Karol Bagh to Gurugram Cyber Hub'
            ]),
            language: 'en',
            theme: 'light',
            createdAt: new Date('2024-01-17T14:20:00.000Z').toISOString(),
            updatedAt: new Date('2024-12-10T09:00:00.000Z').toISOString(),
        },
        {
            driverId: 2,
            notificationsEnabled: true,
            emailNotifications: false,
            smsNotifications: true,
            autoAcceptRides: true,
            availabilityStatus: 'busy',
            preferredRoutes: JSON.stringify([
                'Bandra to Andheri',
                'Churchgate to Navi Mumbai',
                'Colaba to Thane'
            ]),
            language: 'hi',
            theme: 'dark',
            createdAt: new Date('2024-02-12T11:30:00.000Z').toISOString(),
            updatedAt: new Date('2024-12-15T16:30:00.000Z').toISOString(),
        },
        {
            driverId: 3,
            notificationsEnabled: true,
            emailNotifications: true,
            smsNotifications: false,
            autoAcceptRides: false,
            availabilityStatus: 'offline',
            preferredRoutes: JSON.stringify([
                'Koramangala to BTM Layout',
                'Indiranagar to MG Road'
            ]),
            language: 'en',
            theme: 'light',
            createdAt: new Date('2024-03-07T16:10:00.000Z').toISOString(),
            updatedAt: new Date('2024-12-14T10:15:00.000Z').toISOString(),
        }
    ];

    await db.insert(driverSettings).values(sampleDriverSettings);
    
    console.log('✅ Driver settings seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});