import { db } from '@/db';
import { driversNew } from '@/db/schema';

async function main() {
    const sampleDrivers = [
        {
            userId: 'drv_RAJ2024FEB15',
            licenseNumber: 'MH-0120180012345',
            phone: '9876543210',
            experienceYears: 15,
            rating: 4.8,
            totalTrips: 485,
            status: 'available',
            verificationStatus: 'verified',
            createdAt: new Date('2024-02-15').toISOString(),
            updatedAt: new Date('2024-12-10').toISOString(),
        },
        {
            userId: 'drv_ASL2024MAR20',
            licenseNumber: 'DL-1420190034567',
            phone: '8765432109',
            experienceYears: 12,
            rating: 4.9,
            totalTrips: 412,
            status: 'on-trip',
            verificationStatus: 'verified',
            createdAt: new Date('2024-03-20').toISOString(),
            updatedAt: new Date('2024-12-15').toISOString(),
        },
        {
            userId: 'drv_SUR2024APR10',
            licenseNumber: 'TS-0920200045678',
            phone: '9123456789',
            experienceYears: 10,
            rating: 4.5,
            totalTrips: 356,
            status: 'available',
            verificationStatus: 'verified',
            createdAt: new Date('2024-04-10').toISOString(),
            updatedAt: new Date('2024-12-12').toISOString(),
        },
        {
            userId: 'drv_AMI2024MAY05',
            licenseNumber: 'HR-5120210056789',
            phone: '9988776655',
            experienceYears: 8,
            rating: 4.6,
            totalTrips: 298,
            status: 'available',
            verificationStatus: 'verified',
            createdAt: new Date('2024-05-05').toISOString(),
            updatedAt: new Date('2024-12-14').toISOString(),
        },
        {
            userId: 'drv_VIJ2024JUN18',
            licenseNumber: 'UP-8020220067890',
            phone: '8899776655',
            experienceYears: 7,
            rating: 4.2,
            totalTrips: 245,
            status: 'available',
            verificationStatus: 'verified',
            createdAt: new Date('2024-06-18').toISOString(),
            updatedAt: new Date('2024-12-11').toISOString(),
        },
        {
            userId: 'drv_MOH2024JUL22',
            licenseNumber: 'KA-0320210078901',
            phone: '7788996655',
            experienceYears: 5,
            rating: 5.0,
            totalTrips: 189,
            status: 'on-trip',
            verificationStatus: 'verified',
            createdAt: new Date('2024-07-22').toISOString(),
            updatedAt: new Date('2024-12-16').toISOString(),
        },
        {
            userId: 'drv_RAM2024AUG30',
            licenseNumber: 'GJ-0120230089012',
            phone: '9876012345',
            experienceYears: 3,
            rating: 3.8,
            totalTrips: 87,
            status: 'offline',
            verificationStatus: 'pending',
            createdAt: new Date('2024-08-30').toISOString(),
            updatedAt: new Date('2024-12-13').toISOString(),
        },
        {
            userId: 'drv_KIR2024OCT12',
            licenseNumber: 'RJ-1420240090123',
            phone: '8765098765',
            experienceYears: 2,
            rating: 3.5,
            totalTrips: 52,
            status: 'available',
            verificationStatus: 'rejected',
            createdAt: new Date('2024-10-12').toISOString(),
            updatedAt: new Date('2024-12-09').toISOString(),
        },
    ];

    await db.insert(driversNew).values(sampleDrivers);
    
    console.log('✅ Drivers seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});