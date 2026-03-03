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

  const handleSend = async () => {
  if (!input.trim() || isLoading) return

  const userMessage = {
    id: crypto.randomUUID(),
    text: input,
    sender: "user",
    timestamp: new Date(),
  }

  setMessages((prev) => [...prev, userMessage])
  setInput("")
  setIsLoading(true)

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userMessage.text }),
    })

    if (!response.ok) throw new Error("Request failed")

    const reader = response.body?.getReader()
    if (!reader) throw new Error("No stream")

    const decoder = new TextDecoder()
    let botText = ""

    const botId = crypto.randomUUID()

    setMessages((prev) => [
      ...prev,
      { id: botId, text: "", sender: "bot", timestamp: new Date() },
    ])

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      botText += decoder.decode(value)

      setMessages((prev) =>
        prev.map((m) =>
          m.id === botId ? { ...m, text: botText } : m
        )
      )
    }
  } catch (err) {
    console.error(err)

    setMessages((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        text: "Sorry, something went wrong.",
        sender: "bot",
        timestamp: new Date(),
      },
    ])
  } finally {
    setIsLoading(false)
  }
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