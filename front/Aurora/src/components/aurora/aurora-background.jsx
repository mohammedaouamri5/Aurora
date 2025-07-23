"use client"

import { Box } from "@mui/material"

export function AuroraBackground() {
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
          radial-gradient(ellipse 80% 80% at 50% -20%, rgba(139, 92, 246, 0.3), transparent),
          radial-gradient(ellipse 80% 80% at 80% 50%, rgba(59, 130, 246, 0.15), transparent),
          radial-gradient(ellipse 80% 80% at 40% 80%, rgba(16, 185, 129, 0.2), transparent),
          radial-gradient(ellipse 80% 80% at 0% 50%, rgba(236, 72, 153, 0.15), transparent),
          radial-gradient(ellipse 80% 80% at 100% 90%, rgba(6, 182, 212, 0.1), transparent),
          linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)
        `,
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: `
            radial-gradient(ellipse 60% 60% at 30% 30%, rgba(139, 92, 246, 0.4), transparent),
            radial-gradient(ellipse 60% 60% at 70% 70%, rgba(59, 130, 246, 0.3), transparent),
            radial-gradient(ellipse 60% 60% at 90% 10%, rgba(16, 185, 129, 0.3), transparent)
          `,
          animation: "aurora-move 20s ease-in-out infinite alternate",
        },
        "&::after": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: `
            radial-gradient(ellipse 40% 40% at 60% 80%, rgba(236, 72, 153, 0.3), transparent),
            radial-gradient(ellipse 40% 40% at 20% 60%, rgba(6, 182, 212, 0.2), transparent),
            radial-gradient(ellipse 40% 40% at 80% 20%, rgba(139, 92, 246, 0.2), transparent)
          `,
          animation: "aurora-move-reverse 25s ease-in-out infinite alternate",
        },
        "@keyframes aurora-move": {
          "0%": {
            transform: "translate(0px, 0px) rotate(0deg)",
            opacity: 0.8,
          },
          "33%": {
            transform: "translate(30px, -30px) rotate(120deg)",
            opacity: 0.9,
          },
          "66%": {
            transform: "translate(-20px, 20px) rotate(240deg)",
            opacity: 0.7,
          },
          "100%": {
            transform: "translate(0px, 0px) rotate(360deg)",
            opacity: 0.8,
          },
        },
        "@keyframes aurora-move-reverse": {
          "0%": {
            transform: "translate(0px, 0px) rotate(0deg)",
            opacity: 0.6,
          },
          "50%": {
            transform: "translate(-40px, 40px) rotate(180deg)",
            opacity: 0.8,
          },
          "100%": {
            transform: "translate(0px, 0px) rotate(360deg)",
            opacity: 0.6,
          },
        },
      }}
    />
  )
}
