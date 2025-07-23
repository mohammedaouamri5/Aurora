import { Box, Button } from "@mui/material"
import { Add as AddIcon } from "@mui/icons-material"
import { COLORS } from "../../constants/sidebar.js"

export function SidebarHeader() {
  return (
    <Box sx={{ p: 2 }}>
      <Button
        fullWidth
        variant="outlined"
        startIcon={<AddIcon />}
        sx={{
          color: "white",
          borderColor: COLORS.BORDER_COLOR,
          textTransform: "none",
          justifyContent: "flex-start",
          "&:hover": {
            bgcolor: COLORS.SIDEBAR_HOVER,
            borderColor: COLORS.BORDER_COLOR,
          },
        }}
      >
        New chat
      </Button>
    </Box>
  )
}
