export async function POST(req: Request) {
  try {
    const { message } = await req.json()
    const q = (message || "").toLowerCase().trim()

    let responseText = "Thank you for reaching out! I'm a pre-programmed assistant. For more detailed support, please reach out to support@busmate.com."

    if (q.includes("booking") || q.includes("ticket") || q.includes("book")) {
      responseText = "To book a ticket, please select your route on the home page, select an available bus, choose your seat, and proceed to checkout using Razorpay or Stripe!"
    } else if (q.includes("route") || q.includes("destination") || q.includes("map")) {
      responseText = "Bus Mate supports inter-city and intra-city routes. You can search for specific source and destination cities on our home search bar."
    } else if (q.includes("fare") || q.includes("price") || q.includes("cost") || q.includes("pricing")) {
      responseText = "Fares vary depending on the distance, type of bus (AC/Non-AC, Sleeper/Seater), and any active coupons. Check our 'Pricing' tab or input your details to view current prices."
    } else if (q.includes("driver") || q.includes("register") || q.includes("join")) {
      responseText = "Drivers can register via our portal or contact onboarding support. You will need a valid commercial driver's license (CDL) and vehicle fitness records."
    } else if (q.includes("hello") || q.includes("hi") || q.includes("hey")) {
      responseText = "Hello! How can I assist you with your journey today?"
    } else if (q.includes("cancel") || q.includes("refund")) {
      responseText = "Cancellations are allowed up to 4 hours before the departure time. Refunds are processed back to your original payment method within 5-7 business days."
    } else if (q.includes("contact") || q.includes("support") || q.includes("help") || q.includes("phone")) {
      responseText = "You can reach our customer service department at support@busmate.com or call our toll-free line at 1-800-555-MATE."
    }

    return new Response(responseText)
  } catch (err) {
    console.error("CHAT ERROR:", err)
    return new Response("Error", { status: 500 })
  }
}