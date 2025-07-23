"use client"

import { AppBar, Toolbar, Typography, Box, IconButton, Avatar } from "@mui/material"
import {
  Menu as MenuIcon,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  Help as HelpIcon,
} from "@mui/icons-material"
import { DynamicGlassPanel } from "../aurora/dynamic-glass-panel.jsx"
import { ThemeSelector } from "../theme/theme-selector.jsx"
import { useTheme } from "../../hooks/use-theme"

export function TopBar({ sidebarOpen, onToggleSidebar }) {
  const { theme } = useTheme()

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: 1400,
        bgcolor: "transparent",
        boxShadow: "none",
        transition: "none",
      }}
    >
      <DynamicGlassPanel
        variant="sidebar"
        sx={{
          borderRadius: 0,
          border: "none",
          borderBottom: `1px solid ${theme.BORDER_COLOR}`,
        }}
      >
        <Toolbar sx={{ minHeight: "64px !important" }}>
          <Box sx={{ display: "flex", alignItems: "center", flex: 1 }}>
            <IconButton
              onClick={onToggleSidebar}
              sx={{
                mr: 2,
                color: theme.TEXT_PRIMARY,
                "&:hover": {
                  bgcolor: `${theme.AURORA_PRIMARY}20`,
                  boxShadow: `0 0 15px ${theme.AURORA_PRIMARY}40`,
                },
              }}
            >
              <MenuIcon />
            </IconButton>

            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                color: theme.TEXT_PRIMARY,
                fontSize: "18px",
                textShadow: `0 0 15px ${theme.TEXT_PRIMARY}40`,
              }}
            >
              Aurora Chat
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <ThemeSelector />

            {[HelpIcon, NotificationsIcon, SettingsIcon].map((Icon, index) => (
              <IconButton
                key={index}
                sx={{
                  color: theme.TEXT_SECONDARY,
                  "&:hover": {
                    bgcolor: `${theme.AURORA_PRIMARY}20`,
                    boxShadow: `0 0 10px ${theme.AURORA_PRIMARY}40`,
                    color: theme.AURORA_PRIMARY,
                  },
                }}
              >
                <Icon />
              </IconButton>
            ))}

            <IconButton sx={{ ml: 1 }}>
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: theme.AURORA_PRIMARY,
                  fontSize: "14px",
                  boxShadow: `0 0 15px ${theme.AURORA_PRIMARY}50`,
                  border: `1px solid ${theme.AURORA_PRIMARY}40`,
                }}
              >
                JD
              </Avatar>
            </IconButton>
          </Box>
        </Toolbar>
      </DynamicGlassPanel>
    </AppBar>
  )
}
