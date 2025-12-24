
import { AppBar, Toolbar, Typography, Box, IconButton, Tooltip, Button } from "@mui/material"
import { useTheme } from "../../hooks/use-theme"

export const ActionBar = ({ choices, SetSelected }) => {
  const { theme } = useTheme()

  return (
    <AppBar
      position="static" // so it fills the container width by default
      sx={{
        width: "100%",       // ensure full width
        bgcolor: "transparent",
        boxShadow: "none",
        transition: "none",
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "flex-start", gap: 2 }}>
        {choices.map((choice) => (
          <Tooltip key={choice.name} title={choice.name}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => SetSelected(choice.name)}
            >
              {choice.name}
            </Button>
          </Tooltip>
        ))}
      </Toolbar>
    </AppBar>
  )
}

