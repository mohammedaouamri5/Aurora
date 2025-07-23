"use client"

import { Box } from "@mui/material"
import { COLORS } from "../../constants/sidebar.js"

export function EnhancedGlassPanel({ children, sx = {}, variant = "default", glow = false, ...props }) {
  const getVariantStyles = () => {
    switch (variant) {
      case "message-user":
        return {
          background: `linear-gradient(135deg, 
            rgba(34, 197, 94, 0.12) 0%, 
            rgba(8, 20, 15, 0.9) 30%, 
            rgba(22, 163, 74, 0.08) 100%)`,
          border: `1px solid rgba(34, 197, 94, 0.25)`,
          boxShadow: glow
            ? `0 0 30px rgba(34, 197, 94, 0.2), inset 0 1px 0 rgba(34, 197, 94, 0.1)`
            : `0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(34, 197, 94, 0.1)`,
        }
      case "message-assistant":
        return {
          background: `linear-gradient(135deg, 
            rgba(6, 214, 160, 0.1) 0%, 
            rgba(8, 20, 15, 0.95) 40%, 
            rgba(74, 222, 128, 0.05) 100%)`,
          border: `1px solid rgba(6, 214, 160, 0.2)`,
          boxShadow: glow
            ? `0 0 25px rgba(6, 214, 160, 0.15), inset 0 1px 0 rgba(6, 214, 160, 0.1)`
            : `0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(6, 214, 160, 0.1)`,
        }
      case "sidebar":
        return {
          background: `linear-gradient(180deg, 
            rgba(8, 20, 15, 0.98) 0%, 
            rgba(15, 35, 25, 0.95) 50%, 
            rgba(8, 20, 15, 0.98) 100%)`,
          border: `1px solid ${COLORS.BORDER_COLOR}`,
          boxShadow: `0 0 40px rgba(34, 197, 94, 0.1), inset 0 1px 0 rgba(34, 197, 94, 0.05)`,
        }
      case "input":
        return {
          background: `linear-gradient(135deg, 
            rgba(8, 20, 15, 0.95) 0%, 
            rgba(15, 35, 25, 0.9) 50%, 
            rgba(8, 20, 15, 0.95) 100%)`,
          border: `1px solid ${COLORS.BORDER_COLOR}`,
          boxShadow: `0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(34, 197, 94, 0.1)`,
        }
      default:
        return {
          background: `linear-gradient(135deg, 
            rgba(8, 20, 15, 0.9) 0%, 
            rgba(15, 35, 25, 0.8) 50%, 
            rgba(8, 20, 15, 0.9) 100%)`,
          border: `1px solid ${COLORS.BORDER_COLOR}`,
          boxShadow: `0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(34, 197, 94, 0.1)`,
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
