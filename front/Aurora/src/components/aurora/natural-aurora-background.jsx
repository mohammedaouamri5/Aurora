"use client"

import { Box } from "@mui/material"

export function NaturalAuroraBackground() {
  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: -1,
        background: `
          radial-gradient(ellipse 100% 60% at 50% -10%, rgba(34, 197, 94, 0.4), transparent 70%),
          radial-gradient(ellipse 80% 40% at 20% 20%, rgba(74, 222, 128, 0.3), transparent 60%),
          radial-gradient(ellipse 90% 50% at 80% 30%, rgba(22, 163, 74, 0.35), transparent 65%),
          radial-gradient(ellipse 70% 30% at 60% 60%, rgba(6, 214, 160, 0.25), transparent 50%),
          radial-gradient(ellipse 60% 25% at 90% 80%, rgba(132, 204, 22, 0.2), transparent 45%),
          linear-gradient(180deg, #020617 0%, #0c1810 30%, #081408 70%, #020617 100%)
        `,
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: `
            radial-gradient(ellipse 120% 40% at 30% 10%, rgba(34, 197, 94, 0.6), transparent 60%),
            radial-gradient(ellipse 80% 30% at 70% 25%, rgba(74, 222, 128, 0.4), transparent 50%),
            radial-gradient(ellipse 100% 35% at 10% 70%, rgba(22, 163, 74, 0.5), transparent 55%)
          `,
          animation: "aurora-dance 25s ease-in-out infinite alternate",
          mixBlendMode: "screen",
        },
        "&::after": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: `
            radial-gradient(ellipse 90% 25% at 80% 15%, rgba(6, 214, 160, 0.4), transparent 45%),
            radial-gradient(ellipse 70% 20% at 40% 80%, rgba(132, 204, 22, 0.3), transparent 40%),
            radial-gradient(ellipse 60% 15% at 20% 50%, rgba(14, 165, 233, 0.2), transparent 35%)
          `,
          animation: "aurora-shimmer 30s ease-in-out infinite alternate-reverse",
          mixBlendMode: "screen",
        },
        "@keyframes aurora-dance": {
          "0%": {
            transform: "translateY(0px) scaleX(1) scaleY(1)",
            opacity: 0.7,
          },
          "25%": {
            transform: "translateY(-20px) scaleX(1.1) scaleY(0.9)",
            opacity: 0.9,
          },
          "50%": {
            transform: "translateY(-10px) scaleX(0.9) scaleY(1.1)",
            opacity: 0.8,
          },
          "75%": {
            transform: "translateY(-30px) scaleX(1.05) scaleY(0.95)",
            opacity: 0.85,
          },
          "100%": {
            transform: "translateY(-15px) scaleX(1) scaleY(1)",
            opacity: 0.75,
          },
        },
        "@keyframes aurora-shimmer": {
          "0%": {
            transform: "translateX(0px) translateY(0px) rotate(0deg)",
            opacity: 0.6,
          },
          "33%": {
            transform: "translateX(20px) translateY(-15px) rotate(1deg)",
            opacity: 0.8,
          },
          "66%": {
            transform: "translateX(-15px) translateY(-25px) rotate(-1deg)",
            opacity: 0.7,
          },
          "100%": {
            transform: "translateX(10px) translateY(-10px) rotate(0.5deg)",
            opacity: 0.65,
          },
        },
      }}
    />
  )
}
