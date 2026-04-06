import { db } from "../src/db";
import { vehicles, drivers, user } from "../src/db/schema";
import { eq } from "drizzle-orm";

async function seed() {
  console.log("Seeding started...");

  try {
    // 1. Create a dummy user if not exists
    const guestUser = await db.insert(user).values({
      id: "user_2shSTNpxOf0p6D4YfGf1T", // Dummy ID
      name: "Guest User",
      email: "guest@example.com",
    }).onDuplicateKeyUpdate({ set: { name: "Guest User" } });

    // 2. Create a dummy driver if not exists
    const existingDriver = await db.select().from(drivers).where(eq(drivers.email, "driver@busmate.com")).limit(1);
    let driverId: number;

    if (existingDriver.length === 0) {
      const newDriver = await db.insert(drivers).values({
        userId: "user_2shSTNpxOf0p6D4YfGf1T",
        name: "Professional Driver",
        email: "driver@busmate.com",
        phone: "9876543210",
        vehicleType: "government-bus",
        vehicleNumber: "UP-32-BZ-1234",
        licenseNumber: "DL-123456789",
        status: "active",
        verificationStatus: "verified",
      });
      driverId = (newDriver as any)[0].insertId;
    } else {
      driverId = existingDriver[0].id;
    }

    // 3. Clear existing vehicles for clean seed (optional)
    // await db.delete(vehicles);

    // 4. Seed vehicles
    const vehiclesToSeed = [
      {
        driverId,
        type: "government-bus",
        number: "UP-32-BZ-1001",
        model: "UPSRTC Express",
        capacity: 40,
        image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&auto=format&fit=crop&q=60",
        description: "Reliable government service connecting major cities in Uttar Pradesh.",
        fare: "₹50-80",
        status: "available",
        currentRoute: "Lucknow - Kanpur",
      },
      {
        driverId,
        type: "private-bus",
        number: "DL-01-PA-2002",
        model: "MetroWay Luxury",
        capacity: 35,
        image: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=800&auto=format&fit=crop&q=60",
        description: "Premium AC travel with reclining seats and onboard entertainment.",
        fare: "₹150-250",
        status: "available",
        currentRoute: "Delhi - Agra",
      },
      {
        driverId,
        type: "chartered-bus",
        number: "HR-55-CB-3003",
        model: "Party Cruiser",
        capacity: 25,
        image: "https://images.unsplash.com/photo-1562620644-85bc09f89427?w=800&auto=format&fit=crop&q=60",
        description: "Exclusive bus rentals for weddings, corporate events, and tours.",
        fare: "₹5000/day",
        status: "available",
        currentRoute: "Custom Routes",
      },
    ];

    for (const v of vehiclesToSeed) {
      await db.insert(vehicles).values(v).onDuplicateKeyUpdate({ set: v });
    }

    console.log("Seeding completed successfully!");
  } catch (error) {
    console.error("Seeding failed:", error);
  }
}

seed();
