import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { pickup, dropoff, vehicleType, passengers = 1 } = body

    if (!pickup || !dropoff || !vehicleType) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Calculate fare based on vehicle type and distance
    // In a real app, you would use a proper distance calculation API
    const baseFares: Record<string, number> = {
      "government-bus": 10,
      "private-bus": 15,
      "chartered-bus": 20,
      "e-rickshaw": 8,
    }

    const baseFare = baseFares[vehicleType] || 10
    
    // Simulate distance calculation (random between 5-50 km)
    const estimatedDistance = Math.floor(Math.random() * 45) + 5
    
    // Calculate fare
    const fare = Math.round(baseFare * estimatedDistance * parseInt(passengers))
    
    // Add some variation
    const minFare = Math.round(fare * 0.9)
    const maxFare = Math.round(fare * 1.1)

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    return NextResponse.json({
      fare,
      minFare,
      maxFare,
      estimatedDistance,
      baseFare,
      vehicleType,
      breakdown: {
        baseRate: `₹${baseFare}/km`,
        distance: `${estimatedDistance} km`,
        passengers: parseInt(passengers),
        total: `₹${fare}`,
      },
    })
  } catch (error) {
    console.error("Fare estimate error:", error)
    return NextResponse.json(
      { error: "Failed to estimate fare" },
      { status: 500 }
    )
  }
}
