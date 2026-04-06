import { db } from '@/db';
import { reviews } from '@/db/schema';

async function main() {
    const sampleReviews = [
        {
            bookingId: 1,
            userId: "test_user_001",
            driverId: 1,
            rating: 5,
            comment: "Excellent driver! Very punctual and professional. The bus was clean and the ride was smooth.",
            createdAt: new Date("2024-11-02T14:00:00")
        },
        {
            bookingId: 2,
            userId: "test_user_001",
            driverId: 2,
            rating: 5,
            comment: "Outstanding service! Driver was courteous and the vehicle was in perfect condition. Highly recommend!",
            createdAt: new Date("2024-11-03T11:30:00")
        },
        {
            bookingId: 3,
            userId: "test_user_001",
            driverId: 3,
            rating: 4,
            comment: "Good service overall. Driver was friendly and the journey was comfortable. Would book again.",
            createdAt: new Date("2024-11-04T16:45:00")
        },
        {
            bookingId: 4,
            userId: "test_user_001",
            driverId: 4,
            rating: 5,
            comment: "Amazing experience! Driver helped with luggage and took the fastest route. Five stars!",
            createdAt: new Date("2024-11-05T10:15:00")
        },
        {
            bookingId: 5,
            userId: "test_user_001",
            driverId: 5,
            rating: 3,
            comment: "Average service. Driver was okay but could be more communicative about the route and arrival time.",
            createdAt: new Date("2024-11-06T13:20:00")
        },
        {
            bookingId: 6,
            userId: "test_user_001",
            driverId: 6,
            rating: 5,
            comment: "Perfect ride! Driver was professional, vehicle was spotless, and arrived exactly on time. Will definitely book again.",
            createdAt: new Date("2024-11-07T09:00:00")
        },
        {
            bookingId: 7,
            userId: "test_user_001",
            driverId: 7,
            rating: 4,
            comment: "Good experience. Driver was polite and the ride was comfortable. Only minor delay at pickup.",
            createdAt: new Date("2024-11-08T15:30:00")
        },
        {
            bookingId: 8,
            userId: "test_user_001",
            driverId: 8,
            rating: 5,
            comment: "Exceptional service! Driver went above and beyond to ensure a comfortable journey. Highly professional.",
            createdAt: new Date("2024-11-09T12:00:00")
        },
        {
            bookingId: 9,
            userId: "test_user_001",
            driverId: 1,
            rating: 2,
            comment: "Driver was late by 20 minutes without prior notice. However, they were apologetic and the ride itself was fine.",
            createdAt: new Date("2024-11-10T11:45:00")
        },
        {
            bookingId: 10,
            userId: "test_user_001",
            driverId: 2,
            rating: 4,
            comment: "Pleasant journey. Driver was experienced and knew the routes well. Vehicle could have been cleaner though.",
            createdAt: new Date("2024-11-11T14:20:00")
        },
        {
            bookingId: 11,
            userId: "test_user_001",
            driverId: 3,
            rating: 5,
            comment: "Fantastic service from start to finish! Driver was friendly, helpful, and maintained excellent driving standards.",
            createdAt: new Date("2024-11-12T10:30:00")
        },
        {
            bookingId: 12,
            userId: "test_user_001",
            driverId: 4,
            rating: 3,
            comment: "Decent service. The ride was fine but expected better communication about pickup location and timing.",
            createdAt: new Date("2024-11-13T16:00:00")
        }
    ];

    await db.insert(reviews).values(sampleReviews);
    
    console.log('✅ Reviews seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});