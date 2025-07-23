import { Box } from "@mui/material"
import { MessageInput } from "./input/message-input.jsx"
import { MessageContainer } from "./messages/message-container.jsx"
import { COLORS } from "../constants/sidebar.js"

export function MainContent({
  sidebarOpen,
  isRecording,
  message,
  onMessageChange,
  onStartRecording,
  onStopRecording,
  onSendMessage,
  selectedChat,
  messages,
  chatTitle,
  onAddMessage,
}) {
  const handleToggleRecording = () => {
    if (isRecording) {
      onStopRecording()
    } else {
      onStartRecording()
    }
  }

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        transition: "margin-left 0.3s ease",
        display: "flex",
        flexDirection: "column",
        pt: "64px", // Account for top bar
        height: "100vh",
      }}
    >
      {/* Messages Container */}
      <MessageContainer messages={messages} onAddMessage={onAddMessage} />

      {/* Input Area */}
      <Box
        sx={{
          p: 3,
          borderTop: `1px solid ${COLORS.BORDER_COLOR}`,
        }}
      >
        <Box sx={{ maxWidth: 800, mx: "auto" }}>
          <MessageInput
            message={message}
            onMessageChange={onMessageChange}
            onSendMessage={onSendMessage}
            isRecording={isRecording}
            onToggleRecording={handleToggleRecording}
          />
        </Box>
      </Box>
    </Box>
  )
}
