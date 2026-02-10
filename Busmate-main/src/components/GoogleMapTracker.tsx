"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { GoogleMap, LoadScript, Marker, InfoWindow, Circle } from "@react-google-maps/api"
import { motion, AnimatePresence } from "framer-motion"
import { Bus, MapPin, Navigation, Users, X, Clock } from "lucide-react"
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

// ABES Institute of Technology coordinates
const ABES_LOCATION = {
  lat: 28.6692,
  lng: 77.5019,
  name: "ABES Institute of Technology"
}

const mapContainerStyle = {
  width: '100%',
  height: '600px',
  borderRadius: '1rem'
}

const mapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  streetViewControl: false,
  mapTypeControl: true,
  fullscreenControl: true,
}

// Calculate distance between two coordinates using Haversine formula
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371 // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const distance = R * c
  return distance
}

export default function GoogleMapTracker() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [mapCenter, setMapCenter] = useState(ABES_LOCATION)
  const [showUserInfo, setShowUserInfo] = useState(false)

  // Vehicle color mapping
  const vehicleColorMap = useMemo(() => ({
    'government-bus': '#4ade80',
    'private-bus': '#60a5fa',
    'chartered-bus': '#f59e0b',
  }), [])

  const vehicleLabelMap = useMemo(() => ({
    'government-bus': 'Government',
    'private-bus': 'Private',
    'chartered-bus': 'Chartered',
  }), [])

  const getVehicleColor = useCallback((type: string) => {
    return vehicleColorMap[type as keyof typeof vehicleColorMap] || '#8b5cf6'
  }, [vehicleColorMap])

  const getVehicleLabel = useCallback((type: string) => {
    return vehicleLabelMap[type as keyof typeof vehicleLabelMap] || type
  }, [vehicleLabelMap])

  // Fetch vehicles from API
  const fetchVehicles = useCallback(async () => {
    try {
      const response = await fetch('/api/vehicles?status=active')
      if (response.ok) {
        const data = await response.json()
        const vehiclesWithLocation = data.filter(
          (v: Vehicle) => v.locationLat !== null && v.locationLng !== null
        )
        setVehicles(vehiclesWithLocation)
      }
    } catch (error) {
      console.error('Failed to fetch vehicles:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchVehicles()
    
    // Refresh every 30 seconds
    const interval = setInterval(() => {
      fetchVehicles()
    }, 30000)

    return () => clearInterval(interval)
  }, [fetchVehicles])

  // Calculate distances for all vehicles
  const vehiclesWithDistance = useMemo(() => {
    return vehicles.map(vehicle => {
      const distance = calculateDistance(
        ABES_LOCATION.lat,
        ABES_LOCATION.lng,
        vehicle.locationLat!,
        vehicle.locationLng!
      )
      return {
        ...vehicle,
        distance: distance,
        distanceText: distance < 1 
          ? `${(distance * 1000).toFixed(0)} m` 
          : `${distance.toFixed(2)} km`
      }
    }).sort((a, b) => a.distance - b.distance) // Sort by distance
  }, [vehicles])

  // Custom marker icons
  const userIcon = {
    path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z",
    fillColor: "#ef4444",
    fillOpacity: 1,
    strokeWeight: 2,
    strokeColor: "#ffffff",
    scale: 2,
  }

  if (isLoading) {
    return (
      <div className="w-full h-[600px] rounded-2xl bg-gradient-to-br from-muted to-muted/50 border border-border/50 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <MapPin className="h-12 w-12 text-primary mx-auto mb-4" />
          </motion.div>
          <p className="text-lg font-semibold">Loading Google Maps...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full">
      {/* Map Header */}
      <div className="mb-4 flex items-center justify-between flex-wrap gap-4">
        <Card className="bg-card/95 backdrop-blur-sm border-border/50">
          <CardContent className="p-3 flex items-center gap-3">
            <MapPin className="h-5 w-5 text-red-500" />
            <div>
              <p className="text-xs text-muted-foreground">Your Location</p>
              <p className="text-sm font-semibold">{ABES_LOCATION.name}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-card/95 backdrop-blur-sm border-border/50">
          <CardContent className="p-3 flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm font-medium">{vehicles.length} Buses Nearby</span>
          </CardContent>
        </Card>

        <Button
          size="sm"
          variant="outline"
          onClick={fetchVehicles}
          className="bg-card/95 backdrop-blur-sm"
        >
          <Navigation className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Google Map */}
      <div className="relative rounded-2xl overflow-hidden border border-border/50 shadow-lg">
        <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""}>
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={mapCenter}
            zoom={12}
            options={mapOptions}
          >
            {/* User Location Marker (ABES) */}
            <Marker
              position={ABES_LOCATION}
              icon={userIcon}
              onClick={() => setShowUserInfo(true)}
              title="Your Location"
            />

            {/* User Location Circle */}
            <Circle
              center={ABES_LOCATION}
              radius={500}
              options={{
                fillColor: "#ef4444",
                fillOpacity: 0.1,
                strokeColor: "#ef4444",
                strokeOpacity: 0.3,
                strokeWeight: 2,
              }}
            />

            {/* User Info Window */}
            {showUserInfo && (
              <InfoWindow
                position={ABES_LOCATION}
                onCloseClick={() => setShowUserInfo(false)}
              >
                <div className="p-2">
                  <h3 className="font-bold text-sm mb-1">{ABES_LOCATION.name}</h3>
                  <p className="text-xs text-gray-600">Your Current Location</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {ABES_LOCATION.lat.toFixed(4)}, {ABES_LOCATION.lng.toFixed(4)}
                  </p>
                </div>
              </InfoWindow>
            )}

            {/* Vehicle Markers */}
            {vehiclesWithDistance.map((vehicle) => {
              const color = getVehicleColor(vehicle.vehicleType)
              
              const vehicleIcon = {
                path: "M12 2L4 7v9c0 2.2 4.5 4 8 4s8-1.8 8-4V7l-8-5z",
                fillColor: color,
                fillOpacity: 1,
                strokeWeight: 2,
                strokeColor: "#ffffff",
                scale: 1.5,
              }

              return (
                <Marker
                  key={vehicle.id}
                  position={{ lat: vehicle.locationLat!, lng: vehicle.locationLng! }}
                  icon={vehicleIcon}
                  onClick={() => setSelectedVehicle(vehicle)}
                  title={`${vehicle.vehicleNumber} - ${vehicle.distanceText} away`}
                />
              )
            })}

            {/* Selected Vehicle Info Window */}
            {selectedVehicle && (
              <InfoWindow
                position={{ 
                  lat: selectedVehicle.locationLat!, 
                  lng: selectedVehicle.locationLng! 
                }}
                onCloseClick={() => setSelectedVehicle(null)}
              >
                <div className="p-3 max-w-xs">
                  <div className="flex items-center gap-2 mb-2">
                    <Bus className="h-5 w-5" style={{ color: getVehicleColor(selectedVehicle.vehicleType) }} />
                    <div>
                      <h3 className="font-bold text-sm">{selectedVehicle.vehicleNumber}</h3>
                      <p className="text-xs text-gray-600">{getVehicleLabel(selectedVehicle.vehicleType)}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-1 mb-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600">Distance:</span>
                      <span className="font-semibold text-primary">{selectedVehicle.distanceText}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600">Capacity:</span>
                      <span className="font-semibold">{selectedVehicle.capacity} seats</span>
                    </div>
                    {selectedVehicle.currentRoute && (
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-600">Route:</span>
                        <span className="font-semibold">{selectedVehicle.currentRoute}</span>
                      </div>
                    )}
                  </div>

                  <Badge
                    variant={selectedVehicle.status === 'active' ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    {selectedVehicle.status.toUpperCase()}
                  </Badge>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        </LoadScript>
      </div>

      {/* Nearby Buses List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-6"
      >
        <Card className="bg-card/95 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Bus className="h-5 w-5 text-primary" />
              Buses Nearby (Sorted by Distance)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {vehiclesWithDistance.length > 0 ? (
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {vehiclesWithDistance.slice(0, 5).map((vehicle) => (
                  <motion.div
                    key={vehicle.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() => {
                      setSelectedVehicle(vehicle)
                      setMapCenter({ lat: vehicle.locationLat!, lng: vehicle.locationLng! })
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="h-10 w-10 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: getVehicleColor(vehicle.vehicleType) }}
                      >
                        <Bus className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{vehicle.vehicleNumber}</p>
                        <p className="text-xs text-muted-foreground">
                          {getVehicleLabel(vehicle.vehicleType)} • {vehicle.capacity} seats
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-primary">{vehicle.distanceText}</p>
                      <p className="text-xs text-muted-foreground">away</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">No buses available nearby</p>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Legend */}
      <Card className="mt-4 bg-card/95 backdrop-blur-sm border-border/50">
        <CardContent className="p-4">
          <p className="text-xs font-semibold mb-3">Map Legend</p>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded-full bg-red-500 border-2 border-white" />
              <span className="text-xs">Your Location</span>
            </div>
            {Object.keys(vehicleColorMap).map((type) => (
              <div key={type} className="flex items-center gap-2">
                <div 
                  className="h-4 w-4 rounded-full border-2 border-white" 
                  style={{ backgroundColor: getVehicleColor(type) }}
                />
                <span className="text-xs">{getVehicleLabel(type)} Bus</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
