"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { MapPin, Calendar, Bus, Users, DollarSign, CheckCircle, Zap, ArrowRight, Sparkles, Wallet, Armchair, Radio, User } from "lucide-react"
import { VscHome, VscCalendar } from "react-icons/vsc"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import Dock from "@/components/Dock"
import ClickSpark from "@/components/ClickSpark"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import Script from "next/script"

// Indian cities list
const INDIAN_CITIES = [
  "Agra", "Ahmedabad", "Ajmer", "Aligarh", "Allahabad", "Amritsar", "Aurangabad",
  "Bangalore", "Bareilly", "Bhopal", "Bhubaneswar", "Bikaner",
  "Chandigarh", "Chennai", "Coimbatore", "Cuttack",
  "Dehradun", "Delhi", "Dhanbad", "Durgapur",
  "Faridabad", "Firozabad",
  "Ghaziabad", "Gorakhpur", "Gulbarga", "Guntur", "Gurgaon", "Guwahati", "Gwalior",
  "Haridwar", "Howrah", "Hyderabad",
  "Indore",
  "Jabalpur", "Jaipur", "Jalandhar", "Jamshedpur", "Jhansi", "Jodhpur",
  "Kanpur", "Kochi", "Kolkata", "Kota",
  "Lucknow", "Ludhiana",
  "Madurai", "Meerut", "Moradabad", "Mumbai", "Mysore",
  "Nagpur", "Nashik", "Noida",
  "Patna", "Pune",
  "Raipur", "Rajkot", "Ranchi",
  "Surat",
  "Thiruvananthapuram", "Thrissur", "Tiruppur",
  "Udaipur",
  "Vadodara", "Varanasi", "Vijayawada", "Visakhapatnam",
].sort()

