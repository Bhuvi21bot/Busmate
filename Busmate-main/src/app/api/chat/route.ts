import OpenAI from "openai"

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
})

export async function POST(req: Request) {
  try {
    const { message } = await req.json()

    const completion = await client.chat.completions.create({
      model: "llama3-8b-8192",
      messages: [{ role: "user", content: message }],
    })

    const text = completion.choices[0].message.content

    return new Response(text)
  } catch (err) {
    console.error("CHAT ERROR:", err)
    return new Response("Error", { status: 500 })
  }
}