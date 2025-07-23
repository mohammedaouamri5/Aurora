"use client"

import { Box } from "@mui/material"
import { useEffect, useState } from "react"

export function MinimalParticles() {
  const [particles, setParticles] = useState([])

  useEffect(() => {
    // Generate fewer, more subtle particles
    const newParticles = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 0.5,
      duration: Math.random() * 25 + 20,
      delay: Math.random() * 15,
      color: [
        "rgba(59, 130, 246, 0.4)", // Blue
        "rgba(139, 92, 246, 0.3)", // Purple
        "rgba(16, 185, 129, 0.3)", // Green
        "rgba(236, 72, 153, 0.2)", // Pink
        "rgba(6, 182, 212, 0.3)", // Cyan
      ][Math.floor(Math.random() * 5)],
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
            background: `radial-gradient(circle, ${particle.color} 0%, transparent 70%)`,
            animation: `particle-float ${particle.duration}s ease-in-out infinite`,
            animationDelay: `${particle.delay}s`,
            boxShadow: `0 0 ${particle.size * 3}px ${particle.color}`,
            "@keyframes particle-float": {
              "0%, 100%": {
                transform: "translateY(0px) translateX(0px)",
                opacity: 0.2,
              },
              "50%": {
                transform: "translateY(-15px) translateX(8px)",
                opacity: 0.6,
              },
            },
          }}
        />
      ))}
    </Box>
  )
}
