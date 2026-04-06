import { db } from '@/db';
import { driverRides } from '@/db/schema';

async function main() {
    const sampleRides = [
        // Driver 1 (Rajesh - driverId: 1) - 6 rides
        {
            driverId: 1,
            rideNumber: 'RIDE20241201001',
            date: '2024-12-01T08:30:00.000Z',
            route: 'Connaught Place to IGI Airport',
            fare: 450.00,
            passengerCount: 3,
            status: 'completed',
            createdAt: '2024-12-01T08:30:00.000Z',
        },
        {
            driverId: 1,
            rideNumber: 'RIDE20241203001',
            date: '2024-12-03T10:15:00.000Z',
            route: 'Rajouri Garden to Noida Sector 18',
            fare: 320.00,
            passengerCount: 2,
            status: 'completed',
            createdAt: '2024-12-03T10:15:00.000Z',
        },
        {
            driverId: 1,
            rideNumber: 'RIDE20241205001',
            date: '2024-12-05T14:45:00.000Z',
            route: 'Karol Bagh to Gurugram Cyber Hub',
            fare: 580.00,
            passengerCount: 4,
            status: 'completed',
            createdAt: '2024-12-05T14:45:00.000Z',
        },
        {
            driverId: 1,
            rideNumber: 'RIDE20241208001',
            date: '2024-12-08T09:00:00.000Z',
            route: 'Dwarka to Anand Vihar',
            fare: 390.00,
            passengerCount: 2,
            status: 'completed',
            createdAt: '2024-12-08T09:00:00.000Z',
        },
        {
            driverId: 1,
            rideNumber: 'RIDE20241212001',
            date: '2024-12-12T16:20:00.000Z',
            route: 'Saket to Ghaziabad',
            fare: 410.00,
            passengerCount: 3,
            status: 'completed',
            createdAt: '2024-12-12T16:20:00.000Z',
        },
        {
            driverId: 1,
            rideNumber: 'RIDE20241215001',
            date: '2024-12-15T11:30:00.000Z',
            route: 'Nehru Place to Faridabad',
            fare: 350.00,
            passengerCount: 2,
            status: 'cancelled',
            createdAt: '2024-12-15T11:30:00.000Z',
        },
        // Driver 2 (Aslam - driverId: 2) - 5 rides
        {
            driverId: 2,
            rideNumber: 'RIDE20241202001',
            date: '2024-12-02T07:45:00.000Z',
            route: 'Bandra to Andheri',
            fare: 180.00,
            passengerCount: 1,
            status: 'completed',
            createdAt: '2024-12-02T07:45:00.000Z',
        },
        {
            driverId: 2,
            rideNumber: 'RIDE20241204001',
            date: '2024-12-04T12:00:00.000Z',
            route: 'Churchgate to Navi Mumbai',
            fare: 420.00,
            passengerCount: 3,
            status: 'completed',
            createdAt: '2024-12-04T12:00:00.000Z',
        },
        {
            driverId: 2,
            rideNumber: 'RIDE20241207001',
            date: '2024-12-07T15:30:00.000Z',
            route: 'Colaba to Thane',
            fare: 380.00,
            passengerCount: 2,
            status: 'completed',
            createdAt: '2024-12-07T15:30:00.000Z',
        },
        {
            driverId: 2,
            rideNumber: 'RIDE20241210001',
            date: '2024-12-10T08:15:00.000Z',
            route: 'Dadar to Borivali',
            fare: 250.00,
            passengerCount: 2,
            status: 'completed',
            createdAt: '2024-12-10T08:15:00.000Z',
        },
        {
            driverId: 2,
            rideNumber: 'RIDE20241213001',
            date: '2024-12-13T13:45:00.000Z',
            route: 'Powai to Juhu',
            fare: 320.00,
            passengerCount: 1,
            status: 'completed',
            createdAt: '2024-12-13T13:45:00.000Z',
        },
        // Driver 3 (Suresh - driverId: 3) - 4 rides
        {
            driverId: 3,
            rideNumber: 'RIDE20241206001',
            date: '2024-12-06T09:30:00.000Z',
            route: 'Koramangala to BTM Layout',
            fare: 80.00,
            passengerCount: 1,
            status: 'completed',
            createdAt: '2024-12-06T09:30:00.000Z',
        },
        {
            driverId: 3,
            rideNumber: 'RIDE20241209001',
            date: '2024-12-09T11:00:00.000Z',
            route: 'Indiranagar to MG Road',
            fare: 120.00,
            passengerCount: 2,
            status: 'completed',
            createdAt: '2024-12-09T11:00:00.000Z',
        },
        {
            driverId: 3,
            rideNumber: 'RIDE20241211001',
            date: '2024-12-11T14:15:00.000Z',
            route: 'Whitefield to Marathahalli',
            fare: 95.00,
            passengerCount: 1,
            status: 'completed',
            createdAt: '2024-12-11T14:15:00.000Z',
        },
        {
            driverId: 3,
            rideNumber: 'RIDE20241214001',
            date: '2024-12-14T16:45:00.000Z',
            route: 'HSR Layout to Electronic City',
            fare: 140.00,
            passengerCount: 2,
            status: 'completed',
            createdAt: '2024-12-14T16:45:00.000Z',
        },
    ];

    await db.insert(driverRides).values(sampleRides);
    
    console.log('✅ Driver rides seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});