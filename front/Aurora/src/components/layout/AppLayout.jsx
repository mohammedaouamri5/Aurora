import { Box } from "@mui/material"
import { Outlet } from "react-router-dom"
import { TopBar } from "../top-bar/top-bar.jsx"
import { DynamicAuroraBackground } from "../aurora/dynamic-aurora-background.jsx"
import { DynamicParticles } from "../aurora/dynamic-particles.jsx"
import { LayoutProvider, useLayout } from "../../hooks/use-layout.jsx"

function AppLayoutInner() {
  const { sidebarOpen, toggleSidebar } = useLayout()

  return (
    <Box sx={{ position: "relative", height: "100vh", overflow: "hidden" }}>
      <DynamicAuroraBackground />
      <DynamicParticles />
      <TopBar sidebarOpen={sidebarOpen} onToggleSidebar={toggleSidebar} />
      <Box
        component="main"
        sx={{
          position: "relative",
          height: "100%",
          pt: "64px",
          overflow: "auto",
        }}
      >
        <Outlet />
      </Box>
    </Box>
  )
}

export function AppLayout() {
  return (
    <LayoutProvider>
      <AppLayoutInner />
    </LayoutProvider>
  )
}
