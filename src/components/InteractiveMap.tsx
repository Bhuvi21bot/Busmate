"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Bus, MapPin, Navigation, Users, Clock, X } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface Vehicle {
  id: number
  vehicleNumber: string
  vehicleType: string
  capacity: number
  driverId: string | null
  status: string
  currentRoute: string | null
  locationLat: number | null
  locationLng: number | null
  createdAt: string
  updatedAt: string
}

interface MapBounds {
  minLat: number
  maxLat: number
  minLng: number
  maxLng: number
}

export default function InteractiveMap() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [mapBounds, setMapBounds] = useState<MapBounds>({
    minLat: 18.5,
    maxLat: 28.7,
    minLng: 72.8,
    maxLng: 77.2,
  })
  const mapRef = useRef<HTMLDivElement>(null)

  // Fetch vehicles from API
  const fetchVehicles = async () => {
    try {
      const response = await fetch('/api/vehicles?status=active')
      if (response.ok) {
        const data = await response.json()
        // Filter vehicles with valid GPS coordinates
        const vehiclesWithLocation = data.filter(
          (v: Vehicle) => v.locationLat !== null && v.locationLng !== null
        )
        setVehicles(vehiclesWithLocation)
        
        // Calculate map bounds based on vehicle locations
        if (vehiclesWithLocation.length > 0) {
          const lats = vehiclesWithLocation.map((v: Vehicle) => v.locationLat!)
          const lngs = vehiclesWithLocation.map((v: Vehicle) => v.locationLng!)
          setMapBounds({
            minLat: Math.min(...lats) - 0.5,
            maxLat: Math.max(...lats) + 0.5,
            minLng: Math.min(...lngs) - 0.5,
            maxLng: Math.max(...lngs) + 0.5,
          })
        }
      }
    } catch (error) {
      console.error('Failed to fetch vehicles:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchVehicles()
    
    // Refresh vehicle locations every 10 seconds
    const interval = setInterval(() => {
      fetchVehicles()
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  // Convert lat/lng to SVG coordinates
  const latLngToSvg = (lat: number, lng: number) => {
    const width = 800
    const height = 600
    
    const x = ((lng - mapBounds.minLng) / (mapBounds.maxLng - mapBounds.minLng)) * width
    const y = height - ((lat - mapBounds.minLat) / (mapBounds.maxLat - mapBounds.minLat)) * height
    
    return { x, y }
  }

  const getVehicleColor = (type: string) => {
    const colors: { [key: string]: string } = {
      'government-bus': '#4ade80',
      'private-bus': '#60a5fa',
      'chartered-bus': '#f59e0b',
      'e-rickshaw': '#ec4899',
    }
    return colors[type] || '#8b5cf6'
  }

  const getVehicleLabel = (type: string) => {
    const labels: { [key: string]: string } = {
      'government-bus': 'Government',
      'private-bus': 'Private',
      'chartered-bus': 'Chartered',
      'e-rickshaw': 'E-Rickshaw',
    }
    return labels[type] || type
  }

  if (isLoading) {
    return (
      <div className="w-full h-[600px] rounded-2xl bg-gradient-to-br from-muted to-muted/50 border border-border/50 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ 
              rotate: 360,
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            <MapPin className="h-12 w-12 text-primary mx-auto mb-4" />
          </motion.div>
          <p className="text-lg font-semibold">Loading Map...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full h-[600px] rounded-2xl overflow-hidden border border-border/50 bg-card">
      {/* Map Header */}
      <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between">
        <Card className="bg-card/95 backdrop-blur-sm border-border/50">
          <CardContent className="p-3 flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm font-medium">{vehicles.length} Vehicles Active</span>
          </CardContent>
        </Card>
        
        <Button
          size="sm"
          variant="outline"
          onClick={() => fetchVehicles()}
          className="bg-card/95 backdrop-blur-sm"
        >
          <Navigation className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* SVG Map */}
      <div ref={mapRef} className="w-full h-full bg-gradient-to-br from-blue-50 via-green-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <svg viewBox="0 0 800 600" className="w-full h-full">
          {/* Grid Lines */}
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.1" />
            </pattern>
          </defs>
          <rect width="800" height="600" fill="url(#grid)" />

          {/* Roads/Routes */}
          <motion.path
            d="M 100 100 Q 250 150, 400 200 T 700 300"
            stroke="currentColor"
            strokeWidth="3"
            fill="none"
            opacity="0.2"
            strokeDasharray="5,5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2 }}
          />
          <motion.path
            d="M 200 500 Q 400 450, 600 400"
            stroke="currentColor"
            strokeWidth="3"
            fill="none"
            opacity="0.2"
            strokeDasharray="5,5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, delay: 0.5 }}
          />

          {/* Vehicle Markers */}
          {vehicles.map((vehicle, index) => {
            const { x, y } = latLngToSvg(vehicle.locationLat!, vehicle.locationLng!)
            const color = getVehicleColor(vehicle.vehicleType)
            const isSelected = selectedVehicle?.id === vehicle.id

            return (
              <g key={vehicle.id}>
                {/* Pulsing Circle */}
                <motion.circle
                  cx={x}
                  cy={y}
                  r="20"
                  fill={color}
                  opacity="0.2"
                  initial={{ scale: 0 }}
                  animate={{ 
                    scale: isSelected ? [1, 1.5, 1] : 1,
                    opacity: isSelected ? [0.2, 0.4, 0.2] : 0.2
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />

                {/* Main Marker */}
                <motion.g
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  style={{ cursor: 'pointer' }}
                  onClick={() => setSelectedVehicle(vehicle)}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <circle
                    cx={x}
                    cy={y}
                    r="12"
                    fill={color}
                    stroke="white"
                    strokeWidth="2"
                  />
                  <text
                    x={x}
                    y={y}
                    textAnchor="middle"
                    dominantBaseline="central"
                    className="text-[10px] font-bold fill-white"
                  >
                    {vehicle.vehicleNumber.slice(-2)}
                  </text>
                </motion.g>

                {/* Label */}
                {isSelected && (
                  <motion.text
                    x={x}
                    y={y - 25}
                    textAnchor="middle"
                    className="text-xs font-semibold fill-foreground"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {vehicle.vehicleNumber}
                  </motion.text>
                )}
              </g>
            )
          })}
        </svg>
      </div>

      {/* Legend */}
      <Card className="absolute bottom-4 left-4 bg-card/95 backdrop-blur-sm border-border/50">
        <CardContent className="p-3">
          <p className="text-xs font-semibold mb-2">Vehicle Types</p>
          <div className="flex flex-wrap gap-2">
            {['government-bus', 'private-bus', 'chartered-bus', 'e-rickshaw'].map((type) => (
              <div key={type} className="flex items-center gap-1.5">
                <div 
                  className="h-3 w-3 rounded-full" 
                  style={{ backgroundColor: getVehicleColor(type) }}
                />
                <span className="text-xs">{getVehicleLabel(type)}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Vehicle Details Panel */}
      <AnimatePresence>
        {selectedVehicle && (
          <motion.div
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            transition={{ type: "spring", damping: 20 }}
            className="absolute top-4 right-4 bottom-4 w-80"
          >
            <Card className="h-full bg-card/98 backdrop-blur-sm border-border/50 shadow-2xl overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="h-10 w-10 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: getVehicleColor(selectedVehicle.vehicleType) }}
                    >
                      <Bus className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{selectedVehicle.vehicleNumber}</CardTitle>
                      <p className="text-xs text-muted-foreground">
                        {getVehicleLabel(selectedVehicle.vehicleType)}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedVehicle(null)}
                    className="h-8 w-8"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Status Badge */}
                <div className="flex items-center gap-2">
                  <Badge
                    variant={selectedVehicle.status === 'active' ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    <div className="h-1.5 w-1.5 rounded-full bg-current mr-1.5" />
                    {selectedVehicle.status.toUpperCase()}
                  </Badge>
                </div>

                {/* Vehicle Info */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <Users className="h-4 w-4 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Capacity</p>
                      <p className="text-sm font-semibold">{selectedVehicle.capacity} Seats</p>
                    </div>
                  </div>

                  {selectedVehicle.currentRoute && (
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <Navigation className="h-4 w-4 text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground">Current Route</p>
                        <p className="text-sm font-semibold">{selectedVehicle.currentRoute}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <MapPin className="h-4 w-4 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Location</p>
                      <p className="text-xs font-mono">
                        {selectedVehicle.locationLat?.toFixed(4)}, {selectedVehicle.locationLng?.toFixed(4)}
                      </p>
                    </div>
                  </div>

                  {selectedVehicle.driverId && (
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <Clock className="h-4 w-4 text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground">Driver ID</p>
                        <p className="text-sm font-semibold">{selectedVehicle.driverId}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="pt-4 space-y-2">
                  <Button className="w-full" size="sm">
                    <Navigation className="h-4 w-4 mr-2" />
                    Track Vehicle
                  </Button>
                  <Button variant="outline" className="w-full" size="sm">
                    <MapPin className="h-4 w-4 mr-2" />
                    View Route
                  </Button>
                </div>

                {/* Last Updated */}
                <div className="pt-4 border-t border-border/50">
                  <p className="text-xs text-muted-foreground text-center">
                    Last updated: {new Date(selectedVehicle.updatedAt).toLocaleTimeString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
