"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { Check, Zap, Shield, Clock, Star } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import RazorpayCheckoutDialog from "@/components/autumn/razorpay-checkout-dialog"
import { toast } from "sonner"

interface PricingPlan {
  id: string
  name: string
  price: number
  description: string
  features: string[]
  recommended?: boolean
}

export default function PricingPage() {
  const router = useRouter()
  const [activeSubscription, setActiveSubscription] = useState<string | null>(null)
  const [checkoutDialogOpen, setCheckoutDialogOpen] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null)
  const [loadingSubscription, setLoadingSubscription] = useState(false)

  const pricingPlans: PricingPlan[] = [
    {
      id: "free",
      name: "Free",
      price: 0,
      description: "Perfect for occasional travelers testing our platform",
      features: [
        "10 bookings per month",
        "Standard route search",
        "View schedules & fares",
        "Email support",
      ],
    },
    {
      id: "premium",
      name: "Premium",
      price: 1249,
      description: "Best for regular commuters who value convenience",
      features: [
        "25 bookings per month",
        "Seat choice available",
        "10% discount on every 3rd booking",
        "Ad-free experience",
        "Priority booking",
        "Real-time bus tracking",
        "Live chat support",
      ],
      recommended: true,
    },
    {
      id: "super_premium",
      name: "Super Premium",
      price: 2499,
      description: "For frequent travelers who demand the best experience",
      features: [
        "Unlimited bookings",
        "Multiple bookings at a time",
        "Express check-in & fast boarding",
        "Early access to new routes",
        "Concierge booking service",
        "Loyalty rewards & points",
        "Flexible cancellation",
        "Priority phone support",
        "Travel insurance included",
      ],
    },
  ]

  const handleSelectPlan = (plan: PricingPlan) => {
    // Free plan - no payment needed
    if (plan.id === "free") {
      toast.info("You're already on the Free plan!")
      return
    }

    // Already subscribed
    if (activeSubscription === plan.id) {
      toast.info(`You're already subscribed to the ${plan.name} plan`)
      return
    }

    // Open checkout dialog
    setSelectedPlan(plan)
    setCheckoutDialogOpen(true)
  }

  const handleManageBilling = async () => {
    toast.info("Manage your subscription from your profile page")
    router.push("/profile")
  }

  const features = [
    {
      icon: Zap,
      title: "Instant Booking",
      description: "Book your ride in seconds with our streamlined process",
    },
    {
      icon: Shield,
      title: "Secure Payments",
      description: "Your payment information is always safe and encrypted",
    },
    {
      icon: Clock,
      title: "24/7 Support",
      description: "Get help whenever you need it with our support team",
    },
    {
      icon: Star,
      title: "Quality Service",
      description: "Verified drivers and well-maintained vehicles",
    },
  ]

  return (
    <div className="min-h-screen bg-black">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32 bg-black">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-black to-black" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto"
          >
            <motion.h1
              className="text-4xl md:text-6xl font-bold mb-6 text-white"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Choose Your <span className="bg-gradient-to-r from-primary via-green-400 to-primary bg-clip-text text-transparent">Perfect Plan</span>
            </motion.h1>
            <motion.p
              className="text-lg md:text-xl text-gray-300 mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Flexible pricing for every traveler. Start free, upgrade anytime.
            </motion.p>

            {!loadingSubscription && activeSubscription && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 border border-primary/30"
              >
                <Zap className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-white">
                  Current Plan: <span className="text-primary">{pricingPlans.find(p => p.id === activeSubscription)?.name || "Free"}</span>
                </span>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Pricing Cards Section */}
      <section className="py-12 bg-black">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`relative ${plan.recommended ? 'lg:-translate-y-6' : ''}`}
              >
                {plan.recommended && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                    <div className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </div>
                  </div>
                )}
                <Card className={`h-full bg-zinc-900/80 backdrop-blur-sm border-zinc-800 hover:border-primary/50 transition-all duration-300 ${plan.recommended ? 'border-primary/50 shadow-lg shadow-primary/10' : ''}`}>
                  <CardContent className="p-6 flex flex-col h-full">
                    <div className="mb-4">
                      <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                      <p className="text-sm text-gray-400 mb-4">{plan.description}</p>
                      <div className="flex items-baseline gap-1 mb-4">
                        <span className="text-4xl font-bold text-primary">₹{plan.price}</span>
                        {plan.price > 0 && <span className="text-gray-400">/month</span>}
                      </div>
                    </div>

                    <div className="flex-grow mb-6">
                      <ul className="space-y-3">
                        {plan.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-gray-300">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Button
                      onClick={() => 
                        activeSubscription === plan.id 
                          ? handleManageBilling() 
                          : handleSelectPlan(plan)
                      }
                      variant={plan.recommended ? "default" : "outline"}
                      disabled={loadingSubscription}
                      className={`w-full ${plan.recommended ? 'bg-primary hover:bg-primary/90' : 'border-zinc-700 hover:border-primary/50 hover:bg-primary/10'}`}
                    >
                      {activeSubscription === plan.id
                        ? "Manage Billing"
                        : plan.id === "free"
                        ? "Current Plan"
                        : `Get ${plan.name}`}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-zinc-950">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Why Choose Bus Mate?</h2>
            <p className="text-lg text-gray-300">
              More than just a booking platform
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <Card className="h-full bg-zinc-900/80 backdrop-blur-sm border-zinc-800 hover:border-primary/50 transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <motion.div
                      whileHover={{ scale: 1.2 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <feature.icon className="h-12 w-12 mx-auto mb-4 text-primary" />
                    </motion.div>
                    <h3 className="text-lg font-semibold mb-2 text-white">{feature.title}</h3>
                    <p className="text-sm text-gray-400">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-black">
        <div className="container mx-auto px-4 max-w-3xl">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Frequently Asked Questions</h2>
          </motion.div>

          <div className="space-y-6">
            <Card className="bg-zinc-900/80 backdrop-blur-sm border-zinc-800">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-2 text-white">Can I change my plan anytime?</h3>
                <p className="text-gray-400">
                  Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-zinc-900/80 backdrop-blur-sm border-zinc-800">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-2 text-white">What payment methods do you accept?</h3>
                <p className="text-gray-400">
                  We accept all major credit cards, debit cards, UPI, and digital wallets through Razorpay.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-zinc-900/80 backdrop-blur-sm border-zinc-800">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-2 text-white">Is there a long-term commitment?</h3>
                <p className="text-gray-400">
                  No! All plans are month-to-month with no long-term commitment. Cancel anytime.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-zinc-900/80 backdrop-blur-sm border-zinc-800">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-2 text-white">What happens when I reach my booking limit?</h3>
                <p className="text-gray-400">
                  Free plan users have 10 bookings per month, Premium users get 25. Super Premium users enjoy unlimited bookings. You'll be prompted to upgrade if you reach your limit.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />

      {/* Razorpay Checkout Dialog */}
      {selectedPlan && (
        <RazorpayCheckoutDialog
          open={checkoutDialogOpen}
          setOpen={setCheckoutDialogOpen}
          productId={selectedPlan.id}
          productName={selectedPlan.name}
          amount={selectedPlan.price}
          description={selectedPlan.description}
          features={selectedPlan.features}
          onSuccess={() => {
            setActiveSubscription(selectedPlan.id)
          }}
        />
      )}
    </div>
  )
}