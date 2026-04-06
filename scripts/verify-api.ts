import { db } from "../src/db";
import { vehicles, bookings, user } from "../src/db/schema";
import { eq } from "drizzle-orm";

async function verify() {
  console.log("Verification started...");

  try {
    // 1. Check vehicles
    const allVehicles = await db.select().from(vehicles);
    console.log(`Found ${allVehicles.length} vehicles in database.`);
    
    // 2. Test booking insert
    console.log("Testing booking insert logic...");
    const dummyBooking = {
      userId: "user_2shSTNpxOf0p6D4YfGf1T",
      pickupLocation: "Lucknow",
      dropLocation: "Kanpur",
      pickupTime: new Date(), // Use Date object
      vehicleType: "government-bus",
      passengers: 2,
      seats: JSON.stringify(["1A", "1B"]),
      fare: 120.50,
      status: "confirmed",
      paymentStatus: "paid",
      confirmationCode: "TEST-" + Math.random().toString(36).substring(2, 6).toUpperCase(),
    };
    
    try {
      await db.insert(bookings).values(dummyBooking);
      console.log("✅ Booking insert test passed!");
    } catch (e: any) {
      console.error("❌ Booking insert failed:", e.message);
      if (e.sql) console.log("SQL:", e.sql);
    }

    console.log("Verification completed successfully!");
  } catch (error: any) {
    console.error("Verification failed unexpectedly:", error.message);
  }
}

verify();
