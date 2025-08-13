
import { Box, Typography, Avatar, IconButton, Tooltip } from "@mui/material"
import { Person as PersonIcon, SmartToy as BotIcon, VolumeUp as VolumeUpIcon } from "@mui/icons-material"
import { DynamicGlassPanel } from "../aurora/dynamic-glass-panel.jsx"
import { MessageFormatter } from "./message-formatter.jsx"
import { useTheme } from "../../hooks/use-theme"
import { MessageBubble } from "./message-bubble.jsx"

export function MessageContainer({ messages, onAddMessage }) {
  const { theme } = useTheme()


  return (
    <Box
      sx={{
        flex: 1,
        overflow: "auto",
        display: "flex",
        flexDirection: "column",
        "&::-webkit-scrollbar": {
          width: "8px",
        },
        "&::-webkit-scrollbar-track": {
          bgcolor: "rgba(15, 23, 42, 0.3)",
        },
        "&::-webkit-scrollbar-thumb": {
          bgcolor: "rgba(148, 163, 184, 0.3)",
          borderRadius: "4px",
          "&:hover": {
            bgcolor: "rgba(148, 163, 184, 0.5)",
          },
        },
      }}
    >
      {messages && messages.length > 0 ? (
        <Box sx={{ p: 4, maxWidth: "800px", mx: "auto", width: "100%" }}>
          {messages.map((message, index) => (

            <MessageBubble key={message.createdAt || index} message={message} />
          ))}
        </Box>
      ) : (
        <EmptyState />
      )}
    </Box>
  )
}


function EmptyState() {
  const { theme } = useTheme()

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        p: 4,
        textAlign: "center",
      }}
    >
      <Box
        sx={{
          width: 80,
          height: 80,
          borderRadius: "50%",
          bgcolor: `${theme.AURORA_PRIMARY}20`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: 3,
          boxShadow: `0 0 30px ${theme.AURORA_PRIMARY}40`,
          border: `2px solid ${theme.AURORA_PRIMARY}40`,
          animation: "gentle-pulse 4s ease-in-out infinite",
          "@keyframes gentle-pulse": {
            "0%, 100%": {
              boxShadow: `0 0 30px ${theme.AURORA_PRIMARY}40`,
            },
            "50%": {
              boxShadow: `0 0 40px ${theme.AURORA_PRIMARY}60`,
            },
          },
        }}
      >
        <BotIcon
          sx={{
            fontSize: 40,
            color: theme.AURORA_PRIMARY,
          }}
        />
      </Box>
      <Typography
        variant="h5"
        sx={{
          color: theme.TEXT_PRIMARY,
          mb: 2,
          fontWeight: 500,
          textShadow: `0 0 15px ${theme.TEXT_PRIMARY}40`,
        }}
      >
        How can I help you today?
      </Typography>
      <Typography
        variant="body1"
        sx={{
          color: theme.TEXT_SECONDARY_CHAT,
          maxWidth: 400,
          opacity: 0.9,
        }}
      >
        Start a conversation by typing a message below, or select a previous chat from the sidebar.
      </Typography>
    </Box>
  )
}
