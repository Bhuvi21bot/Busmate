import { NextRequest } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()

    if (!message) {
      return new Response(
        JSON.stringify({ error: "Message is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      )
    }

    // Create a streaming response
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      async start(controller) {
        const lower = message.toLowerCase()

        let response = ""

        // Route queries
        if (lower.includes("route") || lower.includes("where")) {
          response = "We serve multiple routes including City Center ↔ Airport, Downtown ↔ Suburb, and many more. You can check specific routes on our Vehicles page or book a ride to see available options for your destination."
        }
        // Fare queries
        else if (lower.includes("fare") || lower.includes("price") || lower.includes("cost")) {
          response = "Our fares vary by vehicle type:\n• Government Bus: ₹10-15/km\n• Private Bus: ₹15-20/km\n• Chartered Bus: ₹20+/km\n• E-Rickshaw: ₹8-12/km\n\nYou can get an exact estimate by using our Fare Calculator on the booking page!"
        }
        // Next bus queries
        else if (lower.includes("next bus") || lower.includes("schedule") || lower.includes("timing")) {
          response = "Buses run throughout the day starting from 6:00 AM to 10:00 PM. The next available bus depends on your route. You can check real-time availability on our Vehicles page or book your preferred time slot."
        }
        // Booking queries
        else if (lower.includes("book") || lower.includes("reservation")) {
          response = "Booking is easy! Just visit our Booking page, enter your pickup and drop-off locations, select your vehicle type, choose your seats, and confirm. You'll get instant confirmation with a booking code!"
        }
        // Driver queries
        else if (lower.includes("driver") || lower.includes("join") || lower.includes("become")) {
          response = "Want to join as a driver? Great! Visit our Driver Dashboard to apply. All drivers go through government verification and background checks. The process takes 24-48 hours. You'll need your license, vehicle documents, and contact information."
        }
        // Safety queries
        else if (lower.includes("safe") || lower.includes("verified") || lower.includes("trust")) {
          response = "Your safety is our priority! All our drivers are government-verified with valid licenses. Vehicles are regularly inspected and sanitized. We also provide real-time GPS tracking and 24/7 emergency support."
        }
        // Payment queries
        else if (lower.includes("payment") || lower.includes("pay") || lower.includes("wallet")) {
          response = "We accept multiple payment methods: UPI, Credit/Debit Cards, Net Banking, and Cash. You can also maintain a wallet for quick bookings. All transactions are secure and encrypted."
        }
        // Vehicle type queries
        else if (lower.includes("vehicle") || lower.includes("bus type") || lower.includes("rickshaw")) {
          response = "We offer 4 types of vehicles:\n• Government Buses - Most affordable\n• Private Buses - More comfort\n• Chartered Buses - For groups/events\n• E-Rickshaws - Eco-friendly short trips\n\nEach has different fares and amenities!"
        }
        // Greeting
        else if (lower.includes("hi") || lower.includes("hello") || lower.includes("hey")) {
          response = "Hello! 👋 Welcome to Bus Mate! I'm here to help you with:\n• Routes & Schedules\n• Fare Information\n• Booking Assistance\n• Driver Registration\n• Safety Information\n\nWhat would you like to know?"
        }
        // Thanks
        else if (lower.includes("thank") || lower.includes("thanks")) {
          response = "You're welcome! Happy to help. Have a safe journey with Bus Mate! 🚌"
        }
        // Default
        else {
          response = "I can help you with routes, fares, bookings, driver registration, and more! Try asking:\n• 'What are your fares?'\n• 'How do I book a ride?'\n• 'When is the next bus?'\n• 'How can I become a driver?'\n\nWhat would you like to know?"
        }

        // Stream the response word by word for a more natural feel
        const words = response.split(" ")
        for (let i = 0; i < words.length; i++) {
          const word = words[i] + (i < words.length - 1 ? " " : "")
          controller.enqueue(encoder.encode(word))
          // Add slight delay between words
          await new Promise((resolve) => setTimeout(resolve, 30))
        }

        controller.close()
      },
    })

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    })
  } catch (error) {
    console.error("Chat error:", error)
    return new Response(
      JSON.stringify({ error: "Failed to process message" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    )
  }
}
