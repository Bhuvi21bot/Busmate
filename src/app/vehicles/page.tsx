"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ArrowRight, Info, Wallet, Navigation } from "lucide-react"
import { VscHome } from "react-icons/vsc"
import { useLanguage } from "@/providers/LanguageProvider"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import PageLoader from "@/components/PageLoader"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Dock from "@/components/Dock"
import ClickSpark from "@/components/ClickSpark"

export default function VehiclesPage() {
  const [activeTab, setActiveTab] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const [fetchedVehicles, setFetchedVehicles] = useState<any[]>([])
  const router = useRouter()
  const { t } = useLanguage()

  useEffect(() => {
    const fetchVehicles = async () => {
      setIsLoading(true)
      try {
        const typeParam = activeTab !== "all" ? `?vehicleType=${activeTab}` : ""
        const response = await fetch(`/api/vehicles${typeParam}`)
        if (response.ok) {
          const data = await response.json()
          setFetchedVehicles(data)
        } else {
          toast.error("Failed to fetch vehicles")
        }
      } catch (error) {
        console.error("Fetch vehicles error:", error)
        toast.error("An error occurred while fetching vehicles")
      } finally {
        setIsLoading(false)
      }
    }

    fetchVehicles()
  }, [activeTab])

  const dockItems = [
    { icon: <VscHome size={20} />, label: 'Home', onClick: () => router.push('/') },
    { icon: <Wallet size={20} />, label: 'Wallet', onClick: () => router.push('/driver-dashboard?tab=wallet') },
    { icon: <Navigation size={20} />, label: 'Near By Me', onClick: () => router.push('/vehicles') },
  ]

  if (isLoading && fetchedVehicles.length === 0) {
    return <PageLoader />
  }

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
              transition={{ duration: 0.8 }}
              className="text-center mb-12"
            >
              <motion.h1 
                className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-green-400 to-primary bg-clip-text text-transparent"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                {t("availableVehicles")}
              </motion.h1>
              <motion.p 
                className="text-xl text-muted-foreground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {t("vehiclesHeroDescription")}
              </motion.p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-12">
                <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-4">
                  <TabsTrigger value="all" className="transition-all duration-300">{t("all")}</TabsTrigger>
                  <TabsTrigger value="government-bus" className="transition-all duration-300">{t("government")}</TabsTrigger>
                  <TabsTrigger value="private-bus" className="transition-all duration-300">{t("private")}</TabsTrigger>
                  <TabsTrigger value="chartered-bus" className="transition-all duration-300">{t("chartered")}</TabsTrigger>
                </TabsList>
              </Tabs>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {fetchedVehicles.length === 0 && !isLoading && (
                <div className="col-span-full text-center py-20">
                  <p className="text-xl text-muted-foreground">No vehicles found for this category.</p>
                </div>
              )}
              {fetchedVehicles.map((vehicle, index) => (
                <motion.div
                  key={vehicle.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    delay: (index * 0.1),
                    type: "spring",
                    stiffness: 100 
                  }}
                  whileHover={{ 
                    y: -15,
                    transition: { type: "spring", stiffness: 400 }
                  }}
                >
                  <Card className="h-full bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-300 overflow-hidden relative group">
                    {/* Shimmer effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent z-10 pointer-events-none"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: "100%" }}
                      transition={{ duration: 0.6 }}
                    />

                    {/* Image with zoom effect */}
                    <div className="relative h-48 overflow-hidden">
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.4 }}
                        className="w-full h-full"
                      >
                        <Image
                          src={vehicle.image || "/image.png"}
                          alt={vehicle.model}
                          fill
                          className="object-cover"
                        />
                      </motion.div>
                      
                      {/* Overlay on hover */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>

                    <CardContent className="p-6 relative">
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        <h3 className="text-xl font-bold mb-2">{vehicle.model}</h3>
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                          {vehicle.description || "Comfortable and safe travel solutions with Bus Mate."}
                        </p>
                        <div className="space-y-2 mb-4">
                          <p className="text-sm">
                            <span className="font-semibold">{t("route")}:</span> {vehicle.currentRoute || "Local Routes"}
                          </p>
                          <motion.p 
                            className="text-sm"
                            whileHover={{ scale: 1.05, x: 5 }}
                          >
                            <span className="font-semibold">{t("fare")}:</span> <span className="text-primary font-bold">{vehicle.fare || "₹50-100"}</span>
                          </motion.p>
                        </div>
                        <div className="flex gap-2">
                          <Link href={`/vehicles/${vehicle.id}`} className="flex-1">
                            <Button 
                              variant="outline" 
                              className="w-full hover:scale-[1.02] transition-all duration-300"
                            >
                              <Info className="h-4 w-4 mr-2" />
                              {t("details")}
                            </Button>
                          </Link>
                          <Link href="/booking" className="flex-1">
                            <Button className="w-full bg-primary hover:scale-[1.02] transition-all duration-300 hover:shadow-lg hover:shadow-primary/50">
                              <ArrowRight className="h-4 w-4 mr-2" />
                              {t("book")}
                            </Button>
                          </Link>
                        </div>
                      </motion.div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
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