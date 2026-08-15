import { Box, Typography } from "@mui/material"
import { DynamicAuroraBackground } from "../aurora/dynamic-aurora-background.jsx"
import { DynamicParticles } from "../aurora/dynamic-particles.jsx"
import { DynamicGlassPanel } from "../aurora/dynamic-glass-panel.jsx"
import { useTheme } from "../../hooks/use-theme"

export function AuthLayout({ eyebrow, title, children, footer }) {
  const { theme } = useTheme()

  return (
    <Box
      sx={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 3,
      }}
    >
      <DynamicAuroraBackground />
      <DynamicParticles />

      <DynamicGlassPanel
        variant="default"
        sx={{ width: 420, maxWidth: "100%", p: 4, boxShadow: `0 8px 40px rgba(0, 0, 0, 0.5)` }}
      >
        {eyebrow && (
          <Typography
            variant="overline"
            display="block"
            sx={{ color: theme.AURORA_PRIMARY, fontWeight: 600, letterSpacing: "0.15em" }}
          >
            {eyebrow}
          </Typography>
        )}

        <Typography
          variant="h5"
          gutterBottom
          sx={{ color: theme.TEXT_PRIMARY, fontWeight: 600, mb: 3 }}
        >
          {title}
        </Typography>

        {children}

        {footer && (
          <Box sx={{ mt: 3, textAlign: "center" }}>
            <Typography variant="subtitle2" sx={{ color: theme.TEXT_SECONDARY }}>
              {footer}
            </Typography>
          </Box>
        )}
      </DynamicGlassPanel>
    </Box>
  )
}
