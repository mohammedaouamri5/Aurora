import { Box, ListItemButton, ListItemText, Avatar } from "@mui/material"
import { Person as PersonIcon } from "@mui/icons-material"
import { COLORS } from "../../constants/sidebar.js"

export function SidebarFooter() {
  return (
    <Box sx={{ borderTop: `1px solid ${COLORS.BORDER_COLOR}`, p: 2 }}>
      <ListItemButton
        sx={{
          borderRadius: 1,
          color: "white",
          "&:hover": {
            bgcolor: COLORS.SIDEBAR_HOVER,
          },
        }}
      >
        <Avatar sx={{ width: 24, height: 24, mr: 2, bgcolor: COLORS.PRIMARY_GREEN }}>
          <PersonIcon sx={{ fontSize: 16 }} />
        </Avatar>
        <ListItemText
          primary="John Doe"
          sx={{
            "& .MuiListItemText-primary": {
              fontSize: "14px",
              fontWeight: 400,
            },
          }}
        />
      </ListItemButton>
    </Box>
  )
}
