"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Loader2, CheckCircle, X, CreditCard, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import Script from "next/script"

interface RazorpayCheckoutDialogProps {
  open: boolean
  setOpen: (open: boolean) => void
  productId: string
  productName: string
  amount: number
  description: string
  features: string[]
  onSuccess?: () => void
}

// Declare Razorpay type
declare global {
  interface Window {
    Razorpay: any
  }
}

export default function RazorpayCheckoutDialog({
  open,
  setOpen,
  productId,
  productName,
  amount,
  description,
  features,
  onSuccess,
}: RazorpayCheckoutDialogProps) {
  const [loading, setLoading] = useState(false)
  const [razorpayLoaded, setRazorpayLoaded] = useState(false)

  const handlePayment = async () => {
    if (!razorpayLoaded) {
      toast.error("Payment gateway is loading. Please try again.")
      return
    }

    setLoading(true)

    try {
      const token = localStorage.getItem("bearer_token")

      // Create Razorpay order
      const orderResponse = await fetch("/api/razorpay/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          amount: amount,
          receiptId: `plan_${productId}_${Date.now()}`,
          notes: {
            productId: productId,
            productName: productName,
            planType: "subscription",
          },
        }),
      })

      const orderData = await orderResponse.json()

      if (!orderData.success) {
        toast.error(orderData.error || "Failed to create payment order")
        setLoading(false)
        return
      }

      // Get user info from session
      const userInfo = {
        name: "",
        email: "",
      }

      // Try to get from localStorage or session
      try {
        const sessionResponse = await fetch("/api/auth/session", {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        })
        if (sessionResponse.ok) {
          const sessionData = await sessionResponse.json()
          userInfo.name = sessionData?.user?.name || ""
          userInfo.email = sessionData?.user?.email || ""
        }
      } catch (e) {
        console.error("Failed to fetch user info:", e)
      }

      // Razorpay checkout options
      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Bus Mate",
        description: `${productName} Plan - ${description}`,
        order_id: orderData.orderId,
        handler: async function (response: any) {
          // Verify payment
          const verifyResponse = await fetch("/api/razorpay/verify", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          })

          const verifyData = await verifyResponse.json()

          if (verifyData.success) {
            // Payment verified, confirm subscription
            await confirmSubscription(
              response.razorpay_payment_id,
              response.razorpay_order_id
            )
          } else {
            toast.error("Payment verification failed")
            setLoading(false)
          }
        },
        prefill: {
          name: userInfo.name,
          email: userInfo.email,
        },
        theme: {
          color: "#4ade80",
        },
        modal: {
          ondismiss: function () {
            setLoading(false)
            toast.error("Payment cancelled")
            setOpen(false)
          },
        },
      }

      const razorpay = new window.Razorpay(options)
      razorpay.open()
    } catch (error) {
      console.error("Payment error:", error)
      toast.error("Failed to process payment")
      setLoading(false)
    }
  }

  const confirmSubscription = async (paymentId: string, orderId: string) => {
    try {
      const token = localStorage.getItem("bearer_token")

      const response = await fetch("/api/razorpay/subscriptions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          productId,
          productName,
          amount,
          paymentId,
          orderId,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success(`Successfully subscribed to ${productName} plan!`)
        setOpen(false)
        onSuccess?.()
        
        // Reload page to update subscription status
        setTimeout(() => {
          window.location.reload()
        }, 1500)
      } else {
        toast.error(data.error || "Subscription failed. Please contact support.")
      }
    } catch (error) {
      toast.error("Subscription confirmation failed. Please contact support.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        onLoad={() => setRazorpayLoaded(true)}
        onError={() => toast.error("Failed to load payment gateway")}
      />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              Confirm Subscription
            </DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Plan Summary */}
            <div className="rounded-lg border border-border/50 bg-muted/50 p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-lg">{productName} Plan</h3>
                  <p className="text-sm text-muted-foreground">Monthly Subscription</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">₹{amount}</p>
                  <p className="text-xs text-muted-foreground">/month</p>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-2 mt-4 pt-4 border-t border-border/50">
                {features.slice(0, 4).map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-2"
                  >
                    <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </motion.div>
                ))}
                {features.length > 4 && (
                  <p className="text-xs text-muted-foreground pl-6">
                    + {features.length - 4} more features
                  </p>
                )}
              </div>
            </div>

            {/* Security Notice */}
            <div className="flex items-start gap-2 text-xs text-muted-foreground bg-primary/5 p-3 rounded-lg">
              <Shield className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
              <p>
                Your payment is secured by Razorpay. Your card details are encrypted and never
                stored on our servers.
              </p>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handlePayment}
              disabled={loading || !razorpayLoaded}
              className="bg-primary hover:bg-primary/90"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Pay ₹{amount}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
