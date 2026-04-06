"use client"

import { motion } from "framer-motion"
import { Bus } from "lucide-react"

export default function PageLoader() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center">
      {/* Animated Loading Icon */}
      <motion.div
        className="relative mb-8"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Outer rotating circle */}
        <motion.div
          className="absolute inset-0 w-20 h-20 rounded-full border-4 border-primary/20 border-t-primary"
          animate={{ rotate: 360 }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        
        {/* Inner rotating circle */}
        <motion.div
          className="absolute inset-2 w-16 h-16 rounded-full border-4 border-green-500/20 border-b-green-500"
          animate={{ rotate: -360 }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        
        {/* Center bus icon */}
        <motion.div
          className="relative w-20 h-20 flex items-center justify-center"
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Bus className="w-9 h-9 text-primary" />
        </motion.div>
      </motion.div>

      {/* Loading text */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-center"
      >
        <motion.p
          className="text-lg font-medium text-foreground/80"
          animate={{
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          Loading...
        </motion.p>
      </motion.div>
    </div>
  )
}
