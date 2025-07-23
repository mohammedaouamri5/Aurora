"use client"

import { Box } from "@mui/material"

export function MinimalAuroraBackground() {
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
          radial-gradient(ellipse 100% 50% at 50% -10%, rgba(59, 130, 246, 0.12), transparent 70%),
          radial-gradient(ellipse 80% 40% at 20% 20%, rgba(139, 92, 246, 0.1), transparent 60%),
          radial-gradient(ellipse 90% 30% at 80% 30%, rgba(6, 182, 212, 0.08), transparent 65%),
          radial-gradient(ellipse 70% 25% at 60% 70%, rgba(236, 72, 153, 0.06), transparent 50%),
          linear-gradient(180deg, #0f172a 0%, #1e293b 30%, #0f172a 70%, #020617 100%)
        `,
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: `
            radial-gradient(ellipse 120% 30% at 30% 10%, rgba(59, 130, 246, 0.15), transparent 60%),
            radial-gradient(ellipse 80% 25% at 70% 25%, rgba(139, 92, 246, 0.12), transparent 50%),
            radial-gradient(ellipse 100% 20% at 10% 80%, rgba(6, 182, 212, 0.1), transparent 55%)
          `,
          animation: "aurora-gentle 35s ease-in-out infinite alternate",
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
            radial-gradient(ellipse 90% 20% at 80% 15%, rgba(236, 72, 153, 0.08), transparent 45%),
            radial-gradient(ellipse 70% 15% at 40% 85%, rgba(6, 182, 212, 0.1), transparent 40%),
            radial-gradient(ellipse 60% 10% at 20% 50%, rgba(59, 130, 246, 0.06), transparent 35%)
          `,
          animation: "aurora-drift 40s ease-in-out infinite alternate-reverse",
          mixBlendMode: "screen",
        },
        "@keyframes aurora-gentle": {
          "0%": {
            transform: "translateY(0px) scaleX(1) scaleY(1)",
            opacity: 0.5,
          },
          "50%": {
            transform: "translateY(-10px) scaleX(1.02) scaleY(0.98)",
            opacity: 0.7,
          },
          "100%": {
            transform: "translateY(-5px) scaleX(1) scaleY(1)",
            opacity: 0.6,
          },
        },
        "@keyframes aurora-drift": {
          "0%": {
            transform: "translateX(0px) translateY(0px)",
            opacity: 0.4,
          },
          "50%": {
            transform: "translateX(10px) translateY(-8px)",
            opacity: 0.6,
          },
          "100%": {
            transform: "translateX(3px) translateY(-3px)",
            opacity: 0.5,
          },
        },
      }}
    />
  )
}
