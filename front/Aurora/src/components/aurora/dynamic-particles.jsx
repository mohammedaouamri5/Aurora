"use client"

import { Box } from "@mui/material"
import { useEffect, useState } from "react"
import { useTheme } from "../../hooks/use-theme"

export function DynamicParticles() {
  const [particles, setParticles] = useState([])
  const { theme } = useTheme()

  useEffect(() => {
    // Generate particles with theme colors
    const newParticles = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 0.5,
      duration: Math.random() * 25 + 20,
      delay: Math.random() * 15,
      color: [
        `${theme.AURORA_PRIMARY}66`,
        `${theme.AURORA_SECONDARY}55`,
        `${theme.AURORA_ACCENT}44`,
        `${theme.AURORA_RARE}33`,
      ][Math.floor(Math.random() * 4)],
    }))
    setParticles(newParticles)
  }, [theme])

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

