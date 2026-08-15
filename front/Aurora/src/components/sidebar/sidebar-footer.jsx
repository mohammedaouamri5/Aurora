import { Box, ListItemButton, ListItemText, Avatar, Typography } from "@mui/material"
import { Person as PersonIcon } from "@mui/icons-material"
import { useTheme } from "../../hooks/use-theme"
import { useSelector } from "react-redux"

export function SidebarFooter() {
  const { theme } = useTheme()
  const user = useSelector((state) => state.auth.user)

  const displayName = user?.Name || user?.name || "Aurora User"

  return (
    <Box sx={{ borderTop: `1px solid ${theme.BORDER_COLOR}`, p: 2 }}>
      <ListItemButton
        sx={{
          borderRadius: 1,
          color: theme.TEXT_PRIMARY,
          "&:hover": {
            bgcolor: theme.SIDEBAR_HOVER,
          },
        }}
      >
        <Avatar
          sx={{
            width: 24,
            height: 24,
            mr: 2,
            bgcolor: theme.AURORA_PRIMARY,
            fontSize: "12px",
          }}
        >
          <PersonIcon sx={{ fontSize: 14 }} />
        </Avatar>
        <ListItemText
          primary={
            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: 400,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {displayName}
            </Typography>
          }
        />
      </ListItemButton>
    </Box>
  )
}
