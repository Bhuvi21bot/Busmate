"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Mail, ArrowRight, RefreshCw, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"

interface OTPVerificationProps {
  email: string
  type?: "register" | "login"
  onSuccess: () => void
  onBack?: () => void
}

export function OTPVerification({ email, type = "register", onSuccess, onBack }: OTPVerificationProps) {
  const [otp, setOtp] = useState("")
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const [countdown, setCountdown] = useState(60)
  const [canResend, setCanResend] = useState(false)

  // Countdown timer for resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      setCanResend(true)
    }
  }, [countdown])

  // Handle numeric input only
  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6)
    setOtp(value)
  }

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP")
      return
    }

    setLoading(true)

    try {
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp_code: otp }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Invalid or expired OTP code")
      }

      toast.success("Email verified successfully!")
      onSuccess()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Verification failed")
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    setResending(true)
    try {
      const response = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, type }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to resend OTP")
      }

      toast.success("New code sent to your email!")
      
      // Show dev OTP in development
      if (data.devOtp && process.env.NODE_ENV === 'development') {
        toast.info(`Dev OTP: ${data.devOtp}`, { duration: 10000 })
      }
      
      setCountdown(60)
      setCanResend(false)
      setOtp("")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to resend code")
    } finally {
      setResending(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-full"
    >
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center"
            >
              <Mail className="h-8 w-8 text-primary" />
            </motion.div>
          </div>
          <CardTitle className="text-2xl text-center">Verify Your Email</CardTitle>
          <CardDescription className="text-center">
            We've sent a 6-digit verification code to
            <br />
            <span className="font-medium text-foreground">{email}</span>
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleVerify}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="otp" className="text-center block">
                Enter 6-digit code
              </Label>
              <Input
                id="otp"
                type="text"
                value={otp}
                onChange={handleOtpChange}
                placeholder="000000"
                maxLength={6}
                className="text-center text-3xl font-mono tracking-widest font-bold"
                disabled={loading}
                autoFocus
              />
              <p className="text-xs text-muted-foreground text-center">
                Code expires in 10 minutes
              </p>
            </div>

            <div className="bg-muted/50 border border-border/50 rounded-lg p-3 flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
              <div className="text-xs text-muted-foreground space-y-1">
                <p>Check your email inbox (and spam folder) for the verification code.</p>
                {process.env.NODE_ENV === 'development' && (
                  <p className="text-primary font-medium">Development mode: Check toast notification for OTP</p>
                )}
              </div>
            </div>

            <div className="bg-muted/50 border border-border/50 rounded-lg p-3">
              <p className="text-xs text-muted-foreground text-center">
                Didn't receive the code?{" "}
                {canResend ? (
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={resending}
                    className="text-primary hover:underline font-medium disabled:opacity-50"
                  >
                    {resending ? "Sending..." : "Resend code"}
                  </button>
                ) : (
                  <span className="text-muted-foreground">
                    Resend in {countdown}s
                  </span>
                )}
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-3">
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90"
              disabled={loading || otp.length !== 6}
            >
              {loading ? (
                "Verifying..."
              ) : (
                <>
                  Verify Email
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
            {onBack && (
              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={onBack}
                disabled={loading}
              >
                Back to Sign Up
              </Button>
            )}
          </CardFooter>
        </form>
      </Card>
    </motion.div>
  )
}