// Declare Razorpay type
declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function BookingPage() {
  const router = useRouter()
  
  // Dock items
  const dockItems = [
    { icon: <VscHome size={20} />, label: 'Home', onClick: () => router.push('/') },
    { icon: <Radio size={20} />, label: 'Live Tracking', onClick: () => router.push('/tracking') },
    { icon: <User size={20} />, label: 'My Profile', onClick: () => router.push('/driver-dashboard') },
  ]

  const [formData, setFormData] = useState({
    pickup: "",
    dropoff: "",
    vehicleType: "",
    date: "",
    passengers: "1",
  })
  const [estimatedFare, setEstimatedFare] = useState<number | null>(null)
  const [selectedSeats, setSelectedSeats] = useState<string[]>([])
  const [showSeatSelection, setShowSeatSelection] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [razorpayLoaded, setRazorpayLoaded] = useState(false)
  
  // Autocomplete states
  const [pickupSuggestions, setPickupSuggestions] = useState<string[]>([])
  const [dropoffSuggestions, setDropoffSuggestions] = useState<string[]>([])
  const [showPickupSuggestions, setShowPickupSuggestions] = useState(false)
  const [showDropoffSuggestions, setShowDropoffSuggestions] = useState(false)

  // Filter cities based on input
  const filterCities = (input: string) => {
    if (!input) return []
    const searchTerm = input.toLowerCase()
    return INDIAN_CITIES.filter(city => 
      city.toLowerCase().startsWith(searchTerm)
    ).slice(0, 8)
  }

  const handlePickupChange = (value: string) => {
    setFormData({ ...formData, pickup: value })
    const suggestions = filterCities(value)
    setPickupSuggestions(suggestions)
    setShowPickupSuggestions(suggestions.length > 0)
  }

  const handleDropoffChange = (value: string) => {
    setFormData({ ...formData, dropoff: value })
    const suggestions = filterCities(value)
    setDropoffSuggestions(suggestions)
    setShowDropoffSuggestions(suggestions.length > 0)
  }

  const selectPickupCity = (city: string) => {
    setFormData({ ...formData, pickup: city })
    setShowPickupSuggestions(false)
  }

  const selectDropoffCity = (city: string) => {
    setFormData({ ...formData, dropoff: city })
    setShowDropoffSuggestions(false)
  }

  const handleEstimateFare = async () => {
    if (!formData.pickup || !formData.dropoff || !formData.vehicleType) {
      toast.error("Please fill in all required fields")
      return
    }

    setIsLoading(true)
    try {
      const token = localStorage.getItem("bearer_token")
      const response = await fetch("/api/fare-estimate", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(formData),
      })
      const data = await response.json()
      setEstimatedFare(data.fare)
      toast.success(`Estimated fare: ₹${data.fare}`)
    } catch (error) {
      toast.error("Failed to estimate fare")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSeatSelection = async (seat: string) => {
    setSelectedSeats((prev) =>
      prev.includes(seat) ? prev.filter((s) => s !== seat) : [...prev, seat]
    )
  }

  const handlePayment = async () => {
    if (!estimatedFare || selectedSeats.length === 0) {
      toast.error("Please estimate fare and select seats")
      return
    }

    if (!razorpayLoaded) {
      toast.error("Payment gateway is loading. Please try again.")
      return
    }

    setIsLoading(true)

    try {
      // Create Razorpay order
      const orderResponse = await fetch("/api/razorpay/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: estimatedFare,
          receiptId: `booking_${Date.now()}`,
          notes: {
            pickup: formData.pickup,
            dropoff: formData.dropoff,
            vehicleType: formData.vehicleType,
            seats: selectedSeats.join(", "),
          },
        }),
      })

      const orderData = await orderResponse.json()

      if (!orderData.success) {
        toast.error(orderData.error || "Failed to create payment order")
        setIsLoading(false)
        return
      }

      // Razorpay checkout options
      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Bus Mate",
        description: `Booking from ${formData.pickup} to ${formData.dropoff}`,
        order_id: orderData.orderId,
        handler: async function (response: any) {
          // Verify payment
          const verifyResponse = await fetch("/api/razorpay/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          })

          const verifyData = await verifyResponse.json()

          if (verifyData.success) {
            // Payment verified, now confirm booking
            await confirmBooking(
              response.razorpay_payment_id,
              response.razorpay_order_id
            )
          } else {
            toast.error("Payment verification failed")
            setIsLoading(false)
          }
        },
        prefill: {
          name: "Guest User",
          email: "guest@example.com",
        },
        theme: {
          color: "#008870",
        },
        modal: {
          ondismiss: function () {
            setIsLoading(false)
            toast.error("Payment cancelled")
          },
        },
      }

      const razorpay = new window.Razorpay(options)
      razorpay.open()
    } catch (error) {
      console.error("Payment error:", error)
      toast.error("Failed to process payment")
      setIsLoading(false)
    }
  }

  const confirmBooking = async (paymentId: string, orderId: string) => {
    try {
      const token = localStorage.getItem("bearer_token")
      const datetime = `${formData.date}T09:00:00`
      
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          ...formData,
          datetime,
          seats: selectedSeats,
          fare: estimatedFare,
          paymentId,
          orderId,
        }),
      })
      
      const data = await response.json()
      
      if (response.ok) {
        toast.success("Booking confirmed! Payment successful.")
        
        // Reset form
        setFormData({
          pickup: "",
          dropoff: "",
          vehicleType: "",
          date: "",
          passengers: "1",
        })
        setSelectedSeats([])
        setEstimatedFare(null)
        setShowSeatSelection(false)
        
        // Redirect to profile to view booking
        setTimeout(() => {
          router.push("/profile")
        }, 2000)
      } else {
        toast.error(data.error || "Booking failed after payment. Please contact support.")
      }
    } catch (error) {
      toast.error("Booking confirmation failed. Please contact support.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    handlePayment()
  }

  // Generate bus seat layout (40 seats in 4 columns with aisle)
  const generateBusSeats = () => {
    const seats = []
    const rows = 10
    const seatsPerRow = 4
    
    for (let row = 1; row <= rows; row++) {
      const rowSeats = []
      for (let col = 0; col < seatsPerRow; col++) {
        const seatNumber = `${row}${String.fromCharCode(65 + col)}`
        rowSeats.push(seatNumber)
      }
      seats.push(rowSeats)
    }
    
    return seats
  }

  const busSeats = generateBusSeats()

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  }

  const seatVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: (custom: number) => ({
      scale: 1,
      opacity: 1,
      transition: {
        delay: custom * 0.02,
        type: "spring",
        stiffness: 200,
        damping: 15
      }
    }),
    hover: {
      scale: 1.1,
      transition: { type: "spring", stiffness: 400 }
    },
    tap: {
      scale: 0.95
    }
  }

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        onLoad={() => setRazorpayLoaded(true)}
        onError={() => toast.error("Failed to load payment gateway")}
      />
      <ClickSpark
        sparkColor="#4ade80"
        sparkSize={12}
        sparkRadius={25}
        sparkCount={12}
        duration={600}
      >
        <div className="min-h-screen bg-background">
          <Header />

          {/* Animated Background Gradient */}
          <div className="fixed inset-0 -z-10 overflow-hidden">
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary/10"
              animate={{
                backgroundPosition: ["0% 0%", "100% 100%"],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(0,136,112,0.1),transparent)]" />
          </div>

          <section className="py-20">
            <div className="container mx-auto px-4 max-w-4xl">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center mb-12"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4"
                >
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-primary">Smart Booking System</span>
                </motion.div>
                <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-green-300 to-primary bg-clip-text text-transparent">
                  Book Your Ride
                </h1>
                <p className="text-xl text-muted-foreground">
                  Choose your destination and let's get you moving
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, type: "spring" }}
              >
                <Card className="bg-card/50 backdrop-blur-xl border-border/50 overflow-hidden relative">
                  <motion.div
                    className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent"
                    animate={{
                      x: ["-100%", "100%"],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatType: "loop",
                      ease: "linear"
                    }}
                  />
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <motion.div
                        animate={{ 
                          x: [0, 5, 0],
                        }}
                        transition={{ 
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        <Bus className="h-6 w-6 text-primary" />
                      </motion.div>
                      Booking Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <motion.div 
                        className="grid md:grid-cols-2 gap-6"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                      >
                        <motion.div variants={itemVariants} className="relative">
                          <Label htmlFor="pickup" className="flex items-center gap-2 mb-2">
                            <MapPin className="h-4 w-4 text-primary" />
                            Pickup Location
                          </Label>
                          <Input
                            id="pickup"
                            placeholder="Search city (e.g., A for Agra)"
                            value={formData.pickup}
                            onChange={(e) => handlePickupChange(e.target.value)}
                            onFocus={() => formData.pickup && setShowPickupSuggestions(true)}
                            onBlur={() => setTimeout(() => setShowPickupSuggestions(false), 200)}
                            required
                            className="transition-all focus:scale-[1.02]"
                            autoComplete="off"
                          />
                          <AnimatePresence>
                            {showPickupSuggestions && pickupSuggestions.length > 0 && (
                              <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="absolute z-50 w-full mt-1 bg-card border border-border rounded-lg shadow-lg overflow-hidden"
                              >
                                {pickupSuggestions.map((city) => (
                                  <button
                                    key={city}
                                    type="button"
                                    onClick={() => selectPickupCity(city)}
                                    className="w-full px-4 py-2 text-left hover:bg-primary/10 transition-colors text-sm"
                                  >
                                    {city}
                                  </button>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>

                        <motion.div variants={itemVariants} className="relative">
                          <Label htmlFor="dropoff" className="flex items-center gap-2 mb-2">
                            <MapPin className="h-4 w-4 text-primary" />
                            Drop-off Location
                          </Label>
                          <Input
                            id="dropoff"
                            placeholder="Search city (e.g., A for Agra)"
                            value={formData.dropoff}
                            onChange={(e) => handleDropoffChange(e.target.value)}
                            onFocus={() => formData.dropoff && setShowDropoffSuggestions(true)}
                            onBlur={() => setTimeout(() => setShowDropoffSuggestions(false), 200)}
                            required
                            className="transition-all focus:scale-[1.02]"
                            autoComplete="off"
                          />
                          <AnimatePresence>
                            {showDropoffSuggestions && dropoffSuggestions.length > 0 && (
                              <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="absolute z-50 w-full mt-1 bg-card border border-border rounded-lg shadow-lg overflow-hidden"
                              >
                                {dropoffSuggestions.map((city) => (
                                  <button
                                    key={city}
                                    type="button"
                                    onClick={() => selectDropoffCity(city)}
                                    className="w-full px-4 py-2 text-left hover:bg-primary/10 transition-colors text-sm"
                                  >
                                    {city}
                                  </button>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>

                        <motion.div variants={itemVariants}>
                          <Label htmlFor="vehicleType" className="flex items-center gap-2 mb-2">
                            <Bus className="h-4 w-4 text-primary" />
                            Vehicle Type
                          </Label>
                          <Select
                            value={formData.vehicleType}
                            onValueChange={(value) =>
                              setFormData({ ...formData, vehicleType: value })
                            }
                          >
                            <SelectTrigger className="transition-all focus:scale-[1.02]">
                              <SelectValue placeholder="Select vehicle type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="government-bus">Government Bus</SelectItem>
                              <SelectItem value="private-bus">Private Bus</SelectItem>
                              <SelectItem value="chartered-bus">Chartered Bus</SelectItem>
                            </SelectContent>
                          </Select>
                        </motion.div>

                        <motion.div variants={itemVariants}>
                          <Label htmlFor="date" className="flex items-center gap-2 mb-2">
                            <Calendar className="h-4 w-4 text-primary" />
                            Journey Date
                          </Label>
                          <Input
                            id="date"
                            type="date"
                            value={formData.date}
                            onChange={(e) =>
                              setFormData({ ...formData, date: e.target.value })
                            }
                            min={new Date().toISOString().split('T')[0]}
                            required
                            className="transition-all focus:scale-[1.02]"
                          />
                        </motion.div>
                      </motion.div>

                      <motion.div 
                        className="flex gap-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                      >
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleEstimateFare}
                          disabled={isLoading}
                          className="flex-1 group hover:bg-primary/10 hover:border-primary/50 transition-all"
                        >
                          {isLoading ? (
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              className="mr-2"
                            >
                              <Bus className="h-4 w-4" />
                            </motion.div>
                          ) : (
                            <DollarSign className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                          )}
                          Estimate Fare
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setShowSeatSelection(!showSeatSelection)}
                          className="flex-1 group hover:bg-primary/10 hover:border-primary/50 transition-all"
                        >
                          <Armchair className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                          Select Seats
                        </Button>
                      </motion.div>

                      <AnimatePresence>
                        {estimatedFare && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: -10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: -10 }}
                            className="p-6 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent rounded-lg text-center border border-primary/30 relative overflow-hidden"
                          >
                            <motion.div
                              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
                              animate={{
                                x: ["-100%", "100%"],
                              }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                                repeatType: "loop",
                                ease: "linear"
                              }}
                            />
                            <motion.p 
                              className="text-2xl font-bold text-primary relative z-10"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: "spring", stiffness: 200 }}
                            >
                              Estimated Fare: ₹{estimatedFare}
                            </motion.p>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <AnimatePresence>
                        {showSeatSelection && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ type: "spring", stiffness: 200 }}
                            className="space-y-4 overflow-hidden"
                          >
                            <motion.h3 
                              className="text-lg font-semibold flex items-center gap-2"
                              initial={{ x: -20 }}
                              animate={{ x: 0 }}
                            >
                              <Armchair className="h-5 w-5 text-primary" />
                              Select Your Seats
                            </motion.h3>

                            {/* Bus Layout */}
                            <div className="bg-gradient-to-b from-muted/50 to-transparent p-6 rounded-lg border border-border/50">
                              {/* Driver Section */}
                              <div className="flex items-center justify-between mb-6 pb-4 border-b border-border/50">
                                <div className="flex items-center gap-3">
                                  <div className="w-12 h-12 rounded-lg bg-primary/20 border-2 border-primary/50 flex items-center justify-center">
                                    <Bus className="h-6 w-6 text-primary" />
                                  </div>
                                  <span className="text-sm text-muted-foreground">Driver</span>
                                </div>
                                <div className="text-right">
                                  <div className="text-xs text-muted-foreground mb-1">Legend</div>
                                  <div className="flex gap-3 text-xs">
                                    <span className="flex items-center gap-1">
                                      <div className="w-3 h-3 rounded bg-primary"></div>
                                      Selected
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <div className="w-3 h-3 rounded border-2 border-border"></div>
                                      Available
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Seats Layout */}
                              <motion.div 
                                className="space-y-3"
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                              >
                                {busSeats.map((row, rowIndex) => (
                                  <div key={rowIndex} className="flex items-center gap-2">
                                    {/* Left side - 2 seats */}
                                    <div className="flex gap-2 flex-1 justify-end">
                                      {row.slice(0, 2).map((seat, seatIndex) => (
                                        <motion.div
                                          key={seat}
                                          custom={rowIndex * 4 + seatIndex}
                                          variants={seatVariants}
                                          whileHover="hover"
                                          whileTap="tap"
                                          className="flex-1"
                                        >
                                          <Button
                                            type="button"
                                            variant={selectedSeats.includes(seat) ? "default" : "outline"}
                                            onClick={() => handleSeatSelection(seat)}
                                            className={`h-14 w-full transition-all relative ${
                                              selectedSeats.includes(seat)
                                                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/50 border-primary"
                                                : "hover:border-primary/50 hover:bg-primary/10 border-2"
                                            }`}
                                          >
                                            <Armchair className={`h-4 w-4 mb-1 ${selectedSeats.includes(seat) ? 'opacity-100' : 'opacity-50'}`} />
                                            <span className="text-xs font-medium">{seat}</span>
                                          </Button>
                                        </motion.div>
                                      ))}
                                    </div>

                                    {/* Aisle */}
                                    <div className="w-8 flex items-center justify-center">
                                      <div className="h-px w-full bg-border/30"></div>
                                    </div>

                                    {/* Right side - 2 seats */}
                                    <div className="flex gap-2 flex-1">
                                      {row.slice(2, 4).map((seat, seatIndex) => (
                                        <motion.div
                                          key={seat}
                                          custom={rowIndex * 4 + seatIndex + 2}
                                          variants={seatVariants}
                                          whileHover="hover"
                                          whileTap="tap"
                                          className="flex-1"
                                        >
                                          <Button
                                            type="button"
                                            variant={selectedSeats.includes(seat) ? "default" : "outline"}
                                            onClick={() => handleSeatSelection(seat)}
                                            className={`h-14 w-full transition-all relative ${
                                              selectedSeats.includes(seat)
                                                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/50 border-primary"
                                                : "hover:border-primary/50 hover:bg-primary/10 border-2"
                                            }`}
                                          >
                                            <Armchair className={`h-4 w-4 mb-1 ${selectedSeats.includes(seat) ? 'opacity-100' : 'opacity-50'}`} />
                                            <span className="text-xs font-medium">{seat}</span>
                                          </Button>
                                        </motion.div>
                                      ))}
                                    </div>
                                  </div>
                                ))}
                              </motion.div>
                            </div>

                            {selectedSeats.length > 0 && (
                              <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="p-4 bg-primary/10 rounded-lg border border-primary/20"
                              >
                                <p className="text-sm font-medium mb-2">Selected Seats ({selectedSeats.length})</p>
                                <p className="text-sm text-muted-foreground">
                                  <span className="text-primary font-medium">{selectedSeats.join(", ")}</span>
                                </p>
                              </motion.div>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                      >
                        <Button
                          type="submit"
                          className="w-full bg-primary hover:bg-primary/90 group relative overflow-hidden"
                          disabled={isLoading || !estimatedFare || selectedSeats.length === 0}
                        >
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                            animate={{
                              x: ["-100%", "100%"],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              repeatType: "loop",
                              ease: "linear"
                            }}
                          />
                          {isLoading ? (
                            <>
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                className="mr-2"
                              >
                                <Bus className="h-4 w-4" />
                              </motion.div>
                              Processing Payment...
                            </>
                          ) : (
                            <>
                              <Wallet className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                              Pay ₹{estimatedFare} & Confirm Booking
                            </>
                          )}
                        </Button>
                      </motion.div>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </section>

          <Footer />

          <Dock 
            items={dockItems}
            panelHeight={68}
            baseItemSize={50}
            magnification={70}
          />
        </div>
      </ClickSpark>
    </>
  )
}