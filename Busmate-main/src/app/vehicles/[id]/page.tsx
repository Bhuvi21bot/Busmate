"use client"

import { motion } from "framer-motion"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { MapPin, Clock, Users, Shield, Star, ArrowLeft, Check, Wallet } from "lucide-react"
import { VscHome, VscCalendar } from "react-icons/vsc"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import ClickSpark from "@/components/ClickSpark"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Dock from "@/components/Dock"

export default function VehicleDetailPage() {
  const params = useParams()
  const id = params.id as string
  const router = useRouter()

  const dockItems = [
    { icon: <VscHome size={20} />, label: 'Home', onClick: () => router.push('/') },
    { icon: <VscCalendar size={20} />, label: 'Booking', onClick: () => router.push('/booking') },
    { icon: <Wallet size={20} />, label: 'My Wallet', onClick: () => router.push('/driver-dashboard?tab=wallet') },
  ]

  // Vehicle data based on ID from vehicles page
  const vehicleData: Record<string, any> = {
    "1": {
      id: "1",
      name: "UPSRTC Bus",
      category: "Government Bus",
      description: "Serving only the UP region and its neighboring borders with reliable government-backed service.",
      image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1200",
      route: "City Center - Airport",
      fare: "₹50-80",
      rating: 4.5,
      reviews: 234,
      seats: 40,
      features: [
        "Real-time GPS tracking",
        "Verified government drivers",
        "Online booking",
        "AC facility",
        "Emergency support 24/7",
        "Clean and sanitized",
      ],
      schedule: [
        { time: "06:00 AM", route: "City Center → Airport", seats: 15 },
        { time: "08:30 AM", route: "Airport → City Center", seats: 8 },
        { time: "11:00 AM", route: "City Center → Airport", seats: 22 },
        { time: "02:00 PM", route: "Airport → City Center", seats: 18 },
        { time: "05:30 PM", route: "City Center → Airport", seats: 12 },
        { time: "08:00 PM", route: "Airport → City Center", seats: 25 },
      ],
    },
    "2": {
      id: "2",
      name: "MetroWay Bus",
      category: "Private Bus",
      description: "Connecting Metro cities with comfort and speed. Premium private bus service with modern amenities.",
      image: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=1200",
      route: "Downtown - Suburb",
      fare: "₹60-100",
      rating: 4.7,
      reviews: 189,
      seats: 35,
      features: [
        "Wi-Fi connectivity",
        "USB charging ports",
        "Reclining seats",
        "AC with climate control",
        "Professional drivers",
        "Onboard refreshments",
      ],
      schedule: [
        { time: "05:30 AM", route: "Downtown → Suburb", seats: 18 },
        { time: "07:45 AM", route: "Suburb → Downtown", seats: 12 },
        { time: "10:00 AM", route: "Downtown → Suburb", seats: 20 },
        { time: "01:00 PM", route: "Suburb → Downtown", seats: 15 },
        { time: "04:30 PM", route: "Downtown → Suburb", seats: 10 },
        { time: "07:30 PM", route: "Suburb → Downtown", seats: 22 },
      ],
    },
    "3": {
      id: "3",
      name: "Private Booking",
      category: "Chartered Bus",
      description: "Exclusive bus rentals for private events, corporate trips, weddings, and special occasions.",
      image: "https://images.unsplash.com/photo-1464219789935-c2d9d9aba644?w=1200",
      route: "Custom Routes",
      fare: "₹2000+",
      rating: 4.9,
      reviews: 156,
      seats: 45,
      features: [
        "Fully customizable routes",
        "Premium luxury seating",
        "Entertainment system",
        "Mini bar available",
        "Dedicated driver",
        "24/7 customer support",
      ],
      schedule: [
        { time: "Custom", route: "As per your requirement", seats: 45 },
        { time: "Flexible", route: "Book minimum 4 hours", seats: 45 },
        { time: "Available", route: "Advanced booking required", seats: 45 },
      ],
    },
    "4": {
      id: "4",
      name: "E-Rickshaw",
      category: "Eco-Friendly Transport",
      description: "Eco-friendly urban transport solution for short distances. Zero emission, affordable rides.",
      image: "https://images.unsplash.com/photo-1583486882634-82e9dece3ea0?w=1200",
      route: "Short Distance",
      fare: "₹20-50",
      rating: 4.3,
      reviews: 412,
      seats: 6,
      features: [
        "Zero emission vehicle",
        "Affordable pricing",
        "Quick urban travel",
        "Battery powered",
        "Covered seating",
        "Door-to-door service",
      ],
      schedule: [
        { time: "24/7", route: "Local Area Routes", seats: 6 },
        { time: "Available", route: "On-demand service", seats: 6 },
        { time: "Instant", route: "Book anytime", seats: 6 },
      ],
    },
    "5": {
      id: "5",
      name: "Haryana Roadways",
      category: "Government Bus",
      description: "State-owned bus service in Haryana connecting major cities and towns with reliable service.",
      image: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=1200",
      route: "Haryana Region",
      fare: "₹40-70",
      rating: 4.4,
      reviews: 298,
      seats: 42,
      features: [
        "Government verified",
        "Regular schedules",
        "AC and Non-AC options",
        "Online booking",
        "Safe and secure",
        "Budget friendly",
      ],
      schedule: [
        { time: "05:00 AM", route: "Gurugram → Chandigarh", seats: 20 },
        { time: "07:30 AM", route: "Faridabad → Panipat", seats: 16 },
        { time: "09:45 AM", route: "Hisar → Rohtak", seats: 25 },
        { time: "12:30 PM", route: "Karnal → Ambala", seats: 18 },
        { time: "03:00 PM", route: "Sonipat → Gurugram", seats: 14 },
        { time: "06:30 PM", route: "Panipat → Faridabad", seats: 22 },
      ],
    },
    "6": {
      id: "6",
      name: "CityLink Travels",
      category: "Private Bus",
      description: "Connecting urban centers with daily services. Modern fleet with punctual schedules and comfort.",
      image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1200",
      route: "Multiple Routes",
      fare: "₹55-90",
      rating: 4.6,
      reviews: 267,
      seats: 38,
      features: [
        "Modern fleet",
        "Punctual service",
        "Comfortable seating",
        "AC buses",
        "Mobile app tracking",
        "Customer support",
      ],
      schedule: [
        { time: "06:15 AM", route: "Central Station → Tech Park", seats: 19 },
        { time: "08:00 AM", route: "Tech Park → Business District", seats: 14 },
        { time: "10:30 AM", route: "Business District → Mall Area", seats: 23 },
        { time: "01:15 PM", route: "Mall Area → Central Station", seats: 17 },
        { time: "04:00 PM", route: "Central Station → Residential", seats: 11 },
        { time: "07:00 PM", route: "Residential → Central Station", seats: 20 },
      ],
    },
  }

  const vehicle = vehicleData[id] || vehicleData["1"]

  return (
    <ClickSpark
      sparkColor="#4ade80"
      sparkSize={12}
      sparkRadius={25}
      sparkCount={12}
      duration={600}
    >
      <div className="min-h-screen bg-background">
        <Header />

        <section className="relative py-20 overflow-hidden">
          {/* Animated Background */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background"
            animate={{
              backgroundPosition: ["0% 0%", "100% 100%"],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />

          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <Link href="/vehicles">
                <Button 
                  variant="ghost" 
                  className="mb-4 hover:scale-105 transition-transform"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Vehicles
                </Button>
              </Link>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-12">
              {/* Left Column - Image and Info */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
              >
                <motion.div 
                  className="relative h-96 rounded-2xl overflow-hidden mb-6 group"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.4 }}
                    className="w-full h-full"
                  >
                    <Image
                      src={vehicle.image}
                      alt={vehicle.name}
                      fill
                      className="object-cover"
                    />
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Badge className="absolute top-4 right-4 bg-primary text-primary-foreground">
                      {vehicle.category}
                    </Badge>
                  </motion.div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Card className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-300">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between flex-wrap gap-4">
                        <span className="text-xl">{vehicle.name}</span>
                        <motion.div 
                          className="flex items-center gap-2"
                          whileHover={{ scale: 1.05 }}
                        >
                          <Star className="h-5 w-5 fill-yellow-500 text-yellow-500" />
                          <span className="font-normal text-lg">
                            {vehicle.rating} ({vehicle.reviews} reviews)
                          </span>
                        </motion.div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-muted-foreground">{vehicle.description}</p>

                      <div className="grid grid-cols-2 gap-4 pt-4">
                        <motion.div 
                          className="flex items-center gap-2"
                          whileHover={{ x: 5 }}
                        >
                          <MapPin className="h-5 w-5 text-primary flex-shrink-0" />
                          <div>
                            <p className="text-sm font-semibold">Route</p>
                            <p className="text-sm text-muted-foreground">{vehicle.route}</p>
                          </div>
                        </motion.div>
                        <motion.div 
                          className="flex items-center gap-2"
                          whileHover={{ x: 5 }}
                        >
                          <Users className="h-5 w-5 text-primary flex-shrink-0" />
                          <div>
                            <p className="text-sm font-semibold">Capacity</p>
                            <p className="text-sm text-muted-foreground">{vehicle.seats} seats</p>
                          </div>
                        </motion.div>
                      </div>

                      <div className="pt-4 border-t border-border">
                        <motion.p 
                          className="text-2xl font-bold text-primary mb-4"
                          animate={{ 
                            scale: [1, 1.05, 1],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        >
                          {vehicle.fare}
                        </motion.p>
                        <Link href="/booking">
                          <Button 
                            className="w-full bg-primary hover:bg-primary/90 hover:scale-[1.02] transition-all duration-300 hover:shadow-lg hover:shadow-primary/50" 
                            size="lg"
                          >
                            <ArrowLeft className="h-4 w-4 mr-2 rotate-180" />
                            Book This Vehicle
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>

              {/* Right Column - Details */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="space-y-6"
              >
                {/* Features */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Card className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-300">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <motion.div
                          whileHover={{ scale: 1.2 }}
                          transition={{ type: "spring", stiffness: 400 }}
                        >
                          <Shield className="h-5 w-5 text-primary" />
                        </motion.div>
                        Features & Amenities
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-3">
                        {vehicle.features.map((feature: string, index: number) => (
                          <motion.div
                            key={feature}
                            className="flex items-center gap-2 text-sm"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.6 + index * 0.1 }}
                            whileHover={{ x: 5, scale: 1.02 }}
                          >
                            <Check className="h-4 w-4 text-primary flex-shrink-0" />
                            <span>{feature}</span>
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Schedule */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <Card className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-300">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Clock className="h-5 w-5 text-primary" />
                        Today's Schedule
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {vehicle.schedule.map((item: any, index: number) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.7 + index * 0.05 }}
                            whileHover={{ 
                              scale: 1.02,
                              x: 5,
                              transition: { type: "spring", stiffness: 400 }
                            }}
                            className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors relative overflow-hidden group"
                          >
                            {/* Shimmer on hover */}
                            <motion.div
                              className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent"
                              initial={{ x: "-100%" }}
                              whileHover={{ x: "100%" }}
                              transition={{ duration: 0.6 }}
                            />
                            
                            <div className="relative z-10">
                              <p className="font-semibold">{item.time}</p>
                              <p className="text-sm text-muted-foreground">{item.route}</p>
                            </div>
                            <Badge variant={item.seats > 10 ? "default" : "secondary"}>
                              {item.seats} seats
                            </Badge>
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Safety Notice */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  <Card className="border-primary/50 bg-primary/5 backdrop-blur-sm relative overflow-hidden group">
                    {/* Animated glow effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/20 to-transparent"
                      animate={{ x: ["-100%", "100%"] }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        repeatDelay: 2,
                        ease: "easeInOut"
                      }}
                    />
                    
                    <CardContent className="pt-6 relative z-10">
                      <div className="flex items-start gap-3">
                        <motion.div
                          animate={{ 
                            scale: [1, 1.1, 1],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        >
                          <Shield className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                        </motion.div>
                        <div>
                          <p className="font-semibold mb-2">Safety First</p>
                          <p className="text-sm text-muted-foreground">
                            All our drivers are verified with valid licenses. Vehicles are regularly inspected and maintained for your safety and comfort.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            </div>
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
  )
}