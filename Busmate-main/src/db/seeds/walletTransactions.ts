import { db } from '@/db';
import { walletTransactions } from '@/db/schema';

async function main() {
    const sampleTransactions = [
        // Wallet 1 (test_user_001) - Starting balance: 0, Ending: 2500.00
        {
            walletId: 1,
            userId: "test_user_001",
            type: "credit",
            amount: "1000.00",
            balanceAfter: "1000.00",
            description: "Added money via UPI",
            referenceId: "pay_TXN123456",
            status: "completed",
            createdAt: new Date("2024-09-15T10:30:00")
        },
        {
            walletId: 1,
            userId: "test_user_001",
            type: "debit",
            amount: "250.00",
            balanceAfter: "750.00",
            description: "Booking payment for #BM12A4X9",
            referenceId: "booking_001",
            status: "completed",
            createdAt: new Date("2024-09-18T14:20:00")
        },
        {
            walletId: 1,
            userId: "test_user_001",
            type: "credit",
            amount: "1500.00",
            balanceAfter: "2250.00",
            description: "Added money via UPI",
            referenceId: "pay_TXN789012",
            status: "completed",
            createdAt: new Date("2024-10-05T09:15:00")
        },
        {
            walletId: 1,
            userId: "test_user_001",
            type: "debit",
            amount: "350.00",
            balanceAfter: "1900.00",
            description: "Booking payment for #BM45Z7Y2",
            referenceId: "booking_002",
            status: "completed",
            createdAt: new Date("2024-10-12T16:45:00")
        },
        {
            walletId: 1,
            userId: "test_user_001",
            type: "credit",
            amount: "150.00",
            balanceAfter: "2050.00",
            description: "Refund for cancelled booking",
            referenceId: "refund_001",
            status: "completed",
            createdAt: new Date("2024-10-15T11:30:00")
        },
        {
            walletId: 1,
            userId: "test_user_001",
            type: "credit",
            amount: "800.00",
            balanceAfter: "2850.00",
            description: "Added money via Debit Card",
            referenceId: "pay_TXN345678",
            status: "completed",
            createdAt: new Date("2024-11-01T08:20:00")
        },
        {
            walletId: 1,
            userId: "test_user_001",
            type: "debit",
            amount: "350.00",
            balanceAfter: "2500.00",
            description: "Booking payment for #BM89K3L5",
            referenceId: "booking_003",
            status: "completed",
            createdAt: new Date("2024-11-10T13:15:00")
        },

        // Wallet 2 (test_user_002) - Starting balance: 0, Ending: 1850.50
        {
            walletId: 2,
            userId: "test_user_002",
            type: "credit",
            amount: "800.00",
            balanceAfter: "800.00",
            description: "Added money via UPI",
            referenceId: "pay_TXN901234",
            status: "completed",
            createdAt: new Date("2024-09-20T12:00:00")
        },
        {
            walletId: 2,
            userId: "test_user_002",
            type: "debit",
            amount: "180.50",
            balanceAfter: "619.50",
            description: "Booking payment for #BM56P8Q1",
            referenceId: "booking_004",
            status: "completed",
            createdAt: new Date("2024-09-25T15:30:00")
        },
        {
            walletId: 2,
            userId: "test_user_002",
            type: "debit",
            amount: "220.00",
            balanceAfter: "399.50",
            description: "Booking payment for #BM34R5T7",
            referenceId: "booking_005",
            status: "completed",
            createdAt: new Date("2024-10-08T10:45:00")
        },
        {
            walletId: 2,
            userId: "test_user_002",
            type: "credit",
            amount: "1200.00",
            balanceAfter: "1599.50",
            description: "Added money via UPI",
            referenceId: "pay_TXN567890",
            status: "completed",
            createdAt: new Date("2024-10-20T09:00:00")
        },
        {
            walletId: 2,
            userId: "test_user_002",
            type: "debit",
            amount: "299.00",
            balanceAfter: "1300.50",
            description: "Booking payment for #BM78W9X2",
            referenceId: "booking_006",
            status: "completed",
            createdAt: new Date("2024-10-28T17:20:00")
        },
        {
            walletId: 2,
            userId: "test_user_002",
            type: "credit",
            amount: "750.00",
            balanceAfter: "2050.50",
            description: "Added money via Debit Card",
            referenceId: "pay_TXN123789",
            status: "completed",
            createdAt: new Date("2024-11-05T14:10:00")
        },
        {
            walletId: 2,
            userId: "test_user_002",
            type: "debit",
            amount: "200.00",
            balanceAfter: "1850.50",
            description: "Booking payment for #BM23Y4Z6",
            referenceId: "booking_007",
            status: "completed",
            createdAt: new Date("2024-11-12T11:50:00")
        },

        // Wallet 3 (test_user_003) - Starting balance: 0, Ending: 450.00
        {
            walletId: 3,
            userId: "test_user_003",
            type: "credit",
            amount: "500.00",
            balanceAfter: "500.00",
            description: "Added money via UPI",
            referenceId: "pay_TXN456123",
            status: "completed",
            createdAt: new Date("2024-10-01T10:15:00")
        },
        {
            walletId: 3,
            userId: "test_user_003",
            type: "debit",
            amount: "175.00",
            balanceAfter: "325.00",
            description: "Booking payment for #BM67B8C9",
            referenceId: "booking_008",
            status: "completed",
            createdAt: new Date("2024-10-10T13:40:00")
        },
        {
            walletId: 3,
            userId: "test_user_003",
            type: "credit",
            amount: "400.00",
            balanceAfter: "725.00",
            description: "Added money via UPI",
            referenceId: "pay_TXN789456",
            status: "completed",
            createdAt: new Date("2024-10-25T16:25:00")
        },
        {
            walletId: 3,
            userId: "test_user_003",
            type: "debit",
            amount: "325.00",
            balanceAfter: "400.00",
            description: "Booking payment for #BM12D3E4",
            referenceId: "booking_009",
            status: "completed",
            createdAt: new Date("2024-11-03T09:30:00")
        },
        {
            walletId: 3,
            userId: "test_user_003",
            type: "credit",
            amount: "100.00",
            balanceAfter: "500.00",
            description: "Refund for cancelled booking",
            referenceId: "refund_002",
            status: "completed",
            createdAt: new Date("2024-11-08T12:00:00")
        },
        {
            walletId: 3,
            userId: "test_user_003",
            type: "debit",
            amount: "50.00",
            balanceAfter: "450.00",
            description: "Booking payment for #BM45F6G7",
            referenceId: "booking_010",
            status: "completed",
            createdAt: new Date("2024-11-14T15:45:00")
        }
    ];

    await db.insert(walletTransactions).values(sampleTransactions);
    
    console.log('✅ Wallet transactions seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});