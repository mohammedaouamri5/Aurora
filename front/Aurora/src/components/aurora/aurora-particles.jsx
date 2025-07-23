"use client"

import { Box } from "@mui/material"
import { useEffect, useState } from "react"

export function AuroraParticles() {
  const [particles, setParticles] = useState([])

  useEffect(() => {
    // Generate random particles
    const newParticles = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 20 + 15,
      delay: Math.random() * 10,
    }))
    setParticles(newParticles)
  }, [])

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: -1,
        pointerEvents: "none",
      }}
    >
      {particles.map((particle) => (
        <Box
          key={particle.id}
          sx={{
            position: "absolute",
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            borderRadius: "50%",
            background: `radial-gradient(circle, rgba(34, 197, 94, 0.8) 0%, rgba(74, 222, 128, 0.4) 50%, transparent 100%)`,
            animation: `aurora-float ${particle.duration}s ease-in-out infinite`,
            animationDelay: `${particle.delay}s`,
            boxShadow: `0 0 ${particle.size * 4}px rgba(34, 197, 94, 0.6)`,
            "@keyframes aurora-float": {
              "0%, 100%": {
                transform: "translateY(0px) translateX(0px)",
                opacity: 0.3,
              },
              "25%": {
                transform: "translateY(-20px) translateX(10px)",
                opacity: 0.7,
              },
              "50%": {
                transform: "translateY(-10px) translateX(-15px)",
                opacity: 0.5,
              },
              "75%": {
                transform: "translateY(-30px) translateX(5px)",
                opacity: 0.8,
              },
            },
          }}
        />
      ))}
    </Box>
  )
}
