import { Box, Button } from "@mui/material"
import { Add as AddIcon } from "@mui/icons-material"
import { useTheme } from "../../hooks/use-theme"

export function SidebarHeader({ onNewChat }) {
  const { theme } = useTheme()

  return (
    <Box sx={{ p: 2 }}>
      <Button
        fullWidth
        variant="outlined"
        onClick={onNewChat}
        startIcon={<AddIcon />}
        sx={{
          color: theme.TEXT_PRIMARY,
          borderColor: theme.BORDER_COLOR,
          textTransform: "none",
          justifyContent: "flex-start",
          borderRadius: 1.5,
          "&:hover": {
            bgcolor: theme.SIDEBAR_HOVER,
            borderColor: theme.AURORA_PRIMARY,
          },
        }}
      >
        New chat
      </Button>
    </Box>
  )
}
