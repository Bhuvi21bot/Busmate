"use client"

import { motion } from "framer-motion"
import { Bus, Navigation, MapPin, Clock, Shield, Zap, Star, Users } from "lucide-react"

export default function MovingLogos() {
  // Transportation and service icons representing different features/partners
  const logos = [
    { icon: Bus, label: "Bus Services", color: "text-primary" },
    { icon: Navigation, label: "GPS Tracking", color: "text-green-400" },
    { icon: MapPin, label: "Live Location", color: "text-blue-400" },
    { icon: Clock, label: "Real-time Updates", color: "text-yellow-400" },
    { icon: Shield, label: "Safe Travel", color: "text-purple-400" },
    { icon: Zap, label: "Fast Booking", color: "text-orange-400" },
    { icon: Star, label: "Top Rated", color: "text-pink-400" },
    { icon: Users, label: "Community", color: "text-cyan-400" },
  ]

  // Duplicate logos for seamless loop
  const duplicatedLogos = [...logos, ...logos, ...logos]

  return (
    <div className="w-full py-12 overflow-hidden bg-gradient-to-r from-background via-muted/20 to-background">
      <div className="relative">
        {/* Gradient overlays for fade effect */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10" />

        {/* Moving logos container */}
        <motion.div
          className="flex gap-12 items-center"
          animate={{
            x: [0, -1920], // Adjust based on content width
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 30,
              ease: "linear",
            },
          }}
        >
          {duplicatedLogos.map((logo, index) => {
            const Icon = logo.icon
            return (
              <motion.div
                key={index}
                className="flex-shrink-0 flex flex-col items-center justify-center gap-3 px-8"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <motion.div
                  className={`w-16 h-16 rounded-2xl bg-muted/50 backdrop-blur-sm border border-border/50 flex items-center justify-center ${logo.color}`}
                  animate={{
                    y: [0, -8, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: index * 0.1,
                  }}
                >
                  <Icon className="w-8 h-8" />
                </motion.div>
                <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
                  {logo.label}
                </span>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </div>
  )
}
