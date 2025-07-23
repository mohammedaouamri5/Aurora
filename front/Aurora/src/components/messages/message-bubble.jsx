import { Box, Typography, Paper } from "@mui/material"
import { Person as PersonIcon, SmartToy as BotIcon } from "@mui/icons-material"
import { COLORS } from "../../constants/sidebar.js"

export function MessageBubble({ message }) {
  const isUser = message.type === "user"

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
        mb: 3,
        alignItems: "flex-start",
        gap: 2,
      }}
    >
      {!isUser && (
        <Box
          sx={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            bgcolor: COLORS.PRIMARY_GREEN,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <BotIcon sx={{ fontSize: 18, color: "white" }} />
        </Box>
      )}

      <Paper
        elevation={1}
        sx={{
          p: 2,
          maxWidth: "70%",
          bgcolor: isUser ? COLORS.PRIMARY_GREEN : "white",
          color: isUser ? "white" : "#2d2d2d",
          borderRadius: 2,
          border: isUser ? "none" : "1px solid #e0e0e0",
        }}
      >
        <Typography
          variant="body1"
          sx={{
            whiteSpace: "pre-wrap",
            lineHeight: 1.5,
            "& code": {
              bgcolor: isUser ? "rgba(255,255,255,0.2)" : "#f5f5f5",
              padding: "2px 4px",
              borderRadius: "4px",
              fontFamily: "monospace",
              fontSize: "0.9em",
            },
          }}
        >
          {message.content}
        </Typography>
        <Typography
          variant="caption"
          sx={{
            display: "block",
            mt: 1,
            opacity: 0.7,
            fontSize: "11px",
          }}
        >
          {message.timestamp}
        </Typography>
      </Paper>

      {isUser && (
        <Box
          sx={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            bgcolor: "#666",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <PersonIcon sx={{ fontSize: 18, color: "white" }} />
        </Box>
      )}
    </Box>
  )
}
