import { Box, Typography } from "@mui/material"
import { MessageInput } from "./input/message-input.jsx"
import { MessageContainer } from "./messages/message-container.jsx"
import { useTheme } from "./../hooks/use-theme"

export function MainContent({
  isRecording,
  message,
  onMessageChange,
  onStartRecording,
  onStopRecording,
  onSendMessage,
  messages,
  chatTitle,
  isPending,
}) {
  const { theme } = useTheme()

  const handleToggleRecording = () => {
    if (isRecording) {
      onStopRecording()
    } else {
      onStartRecording()
    }
  }

  return (
    <Box
      sx={{
        flex: 1,
        minHeight: 0,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {chatTitle && (
        <Box
          sx={{
            px: 3,
            py: 2,
            borderBottom: `1px solid ${theme.BORDER_COLOR}`,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              color: theme.TEXT_PRIMARY,
              fontWeight: 600,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {chatTitle}
          </Typography>
        </Box>
      )}

      {/* Messages Container */}
      <MessageContainer messages={messages} isPending={isPending} />

      {/* Input Area */}
      <Box
        sx={{
          p: 3,
          borderTop: `1px solid ${theme.BORDER_COLOR}`,
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
