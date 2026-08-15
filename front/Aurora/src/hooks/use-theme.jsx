"use client"

import { useState, useEffect, createContext, useContext, useMemo } from "react"
import { ThemeProvider as MuiThemeProvider, createTheme } from "@mui/material"
import { THEMES } from "../constants/themes.js"

const ThemeContext = createContext()

const STORAGE_KEY = "aurora-theme"

export function ThemeProvider({ children }) {
  const [currentTheme, setCurrentTheme] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) || "BLUE"
    } catch {
      return "BLUE"
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, currentTheme)
    } catch {
      // ignore storage errors
    }
  }, [currentTheme])

  const theme = THEMES[currentTheme] || THEMES.BLUE

  const switchTheme = (themeName) => {
    setCurrentTheme(themeName)
  }

  const muiTheme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: "dark",
          primary: { main: theme.AURORA_PRIMARY },
          secondary: { main: theme.AURORA_SECONDARY },
          background: { default: "#000000", paper: theme.SIDEBAR_BG },
          text: { primary: theme.TEXT_PRIMARY, secondary: theme.TEXT_SECONDARY },
        },
        shape: { borderRadius: 10 },
        components: {
          MuiButton: {
            styleOverrides: {
              root: { textTransform: "none" },
            },
          },
        },
      }),
    [theme]
  )

  return (
    <ThemeContext.Provider
      value={{
        theme,
        currentTheme,
        switchTheme,
        availableThemes: Object.keys(THEMES),
      }}
    >
      <MuiThemeProvider theme={muiTheme}>{children}</MuiThemeProvider>
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
