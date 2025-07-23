import { Box, Typography } from "@mui/material"
import { MessageBubble } from "./message-bubble.jsx"

export function MessageList({ messages, chatTitle }) {
  if (!messages || messages.length === 0) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          p: 3,
        }}
      >
        <Typography variant="h5" sx={{ color: "#2d2d2d", mb: 2, textAlign: "center" }}>
          {chatTitle || "How can I help you today?"}
        </Typography>
        <Typography variant="body1" sx={{ color: "#666", textAlign: "center", maxWidth: 600 }}>
          Start a conversation by typing a message below.
        </Typography>
      </Box>
    )
  }

  return (
    <Box
      sx={{
        flex: 1,
        overflow: "auto",
        p: 3,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}
    </Box>
  )
}
