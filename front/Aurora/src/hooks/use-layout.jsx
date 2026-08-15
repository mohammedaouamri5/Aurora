import { createContext, useContext, useState } from "react"

const LayoutContext = createContext()

export function LayoutProvider({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const toggleSidebar = () => setSidebarOpen((v) => !v)

  return (
    <LayoutContext.Provider value={{ sidebarOpen, toggleSidebar }}>
      {children}
    </LayoutContext.Provider>
  )
}

export function useLayout() {
  const ctx = useContext(LayoutContext)
  if (!ctx) {
    throw new Error("useLayout must be used within a LayoutProvider")
  }
  return ctx
}
