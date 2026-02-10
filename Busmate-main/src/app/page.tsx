"use client"

import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Bus, Users, Zap, TrendingUp, CheckCircle2, Lightbulb, Trophy, ArrowRight, Wallet, Search, MapPin, Star, Verified, Settings, Ticket, User, ChevronLeft, ChevronRight } from "lucide-react"
import { VscHome, VscCalendar } from "react-icons/vsc"
import { useLanguage } from "@/providers/LanguageProvider"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import Dock from "@/components/Dock"
import ScrollToTop from "@/components/ScrollToTop"
import ClickSpark from "@/components/ClickSpark"
import MovingLogos from "@/components/MovingLogos"
import PageLoader from "@/components/PageLoader"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function Home() {
  const router = useRouter()
  const { t } = useLanguage()
  const [isLoading, setIsLoading] = useState(true)
  const [availableDrivers, setAvailableDrivers] = useState<any[]>([])
  const [loadingDrivers, setLoadingDrivers] = useState(false)
  const [driversError, setDriversError] = useState<string | null>(null)
  const [currentTrackingCard, setCurrentTrackingCard] = useState(0)

  // Tracking card options
  const trackingCards = [
    {
      id: 1,
      title: "Live Tracking",
      subtitle: "Real-time bus location",
      icon: Bus,
      route: [
        { location: "ABES Institute", status: "current", time: "Now" },
        { location: "City Center", status: "next", time: "5 min" },
        { location: "Railway Station", status: "destination", time: "15 min" }
      ],
      stats: { rating: "4.8", buses: "850+", onTime: "98%" }
    },
    {
      id: 2,
      title: "Route Planning",
      subtitle: "Optimize your journey",
      icon: MapPin,
      route: [
        { location: "Your Location", status: "current", time: "Now" },
        { location: "Shopping Mall", status: "next", time: "8 min" },
        { location: "Airport", status: "destination", time: "25 min" }
      ],
      stats: { rating: "4.9", buses: "650+", onTime: "96%" }
    },
    {
      id: 3,
      title: "Express Service",
      subtitle: "Fastest routes available",
      icon: Zap,
      route: [
        { location: "Tech Park", status: "current", time: "Now" },
        { location: "Metro Station", status: "next", time: "3 min" },
        { location: "Business District", status: "destination", time: "12 min" }
      ],
      stats: { rating: "4.7", buses: "450+", onTime: "99%" }
    },
    {
      id: 4,
      title: "Night Service",
      subtitle: "24/7 availability",
      icon: Bus,
      route: [
        { location: "Hospital", status: "current", time: "Now" },
        { location: "University", status: "next", time: "6 min" },
        { location: "Residential Area", status: "destination", time: "18 min" }
      ],
      stats: { rating: "4.6", buses: "320+", onTime: "97%" }
    }
  ]

  const nextCard = () => {
    setCurrentTrackingCard((prev) => (prev + 1) % trackingCards.length)
  }

  const prevCard = () => {
    setCurrentTrackingCard((prev) => (prev - 1 + trackingCards.length) % trackingCards.length)
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const fetchDrivers = async () => {
      setLoadingDrivers(true)
      setDriversError(null)
      try {
        const response = await fetch('/api/drivers?status=approved&limit=4')
        const data = await response.json()

        if (response.ok && data.success) {
          setAvailableDrivers(data.drivers)
        } else {
          setDriversError(data.error || 'Failed to fetch drivers')
          setAvailableDrivers([
            {
              id: 1,
              name: "Vikram Singh",
              vehicle: "UPSRTC Government Bus",
              image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200",
              rating: 4.8,
              trips: 1250,
              distance: "0.8 km away",
              verified: true,
              available: true,
            },
            {
              id: 2,
              name: "Mohammad Ali",
              vehicle: "Private AC Bus",
              image: "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=200",
              rating: 4.9,
              trips: 980,
              distance: "1.2 km away",
              verified: true,
              available: true,
            },
            {
              id: 3,
              name: "Ramesh Gupta",
              vehicle: "Chartered Bus (45 Seater)",
              image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200",
              rating: 4.9,
              trips: 567,
              distance: "2.1 km away",
              verified: true,
              available: true,
            },
          ])
        }
      } catch (error) {
        console.error('Error fetching drivers:', error)
        setDriversError('Network error')
        setAvailableDrivers([
          {
            id: 1,
            name: "Vikram Singh",
            vehicle: "UPSRTC Government Bus",
            image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200",
            rating: 4.8,
            trips: 1250,
            distance: "0.8 km away",
            verified: true,
            available: true,
          },
          {
            id: 2,
            name: "Mohammad Ali",
            vehicle: "Private AC Bus",
            image: "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=200",
            rating: 4.9,
            trips: 980,
            distance: "1.2 km away",
            verified: true,
            available: true,
          },
          {
            id: 3,
            name: "Ramesh Gupta",
            vehicle: "Chartered Bus (45 Seater)",
            image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200",
            rating: 4.9,
            trips: 567,
            distance: "2.1 km away",
            verified: true,
            available: true,
          },
        ])
      } finally {
        setLoadingDrivers(false)
      }
    }

    if (!isLoading) {
      fetchDrivers()
    }
  }, [isLoading])

  const dockItems = [
    { icon: <VscHome size={20} />, label: 'Home', onClick: () => router.push('/') },
    { icon: <Ticket size={20} />, label: 'Book Ticket', onClick: () => router.push('/booking') },
    { icon: <Wallet size={20} />, label: 'My Wallet', onClick: () => router.push('/profile?tab=wallet') },
    { icon: <Settings size={20} />, label: 'Settings', onClick: () => router.push('/profile?tab=settings') },
  ]

  const stats = [
    { icon: Trophy, label: "Bus Operators", value: "25+" },
    { icon: Users, label: "Active Buses", value: "850+" },
    { icon: Zap, label: "Tickets Today", value: "7,456+" },
    { icon: TrendingUp, label: "On-Time", value: "98.56%" },
  ]

  const services = [
    {
      title: "Government Bus",
      description: "Affordable and reliable state-owned bus services with fixed schedules and extensive route coverage.",
      icon: Bus,
    },
    {
      title: "Private Bus",
      description: "Comfort and flexibility with better amenities, direct routes, and personalized services.",
      icon: Bus,
    },
    {
      title: "Chartered Bus",
      description: "Tailored transportation for groups, events, and special occasions with flexible scheduling.",
      icon: Bus,
    },
  ]

  const features = [
    {
      icon: CheckCircle2,
      title: "Seamless Connectivity",
      description: "Digitizing local travel to bring reliable, affordable, and eco-friendly rides to everyone.",
    },
    {
      icon: Lightbulb,
      title: "Smart Mobility",
      description: "Real-time tracking, verified drivers, and easy seat booking for safe transparent journeys.",
    },
    {
      icon: TrendingUp,
      title: "Sustainable Growth",
      description: "Supporting a greener urban future through innovation and community-focused design.",
    },
  ]

  const bookingSteps = [
    {
      number: "01",
      icon: Search,
      title: "Search Your Route",
      description: "Enter your pickup and drop location to find available buses on your route.",
    },
    {
      number: "02",
      icon: CheckCircle2,
      title: "Select Your Ride",
      description: "Choose from government, private, or chartered options. View real-time availability and fares.",
    },
    {
      number: "03",
      icon: Verified,
      title: "Confirm Booking",
      description: "Review your selection, choose your seat, and complete payment securely through our platform.",
    },
    {
      number: "04",
      icon: MapPin,
      title: "Track & Travel",
      description: "Get live updates on your ride location, estimated arrival time, and driver details for a safe journey.",
    },
  ]

  const testimonials = [
    {
      name: "Rajesh Kumar",
      role: "Daily Commuter",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200",
      rating: 5,
      review: "Bus Mate has transformed my daily commute! Real-time tracking and easy booking make traveling stress-free. Highly recommended!",
    },
    {
      name: "Priya Sharma",
      role: "College Student",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200",
      rating: 5,
      review: "As a student, affordability matters. Bus Mate offers the best rates with verified drivers. I feel safe and save money!",
    },
    {
      name: "Amit Patel",
      role: "Business Professional",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200",
      rating: 5,
      review: "The chartered bus service for our corporate events is exceptional. Professional drivers, clean vehicles, and punctual service every time.",
    },
    {
      name: "Sneha Reddy",
      role: "Freelancer",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200",
      rating: 5,
      review: "The booking system is incredibly convenient and the buses are always on time. Perfect for my flexible work schedule!",
    },
  ]

  if (isLoading) {
    return <PageLoader />
  }

  const currentCard = trackingCards[currentTrackingCard]

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

        {/* Hero Section - removed all glow effects */}
        <section className="relative overflow-hidden py-20 md:py-32 bg-background">
          {/* Subtle background gradient - no blur */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background" />
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left side - Content */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-heading leading-tight">
                    {t("innovativeTravel")}
                  </h1>
                </motion.div>
                <motion.p
                  className="text-lg md:text-xl text-foreground mb-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  {t("heroDescription")}
                </motion.p>
                <motion.div
                  className="flex flex-col sm:flex-row gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <Link href="/vehicles">
                    <Button 
                      size="lg" 
                      className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8"
                    >
                      <ArrowRight className="h-5 w-5 mr-2" />
                      {t("startJourney")}
                    </Button>
                  </Link>
                  <Link href="/driver-dashboard">
                    <Button 
                      size="lg" 
                      variant="outline" 
                      className="text-lg px-8 border-border text-foreground"
                    >
                      <Users className="h-5 w-5 mr-2" />
                      Driver Dashboard
                    </Button>
                  </Link>
                  <Link href="/pricing">
                    <Button 
                      size="lg" 
                      variant="outline" 
                      className="text-lg px-8 border-border text-foreground"
                    >
                      {t("viewPricing")}
                    </Button>
                  </Link>
                </motion.div>
              </motion.div>

              {/* Right side - Visual with Navigation - no glow */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative"
              >
                <div className="relative aspect-square lg:aspect-auto lg:h-[450px]">
                  {/* Main card with animation */}
                  <motion.div
                    key={currentCard.id}
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="relative bg-card border-border">
                      <CardContent className="p-6 h-full flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-3 mb-5">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <currentCard.icon className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <h3 className="text-lg font-bold text-card-foreground">{currentCard.title}</h3>
                              <p className="text-xs text-muted-foreground">{currentCard.subtitle}</p>
                            </div>
                          </div>

                          {/* Mock bus route */}
                          <div className="space-y-3 mb-5">
                            {currentCard.route.map((stop, index) => (
                              <div key={index}>
                                <div className="flex items-center gap-3">
                                  <div className={`h-2.5 w-2.5 rounded-full ${
                                    stop.status === 'current' 
                                      ? 'bg-primary' 
                                      : stop.status === 'next'
                                      ? 'border-2 border-primary/50'
                                      : 'border-2 border-muted'
                                  }`} />
                                  <div className="flex-1">
                                    <p className="text-sm font-medium text-card-foreground">{stop.location}</p>
                                    <p className="text-xs text-muted-foreground">
                                      {stop.status === 'current' ? 'Current Location' : 
                                       stop.status === 'next' ? 'Next Stop' : 'Destination'}
                                    </p>
                                  </div>
                                  <span className={`text-xs font-medium ${
                                    stop.status === 'current' ? 'text-primary' : 'text-muted-foreground'
                                  }`}>
                                    {stop.time}
                                  </span>
                                </div>
                                {index < currentCard.route.length - 1 && (
                                  <div className={`ml-1 border-l-2 border-dashed h-8 ${
                                    index === 0 ? 'border-primary/30' : 'border-muted/30'
                                  }`} />
                                )}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Stats and Navigation */}
                        <div>
                          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-border mb-4">
                            <div>
                              <p className="text-xl font-bold text-primary">{currentCard.stats.rating}</p>
                              <p className="text-xs text-muted-foreground">Rating</p>
                            </div>
                            <div>
                              <p className="text-xl font-bold text-primary">{currentCard.stats.buses}</p>
                              <p className="text-xs text-muted-foreground">Buses</p>
                            </div>
                            <div>
                              <p className="text-xl font-bold text-primary">{currentCard.stats.onTime}</p>
                              <p className="text-xs text-muted-foreground">On-Time</p>
                            </div>
                          </div>

                          {/* Navigation buttons at bottom */}
                          <div className="flex justify-between items-center gap-4">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={prevCard}
                              className="h-10 w-10 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground flex items-center justify-center"
                            >
                              <ChevronLeft className="h-5 w-5" />
                            </motion.button>

                            {/* Card indicators */}
                            <div className="flex gap-2">
                              {trackingCards.map((_, index) => (
                                <button
                                  key={index}
                                  onClick={() => setCurrentTrackingCard(index)}
                                  className={`h-2 rounded-full transition-all duration-300 ${
                                    index === currentTrackingCard 
                                      ? 'w-8 bg-primary' 
                                      : 'w-2 bg-primary/30 hover:bg-primary/50'
                                  }`}
                                />
                              ))}
                            </div>

                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={nextCard}
                              className="h-10 w-10 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground flex items-center justify-center"
                            >
                              <ChevronRight className="h-5 w-5" />
                            </motion.button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>
              </motion.div>
            </div>

            {/* Stats Grid - clean design */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ 
                    delay: 0.9 + index * 0.1,
                    type: "spring",
                    stiffness: 200,
                    damping: 15 
                  }}
                  whileHover={{ 
                    scale: 1.05,
                    transition: { type: "spring", stiffness: 400 }
                  }}
                  className="bg-card border border-border rounded-xl p-6 text-center"
                >
                  <stat.icon className="h-8 w-8 mx-auto mb-3 text-primary" />
                  <div className="text-3xl font-bold text-foreground mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* About Section - clean design */}
        <section id="about" className="py-20 bg-surface border-y border-border">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12"
            >
              <motion.h2 
                className="text-3xl md:text-5xl font-bold mb-4 text-heading"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                {t("aboutBusMate")}
              </motion.h2>
              <motion.p 
                className="text-xl text-foreground"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                {t("aboutDescription")}
              </motion.p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ 
                    delay: index * 0.2,
                    type: "spring",
                    stiffness: 100 
                  }}
                  whileHover={{ 
                    y: -10,
                    transition: { type: "spring", stiffness: 400 }
                  }}
                >
                  <Card className="h-full bg-card border-border">
                    <CardContent className="p-6">
                      <feature.icon className="h-12 w-12 text-primary mb-4" />
                      <h3 className="text-xl font-bold mb-3 text-card-foreground">{feature.title}</h3>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Services Section - clean design */}
        <section className="py-20 relative overflow-hidden bg-background">
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <motion.h2 
                className="text-3xl md:text-5xl font-bold mb-4 text-heading"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                {t("ourServices")}
              </motion.h2>
              <motion.p 
                className="text-xl text-foreground"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                {t("servicesDescription")}
              </motion.p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {services.map((service, index) => (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ 
                    delay: index * 0.1,
                    type: "spring",
                    stiffness: 100 
                  }}
                  whileHover={{ 
                    y: -10,
                    scale: 1.02,
                    transition: { type: "spring", stiffness: 400 }
                  }}
                >
                  <Card className="h-full bg-card border-border">
                    <CardContent className="p-8 text-center">
                      <service.icon className="h-16 w-16 mx-auto text-primary mb-6" />
                      <h3 className="text-2xl font-bold mb-4 text-card-foreground">{service.title}</h3>
                      <p className="text-sm text-foreground leading-relaxed">{service.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Booking Steps Section */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <motion.h2 
                className="text-3xl md:text-5xl font-bold mb-4 text-heading"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                {t("howToBook")}
              </motion.h2>
              <motion.p 
                className="text-xl text-foreground"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                {t("bookingDescription")}
              </motion.p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
              {bookingSteps.map((step, index) => (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ 
                    delay: index * 0.15,
                    type: "spring",
                    stiffness: 100 
                  }}
                  whileHover={{ 
                    y: -10,
                    transition: { type: "spring", stiffness: 400 }
                  }}
                >
                  <Card className="h-full bg-card border-border">
                    <CardContent className="p-6 relative z-10">
                      <div className="flex items-start gap-4 mb-4">
                        <span className="text-5xl font-bold text-primary/20">{step.number}</span>
                        <div className="bg-primary/10 rounded-full p-3 mt-2">
                          <step.icon className="h-6 w-6 text-primary" />
                        </div>
                      </div>
                      <h3 className="text-xl font-bold mb-3 text-card-foreground">{step.title}</h3>
                      <p className="text-sm text-foreground">{step.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Customer Reviews Section */}
        <section className="py-20 relative overflow-hidden bg-surface border-y border-border">
          <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background opacity-50" />
          
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <motion.h2 
                className="text-3xl md:text-5xl font-bold mb-4 text-heading"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                {t("customerReviews")}
              </motion.h2>
              <motion.p 
                className="text-xl text-foreground"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                {t("reviewsDescription")}
              </motion.p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ 
                    delay: index * 0.1,
                    type: "spring",
                    stiffness: 100 
                  }}
                  whileHover={{ 
                    y: -10,
                    transition: { type: "spring", stiffness: 400 }
                  }}
                >
                  <Card className="h-full bg-card border-border">
                    <CardContent className="p-6 flex flex-col h-full">
                      <div className="flex items-center gap-1 mb-4">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                        ))}
                      </div>
                      
                      <p className="text-sm text-foreground mb-6 flex-grow italic">
                        "{testimonial.review}"
                      </p>
                      
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12 border-2 border-primary/20">
                          <AvatarImage src={testimonial.image} alt={testimonial.name} />
                          <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-semibold text-sm text-card-foreground">{testimonial.name}</h4>
                          <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Available Drivers Section */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <motion.h2 
                className="text-3xl md:text-5xl font-bold mb-4 text-heading"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                {t("availableDrivers")}
              </motion.h2>
              <motion.p 
                className="text-xl text-foreground"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                {t("driversDescription")}
              </motion.p>
            </motion.div>

            {loadingDrivers ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
                {[1, 2, 3, 4].map((i) => (
                  <Card key={i} className="h-full bg-card border-border animate-pulse">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between mb-4">
                        <div className="h-14 w-14 rounded-full bg-muted" />
                        <div className="h-5 w-5 rounded-full bg-muted" />
                      </div>
                      <div className="h-5 w-28 bg-muted rounded mb-2" />
                      <div className="h-4 w-full bg-muted rounded mb-4" />
                      <div className="space-y-2 mb-4">
                        <div className="h-4 w-24 bg-muted rounded" />
                        <div className="h-4 w-20 bg-muted rounded" />
                      </div>
                      <div className="h-9 w-full bg-muted rounded" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : availableDrivers.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
                {availableDrivers.map((driver, index) => (
                  <motion.div
                    key={driver.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ 
                      delay: index * 0.1,
                      type: "spring",
                      stiffness: 100 
                    }}
                    whileHover={{ 
                      y: -15,
                      scale: 1.02,
                      transition: { type: "spring", stiffness: 400 }
                    }}
                  >
                    <Card className="h-full bg-card border-border">
                      <CardContent className="p-5">
                        <div className="flex items-start justify-between mb-3">
                          <Avatar className="h-14 w-14 border-2 border-primary/20">
                            <AvatarImage src={driver.image} alt={driver.name} />
                            <AvatarFallback>{driver.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          {driver.verified && (
                            <div className="bg-primary/10 rounded-full p-1">
                              <Verified className="h-4 w-4 text-primary" />
                            </div>
                          )}
                        </div>
                        
                        <h3 className="text-base font-bold mb-1 text-card-foreground">{driver.name}</h3>
                        <p className="text-sm text-foreground mb-3">{driver.vehicle}</p>
                        
                        <div className="space-y-2 mb-3">
                          <div className="flex items-center gap-2 text-sm">
                            <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                            <span className="font-semibold text-foreground">{driver.rating}</span>
                            <span className="text-muted-foreground">({driver.trips} trips)</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-foreground">
                            <MapPin className="h-4 w-4 text-primary" />
                            <span>{driver.distance}</span>
                          </div>
                        </div>
                        
                        <Link href="/booking">
                          <Button className="w-full bg-primary hover:bg-primary/90 hover:scale-[1.02] transition-all duration-300 text-primary-foreground">
                            <ArrowRight className="h-4 w-4 mr-2" />
                            {t("bookNow")}
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-12"
              >
                <Bus className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-xl text-foreground mb-2">No drivers available at the moment</p>
                <p className="text-sm text-muted-foreground">Please check back later or try refreshing the page</p>
              </motion.div>
            )}

            {!loadingDrivers && availableDrivers.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="text-center mt-8"
              >
                <Link href="/vehicles">
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="hover:scale-105 transition-all duration-300 hover:border-primary/50 text-foreground border-primary/40 hover:bg-primary/10"
                  >
                    View All Available Drivers
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </motion.div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section id="contact" className="py-20 bg-gradient-to-br from-primary/20 to-background relative overflow-hidden border-t border-border">
          <div className="container mx-auto px-4 text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <motion.h2 
                className="text-3xl md:text-5xl font-bold mb-6 text-heading"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
              >
                {t("readyToStart")}
              </motion.h2>
              <motion.p 
                className="text-xl text-foreground mb-8 max-w-2xl mx-auto"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                {t("ctaDescription")}
              </motion.p>
              <motion.div 
                className="flex flex-col sm:flex-row gap-4 justify-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
              >
                <Link href="/booking">
                  <Button 
                    size="lg" 
                    className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-12 hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-primary/50"
                  >
                    <ArrowRight className="h-5 w-5 mr-2" />
                    {t("bookYourRide")}
                  </Button>
                </Link>
                <Link href="/pricing">
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="text-lg px-12 hover:scale-105 transition-all duration-300 hover:border-primary/50 text-foreground border-primary/40 hover:bg-primary/10"
                  >
                    {t("viewPlans")}
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>

        <Footer />

        <Dock 
          items={dockItems}
          panelHeight={68}
          baseItemSize={50}
          magnification={70}
          distance={200}
        />

        <ScrollToTop />
      </div>
    </ClickSpark>
  )
}