"use client"

import { useState, createContext, useContext } from "react"
import { THEMES } from "../constants/themes.js"

const ThemeContext = createContext()

export function ThemeProvider({ children }) {
  const [currentTheme, setCurrentTheme] = useState("BLUE")

  const theme = THEMES[currentTheme]

  const switchTheme = (themeName) => {
    setCurrentTheme(themeName)
  }

  return (
    <ThemeContext.Provider value={{ theme, currentTheme, switchTheme, availableThemes: Object.keys(THEMES) }}>
      {children}
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
