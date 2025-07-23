"use client"

import { Box } from "@mui/material"
import { COLORS } from "../../constants/sidebar.js"

export function BalancedGlassPanel({ children, sx = {}, variant = "default", glow = false, ...props }) {
  const getVariantStyles = () => {
    switch (variant) {
      case "message-user":
        return {
          background: `linear-gradient(135deg, 
            rgba(59, 130, 246, 0.06) 0%, 
            rgba(15, 23, 42, 0.9) 40%, 
            rgba(139, 92, 246, 0.04) 100%)`,
          border: `1px solid rgba(148, 163, 184, 0.2)`,
          boxShadow: glow
            ? `0 0 20px rgba(59, 130, 246, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.05)`
            : `0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.05)`,
        }
      case "message-assistant":
        return {
          background: `linear-gradient(135deg, 
            rgba(139, 92, 246, 0.06) 0%, 
            rgba(15, 23, 42, 0.95) 40%, 
            rgba(59, 130, 246, 0.04) 100%)`,
          border: `1px solid rgba(148, 163, 184, 0.2)`,
          boxShadow: glow
            ? `0 0 20px rgba(139, 92, 246, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.05)`
            : `0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.05)`,
        }
      case "sidebar":
        return {
          background: `linear-gradient(180deg, 
            rgba(15, 23, 42, 0.98) 0%, 
            rgba(30, 41, 59, 0.95) 50%, 
            rgba(15, 23, 42, 0.98) 100%)`,
          border: `1px solid ${COLORS.BORDER_COLOR}`,
          boxShadow: `0 0 30px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.05)`,
        }
      case "input":
        return {
          background: `linear-gradient(135deg, 
            rgba(15, 23, 42, 0.95) 0%, 
            rgba(30, 41, 59, 0.9) 50%, 
            rgba(15, 23, 42, 0.95) 100%)`,
          border: `1px solid ${COLORS.BORDER_COLOR}`,
          boxShadow: `0 8px 32px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.05)`,
        }
      default:
        return {
          background: `linear-gradient(135deg, 
            rgba(15, 23, 42, 0.9) 0%, 
            rgba(30, 41, 59, 0.8) 50%, 
            rgba(15, 23, 42, 0.9) 100%)`,
          border: `1px solid ${COLORS.BORDER_COLOR}`,
          boxShadow: `0 8px 32px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.05)`,
        }
    }
  }

  return (
    <Box
      sx={{
        backdropFilter: "blur(20px)",
        borderRadius: 2,
        ...getVariantStyles(),
        ...sx,
      }}
      {...props}
    >
      {children}
    </Box>
  )
}
