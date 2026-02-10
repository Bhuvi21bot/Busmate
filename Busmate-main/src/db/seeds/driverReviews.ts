import { db } from '@/db';
import { driverReviews } from '@/db/schema';

async function main() {
    const sampleReviews = [
        // 5-star reviews (10 reviews)
        {
            driverId: 1,
            customerId: 'CUST001',
            customerName: 'Priya Sharma',
            rating: 5,
            comment: 'Excellent driver! Very punctual and professional. Rajesh made the journey comfortable and safe.',
            rideId: 1,
            createdAt: '2024-10-15T09:30:00.000Z',
            updatedAt: '2024-10-15T09:30:00.000Z'
        },
        {
            driverId: 1,
            customerId: 'CUST002',
            customerName: 'Amit Patel',
            rating: 5,
            comment: 'Best ride experience. Clean bus and safe driving. Highly recommend Rajesh!',
            rideId: 2,
            createdAt: '2024-10-22T14:15:00.000Z',
            updatedAt: '2024-10-22T14:15:00.000Z'
        },
        {
            driverId: 1,
            customerId: 'CUST003',
            customerName: 'Sneha Reddy',
            rating: 5,
            comment: 'Rajesh is very friendly and helpful. Always on time and drives smoothly. Excellent service!',
            rideId: 3,
            createdAt: '2024-11-05T08:45:00.000Z',
            updatedAt: '2024-11-05T08:45:00.000Z'
        },
        {
            driverId: 1,
            customerId: 'CUST004',
            customerName: 'Rahul Verma',
            rating: 5,
            comment: 'Outstanding driver! Very courteous and follows all traffic rules. Vehicle is always clean.',
            rideId: null,
            createdAt: '2024-11-12T16:20:00.000Z',
            updatedAt: '2024-11-12T16:20:00.000Z'
        },
        {
            driverId: 1,
            customerId: 'CUST005',
            customerName: 'Kavita Singh',
            rating: 5,
            comment: 'Perfect ride! Rajesh is extremely professional and maintains the bus very well. Five stars!',
            rideId: 4,
            createdAt: '2024-11-18T10:30:00.000Z',
            updatedAt: '2024-11-18T10:30:00.000Z'
        },
        {
            driverId: 1,
            customerId: 'CUST006',
            customerName: 'Arjun Mehta',
            rating: 5,
            comment: 'Excellent service! Always punctual and drives very safely. Great experience every time.',
            rideId: 5,
            createdAt: '2024-11-25T13:00:00.000Z',
            updatedAt: '2024-11-25T13:00:00.000Z'
        },
        {
            driverId: 1,
            customerId: 'CUST007',
            customerName: 'Deepika Nair',
            rating: 5,
            comment: 'Best driver in the service! Very polite, helpful, and maintains excellent cleanliness.',
            rideId: null,
            createdAt: '2024-12-02T07:45:00.000Z',
            updatedAt: '2024-12-02T07:45:00.000Z'
        },
        {
            driverId: 1,
            customerId: 'CUST008',
            customerName: 'Vikram Joshi',
            rating: 5,
            comment: 'Fantastic ride! Rajesh is very professional and the bus is always spotless. Highly recommended!',
            rideId: 6,
            createdAt: '2024-12-08T15:30:00.000Z',
            updatedAt: '2024-12-08T15:30:00.000Z'
        },
        {
            driverId: 1,
            customerId: 'CUST009',
            customerName: 'Anita Desai',
            rating: 5,
            comment: 'Superb experience! Very safe driver and always on schedule. Keep up the great work!',
            rideId: null,
            createdAt: '2024-12-12T11:15:00.000Z',
            updatedAt: '2024-12-12T11:15:00.000Z'
        },
        {
            driverId: 1,
            customerId: 'CUST010',
            customerName: 'Sanjay Kumar',
            rating: 5,
            comment: 'Outstanding driver! Very friendly, punctual, and professional. Five-star service all the way!',
            rideId: 1,
            createdAt: '2024-12-15T09:00:00.000Z',
            updatedAt: '2024-12-15T09:00:00.000Z'
        },
        
        // 4-star reviews (5 reviews)
        {
            driverId: 1,
            customerId: 'CUST011',
            customerName: 'Meera Iyer',
            rating: 4,
            comment: 'Good driver but could improve on time management. Sometimes delayed by 5-10 minutes.',
            rideId: 2,
            createdAt: '2024-10-28T12:30:00.000Z',
            updatedAt: '2024-10-28T12:30:00.000Z'
        },
        {
            driverId: 1,
            customerId: 'CUST012',
            customerName: 'Rajiv Kapoor',
            rating: 4,
            comment: 'Nice service overall. Vehicle could be cleaner but driving is smooth and safe.',
            rideId: 3,
            createdAt: '2024-11-08T14:45:00.000Z',
            updatedAt: '2024-11-08T14:45:00.000Z'
        },
        {
            driverId: 1,
            customerId: 'CUST013',
            customerName: 'Pooja Gupta',
            rating: 4,
            comment: 'Professional driver and smooth ride. Good experience but sometimes takes longer routes.',
            rideId: null,
            createdAt: '2024-11-20T16:00:00.000Z',
            updatedAt: '2024-11-20T16:00:00.000Z'
        },
        {
            driverId: 1,
            customerId: 'CUST014',
            customerName: 'Karthik Rao',
            rating: 4,
            comment: 'Good service. Driver is polite and helpful. Bus could be maintained better.',
            rideId: 4,
            createdAt: '2024-12-01T10:20:00.000Z',
            updatedAt: '2024-12-01T10:20:00.000Z'
        },
        {
            driverId: 1,
            customerId: 'CUST015',
            customerName: 'Nisha Agarwal',
            rating: 4,
            comment: 'Nice driver, safe journey. Would give 5 stars if punctuality improves.',
            rideId: null,
            createdAt: '2024-12-10T08:30:00.000Z',
            updatedAt: '2024-12-10T08:30:00.000Z'
        },
        
        // 3-star reviews (3 reviews)
        {
            driverId: 1,
            customerId: 'CUST016',
            customerName: 'Suresh Pillai',
            rating: 3,
            comment: 'Average experience. Driver was late by 15 minutes which caused inconvenience.',
            rideId: 5,
            createdAt: '2024-11-15T17:00:00.000Z',
            updatedAt: '2024-11-15T17:00:00.000Z'
        },
        {
            driverId: 1,
            customerId: 'CUST017',
            customerName: 'Lakshmi Krishnan',
            rating: 3,
            comment: 'Okay service but bus was not very clean. Driver needs to improve on maintenance.',
            rideId: 6,
            createdAt: '2024-11-28T13:45:00.000Z',
            updatedAt: '2024-11-28T13:45:00.000Z'
        },
        {
            driverId: 1,
            customerId: 'CUST018',
            customerName: 'Manish Trivedi',
            rating: 3,
            comment: 'Driver was fine but route took longer than expected. Average overall experience.',
            rideId: null,
            createdAt: '2024-12-05T15:15:00.000Z',
            updatedAt: '2024-12-05T15:15:00.000Z'
        }
    ];

    await db.insert(driverReviews).values(sampleReviews);
    
    console.log('✅ Driver reviews seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});