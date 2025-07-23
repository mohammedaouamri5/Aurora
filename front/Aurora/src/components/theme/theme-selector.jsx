"use client"

import { Box, IconButton, Menu, MenuItem, Typography, Tooltip } from "@mui/material"
import { Palette as PaletteIcon, Check as CheckIcon } from "@mui/icons-material"
import { useState } from "react"
import { useTheme } from "../../hooks/use-theme"
import { THEMES } from "../../constants/themes.js"

export function ThemeSelector() {
  const { currentTheme, switchTheme, theme } = useTheme()
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleThemeSelect = (themeName) => {
    switchTheme(themeName)
    handleClose()
  }

  const getThemePreview = (themeName) => {
    const themeColors = THEMES[themeName]
    return (
      <Box
        sx={{
          width: 20,
          height: 20,
          borderRadius: "50%",
          background: `linear-gradient(45deg, ${themeColors.AURORA_PRIMARY}, ${themeColors.AURORA_SECONDARY})`,
          border: `2px solid ${themeColors.BORDER_COLOR}`,
          mr: 2,
          flexShrink: 0,
        }}
      />
    )
  }

  return (
    <>
      <Tooltip title="Change Theme" arrow>
        <IconButton
          onClick={handleClick}
          sx={{
            color: theme.TEXT_SECONDARY,
            "&:hover": {
              bgcolor: `rgba(${theme.AURORA_PRIMARY.replace("#", "")
                .match(/.{2}/g)
                .map((hex) => Number.parseInt(hex, 16))
                .join(", ")}, 0.1)`,
              boxShadow: `0 0 10px ${theme.AURORA_PRIMARY}40`,
              color: theme.AURORA_PRIMARY,
            },
          }}
        >
          <PaletteIcon />
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            bgcolor: theme.SIDEBAR_BG,
            border: `1px solid ${theme.BORDER_COLOR}`,
            borderRadius: 2,
            backdropFilter: "blur(20px)",
            boxShadow: `0 8px 32px rgba(0, 0, 0, 0.4)`,
            minWidth: 200,
          },
        }}
      >
        <Box sx={{ p: 1 }}>
          <Typography
            variant="caption"
            sx={{
              color: theme.TEXT_SECONDARY,
              px: 2,
              py: 1,
              display: "block",
              fontSize: "11px",
              fontWeight: 600,
              textTransform: "uppercase",
            }}
          >
            Choose Theme
          </Typography>

          {Object.entries(THEMES).map(([key, themeData]) => (
            <MenuItem
              key={key}
              onClick={() => handleThemeSelect(key)}
              sx={{
                borderRadius: 1,
                mx: 1,
                my: 0.5,
                color: theme.TEXT_PRIMARY,
                "&:hover": {
                  bgcolor: theme.SIDEBAR_HOVER,
                },
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                {getThemePreview(key)}
                <Typography variant="body2" sx={{ fontSize: "14px" }}>
                  {themeData.name}
                </Typography>
              </Box>

              {currentTheme === key && (
                <CheckIcon
                  sx={{
                    fontSize: 16,
                    color: theme.AURORA_PRIMARY,
                    ml: 1,
                  }}
                />
              )}
            </MenuItem>
          ))}
        </Box>
      </Menu>
    </>
  )
}
