import { db } from '@/db';
import { drivers } from '@/db/schema';

async function main() {
    const sampleDrivers = [
        {
            userId: "drv_RAJ2024_001",
            name: "Rajesh Kumar Singh",
            email: "rajesh.kumar@busdriver.in",
            phone: "9876543210",
            vehicleType: "government-bus",
            vehicleNumber: "MH-01-AB-1234",
            licenseNumber: "MH-0120180012345",
            licenseImage: "/uploads/licenses/license_001.jpg",
            vehicleImage: "/uploads/vehicles/vehicle_001.jpg",
            status: "approved",
            rating: "4.85",
            totalRides: 485,
            verificationStatus: "verified",
            createdAt: new Date("2024-02-15"),
            updatedAt: new Date("2024-12-20")
        },
        {
            userId: "drv_ASL2024_002",
            name: "Aslam Mohammed Khan",
            email: "aslam.khan@busdriver.in",
            phone: "9123456789",
            vehicleType: "private-bus",
            vehicleNumber: "DL-10-XY-5678",
            licenseNumber: "DL-1420190034567",
            licenseImage: "/uploads/licenses/license_002.jpg",
            vehicleImage: "/uploads/vehicles/vehicle_002.jpg",
            status: "approved",
            rating: "4.92",
            totalRides: 658,
            verificationStatus: "verified",
            createdAt: new Date("2024-03-20"),
            updatedAt: new Date("2024-12-18")
        },
        {
            userId: "drv_VEN2024_003",
            name: "Venkatesh Narayanan",
            email: "venkatesh.n@busdriver.in",
            phone: "8765432109",
            vehicleType: "chartered-bus",
            vehicleNumber: "KA-05-CD-9012",
            licenseNumber: "KA-0520200045678",
            licenseImage: "/uploads/licenses/license_003.jpg",
            vehicleImage: "/uploads/vehicles/vehicle_003.jpg",
            status: "approved",
            rating: "4.78",
            totalRides: 372,
            verificationStatus: "verified",
            createdAt: new Date("2024-04-10"),
            updatedAt: new Date("2024-12-22")
        },
        {
            userId: "drv_SUR2024_004",
            name: "Suresh Prakash Yadav",
            email: "suresh.yadav@busdriver.in",
            phone: "9988776655",
            vehicleType: "government-bus",
            vehicleNumber: "UP-32-EF-3456",
            licenseNumber: "UP-3220180056789",
            licenseImage: "/uploads/licenses/license_004.jpg",
            vehicleImage: "/uploads/vehicles/vehicle_004.jpg",
            status: "approved",
            rating: "4.65",
            totalRides: 523,
            verificationStatus: "verified",
            createdAt: new Date("2024-05-05"),
            updatedAt: new Date("2024-12-19")
        },
        {
            userId: "drv_RAM2024_005",
            name: "Ramesh Babu Chandra",
            phone: "8899001122",
            vehicleType: "private-bus",
            vehicleNumber: "TN-09-GH-7890",
            licenseNumber: "TN-0920190067890",
            licenseImage: "/uploads/licenses/license_005.jpg",
            vehicleImage: "/uploads/vehicles/vehicle_005.jpg",
            status: "approved",
            rating: "4.88",
            totalRides: 712,
            verificationStatus: "verified",
            createdAt: new Date("2024-06-12"),
            updatedAt: new Date("2024-12-21")
        },
        {
            userId: "drv_GAN2024_006",
            name: "Ganesh Patil Deshmukh",
            email: "ganesh.patil@busdriver.in",
            phone: "7766554433",
            vehicleType: "chartered-bus",
            vehicleNumber: "MH-12-IJ-2345",
            licenseNumber: "MH-1220200078901",
            licenseImage: "/uploads/licenses/license_006.jpg",
            vehicleImage: "/uploads/vehicles/vehicle_006.jpg",
            status: "approved",
            rating: "4.72",
            totalRides: 289,
            verificationStatus: "verified",
            createdAt: new Date("2024-07-18"),
            updatedAt: new Date("2024-12-17")
        },
        {
            userId: "drv_VIJ2024_007",
            name: "Vijay Kumar Sharma",
            phone: "9654321098",
            vehicleType: "government-bus",
            vehicleNumber: "RJ-14-KL-6789",
            licenseNumber: "RJ-1420190089012",
            licenseImage: "/uploads/licenses/license_007.jpg",
            vehicleImage: "/uploads/vehicles/vehicle_007.jpg",
            status: "approved",
            rating: "4.95",
            totalRides: 847,
            verificationStatus: "verified",
            createdAt: new Date("2024-08-25"),
            updatedAt: new Date("2024-12-23")
        },
        {
            userId: "drv_SAT2024_008",
            name: "Satish Kumar Reddy",
            email: "satish.reddy@busdriver.in",
            phone: "8877665544",
            vehicleType: "private-bus",
            vehicleNumber: "AP-16-MN-4567",
            licenseNumber: "AP-1620180090123",
            licenseImage: "/uploads/licenses/license_008.jpg",
            vehicleImage: "/uploads/vehicles/vehicle_008.jpg",
            status: "approved",
            rating: "4.81",
            totalRides: 456,
            verificationStatus: "verified",
            createdAt: new Date("2024-09-08"),
            updatedAt: new Date("2024-12-16")
        }
    ];

    await db.insert(drivers).values(sampleDrivers);
    
    console.log('✅ Drivers seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});