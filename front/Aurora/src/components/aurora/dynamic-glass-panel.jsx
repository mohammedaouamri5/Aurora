"use client"

import { Box } from "@mui/material"
import { useTheme } from "../../hooks/use-theme"

export function DynamicGlassPanel({ children, sx = {}, variant = "default", glow = false, ...props }) {
  const { theme } = useTheme()

  const getVariantStyles = () => {
    switch (variant) {
      case "message-user":
        return {
          background: `linear-gradient(135deg, 
            ${theme.AURORA_PRIMARY}10 0%, 
            ${theme.SIDEBAR_BG} 40%, 
            ${theme.AURORA_SECONDARY}08 100%)`,
          border: `1px solid ${theme.BORDER_COLOR}`,
          boxShadow: glow
            ? `0 0 20px ${theme.AURORA_PRIMARY}40, inset 0 1px 0 rgba(255, 255, 255, 0.05)`
            : `0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.05)`,
        }
      case "message-assistant":
        return {
          background: `linear-gradient(135deg, 
            ${theme.AURORA_SECONDARY}10 0%, 
            ${theme.MESSAGE_ASSISTANT_BG} 40%, 
            ${theme.AURORA_PRIMARY}08 100%)`,
          border: `1px solid ${theme.BORDER_COLOR}`,
          boxShadow: glow
            ? `0 0 20px ${theme.AURORA_SECONDARY}30, inset 0 1px 0 rgba(255, 255, 255, 0.05)`
            : `0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.05)`,
        }
      case "sidebar":
        return {
          background: theme.SIDEBAR_BG,
          border: `1px solid ${theme.BORDER_COLOR}`,
          boxShadow: `0 0 30px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.05)`,
        }
      case "input":
        return {
          background: `linear-gradient(135deg, 
            ${theme.SIDEBAR_BG} 0%, 
            ${theme.SIDEBAR_HOVER} 50%, 
            ${theme.SIDEBAR_BG} 100%)`,
          border: `1px solid ${theme.BORDER_COLOR}`,
          boxShadow: `0 8px 32px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.05)`,
        }
      default:
        return {
          background: theme.SIDEBAR_BG,
          border: `1px solid ${theme.BORDER_COLOR}`,
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
