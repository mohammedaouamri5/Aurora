"use client"

import { Box } from "@mui/material"
import { COLORS } from "../../constants/sidebar.js"

export function GlassPanel({ children, sx = {}, blur = true, ...props }) {
  return (
    <Box
      sx={{
        background: blur
          ? `linear-gradient(135deg, 
              rgba(15, 23, 42, 0.8) 0%, 
              rgba(30, 41, 59, 0.6) 50%, 
              rgba(15, 23, 42, 0.9) 100%)`
          : "rgba(15, 23, 42, 0.95)",
        backdropFilter: blur ? "blur(20px)" : "none",
        border: `1px solid ${COLORS.BORDER_COLOR}`,
        borderRadius: 2,
        boxShadow: `
          0 8px 32px rgba(0, 0, 0, 0.3),
          inset 0 1px 0 rgba(255, 255, 255, 0.1)
        `,
        ...sx,
      }}
      {...props}
    >
      {children}
    </Box>
  )
}
