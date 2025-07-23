import { Box, Typography, IconButton } from "@mui/material"
import { MoreVert as MoreVertIcon } from "@mui/icons-material"

export function ChatHeader({ chatTitle }) {
  if (!chatTitle) return null

  return (
    <Box
      sx={{
        borderBottom: "1px solid #e0e0e0",
        p: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        bgcolor: "white",
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 500, color: "#2d2d2d" }}>
        {chatTitle}
      </Typography>
      <IconButton size="small" sx={{ color: "#666" }}>
        <MoreVertIcon />
      </IconButton>
    </Box>
  )
}
