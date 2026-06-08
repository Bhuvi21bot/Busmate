"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageCircle, X, Send, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Message {
  id: string
  text: string
  sender: "user" | "bot"
  timestamp: number
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: crypto.randomUUID(),
      text: "Hi 👋 I'm Bus Mate AI! Ask me about routes, fares, booking, or driver registration.",
      sender: "bot",
      timestamp: Date.now(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const getStaticResponse = (query: string): string => {
    const q = query.toLowerCase().trim()
    if (q.includes("booking") || q.includes("ticket") || q.includes("book")) {
      return "To book a ticket, please select your route on the home page, select an available bus, choose your seat, and proceed to checkout using Razorpay or Stripe!"
    }
    if (q.includes("route") || q.includes("destination") || q.includes("map")) {
      return "Bus Mate supports inter-city and intra-city routes. You can search for specific source and destination cities on our home search bar."
    }
    if (q.includes("fare") || q.includes("price") || q.includes("cost") || q.includes("pricing")) {
      return "Fares vary depending on the distance, type of bus (AC/Non-AC, Sleeper/Seater), and any active coupons. Check our 'Pricing' tab or input your details to view current prices."
    }
    if (q.includes("driver") || q.includes("register") || q.includes("join")) {
      return "Drivers can register via our portal or contact onboarding support. You will need a valid commercial driver's license (CDL) and vehicle fitness records."
    }
    if (q.includes("hello") || q.includes("hi") || q.includes("hey")) {
      return "Hello! How can I assist you with your journey today?"
    }
    if (q.includes("cancel") || q.includes("refund")) {
      return "Cancellations are allowed up to 4 hours before the departure time. Refunds are processed back to your original payment method within 5-7 business days."
    }
    if (q.includes("contact") || q.includes("support") || q.includes("help") || q.includes("phone")) {
      return "You can reach our customer service department at support@busmate.com or call our toll-free line at 1-800-555-MATE."
    }
    return "Thank you for reaching out! I'm a pre-programmed assistant. For more detailed support, please reach out to support@busmate.com."
  }

  const handleSend = () => {
    if (!input.trim() || isLoading) return

    const userMsgText = input
    const userMessage = {
      id: crypto.randomUUID(),
      text: userMsgText,
      sender: "user" as const,
      timestamp: Date.now(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // Simulate small delay for static responses to feel more natural
    setTimeout(() => {
      const responseText = getStaticResponse(userMsgText)
      const botMessage = {
        id: crypto.randomUUID(),
        text: responseText,
        sender: "bot" as const,
        timestamp: Date.now(),
      }
      setMessages((prev) => [...prev, botMessage])
      setIsLoading(false)
    }, 600)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <>
      {/* Toggle Button */}
      <motion.div
        className="fixed bottom-6 left-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
      >
        <Button
          onClick={() => setIsOpen(!isOpen)}
          size="lg"
          className="h-14 w-14 rounded-full"
        >
          {isOpen ? <X /> : <MessageCircle />}
        </Button>
      </motion.div>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-24 left-6 z-50 w-96 max-w-[90vw]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <Card className="overflow-hidden shadow-2xl">
              {/* Header */}
              <div className="p-4 bg-primary text-white font-bold">
                Bus Mate AI
              </div>

              {/* Messages */}
              <ScrollArea className="h-96 p-4">
                <div className="space-y-4">
                  {messages.map((m) => (
                    <div
                      key={m.id}
                      className={`flex ${
                        m.sender === "user"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div className="bg-muted rounded-2xl px-4 py-2 max-w-[80%]">
                        <p className="text-sm">{m.text}</p>
                        <p className="text-xs opacity-60">
                          {new Date(m.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  ))}

                  {isLoading && (
                    <Loader2 className="animate-spin" />
                  )}

                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* Input */}
              <div className="p-4 border-t flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={isLoading}
                  placeholder="Ask anything..."
                />
                <Button onClick={handleSend} disabled={isLoading}>
                  <Send size={18} />
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}