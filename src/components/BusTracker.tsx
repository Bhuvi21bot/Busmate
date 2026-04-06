"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { MapPin, Navigation, Clock, Users } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Bus {
  id: string
  name: string
  route: string
  currentLocation: string
  nextStop: string
  eta: number
  occupancy: number
  capacity: number
  status: "on-time" | "delayed" | "early"
}

export default function BusTracker() {
  const [buses, setBuses] = useState<Bus[]>([
    {
      id: "BUS001",
      name: "UPSRTC Express",
      route: "City Center → Airport",
      currentLocation: "Station Road",
      nextStop: "Mall Junction",
      eta: 5,
      occupancy: 28,
      capacity: 40,
      status: "on-time",
    },
    {
      id: "BUS002",
      name: "MetroWay",
      route: "Downtown → Suburb",
      currentLocation: "Park Avenue",
      nextStop: "Shopping Complex",
      eta: 8,
      occupancy: 35,
      capacity: 40,
      status: "on-time",
    },
    {
      id: "BUS003",
      name: "City Link",
      route: "Station → Mall",
      currentLocation: "Central Square",
      nextStop: "Tech Park",
      eta: 3,
      occupancy: 40,
      capacity: 40,
      status: "delayed",
    },
  ])

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setBuses((prevBuses) =>
        prevBuses.map((bus) => ({
          ...bus,
          eta: Math.max(1, bus.eta - 1),
          occupancy: Math.min(
            bus.capacity,
            bus.occupancy + Math.floor(Math.random() * 3) - 1
          ),
        }))
      )
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status: Bus["status"]) => {
    switch (status) {
      case "on-time":
        return "bg-green-500"
      case "delayed":
        return "bg-red-500"
      case "early":
        return "bg-blue-500"
    }
  }

  const getOccupancyColor = (occupancy: number, capacity: number) => {
    const percentage = (occupancy / capacity) * 100
    if (percentage >= 90) return "text-red-500"
    if (percentage >= 70) return "text-yellow-500"
    return "text-green-500"
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Live Bus Tracking</h2>
        <Badge variant="outline" className="animate-pulse">
          <div className="h-2 w-2 rounded-full bg-green-500 mr-2" />
          Live
        </Badge>
      </div>

      <div className="grid gap-4">
        {buses.map((bus, index) => (
          <motion.div
            key={bus.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{bus.name}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">{bus.route}</p>
                  </div>
                  <Badge className={getStatusColor(bus.status)}>
                    {bus.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">Current</p>
                      <p className="text-sm font-medium">{bus.currentLocation}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Navigation className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">Next Stop</p>
                      <p className="text-sm font-medium">{bus.nextStop}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-border/50">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">{bus.eta} min</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" />
                    <span
                      className={`text-sm font-medium ${getOccupancyColor(
                        bus.occupancy,
                        bus.capacity
                      )}`}
                    >
                      {bus.occupancy}/{bus.capacity}
                    </span>
                  </div>
                </div>

                {/* Occupancy Bar */}
                <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-green-400"
                    initial={{ width: 0 }}
                    animate={{ width: `${(bus.occupancy / bus.capacity) * 100}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
