"use client"

import { Box, TextField, InputAdornment } from "@mui/material"
import { RecordingButton } from "./recording-button.jsx"
import { SendButton } from "./send-button.jsx"
import { RecordingStatus } from "./recording-status.jsx"
import { DynamicGlassPanel } from "../aurora/dynamic-glass-panel.jsx"
import { useTheme } from "../../hooks/use-theme"

export function MessageInput({ message, onMessageChange, onSendMessage, isRecording, onToggleRecording }) {
  const { theme } = useTheme()

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      onSendMessage()
    }
  }

  return (
    <Box sx={{ position: "relative" }}>
      <DynamicGlassPanel
        variant="input"
        sx={{
          p: 0,
          transition: "all 0.3s ease",
          "&:hover": {
            border: `1px solid ${theme.AURORA_PRIMARY}40`,
            boxShadow: `0 0 20px ${theme.AURORA_PRIMARY}20`,
          },
          "&:focus-within": {
            border: `1px solid ${theme.AURORA_PRIMARY}`,
            boxShadow: `0 0 25px ${theme.AURORA_PRIMARY}40`,
          },
        }}
      >
        <TextField
          fullWidth
          multiline
          maxRows={6}
          placeholder="Message Aurora Chat..."
          variant="outlined"
          value={message}
          onChange={(e) => onMessageChange(e.target.value)}
          onKeyPress={handleKeyPress}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end" sx={{ alignSelf: "flex-end", pb: 1 }}>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <RecordingButton isRecording={isRecording} onToggleRecording={onToggleRecording} />
                  {message.trim() && <SendButton onSend={onSendMessage} />}
                </Box>
              </InputAdornment>
            ),
            sx: {
              color: theme.TEXT_PRIMARY,
              "& .MuiOutlinedInput-notchedOutline": {
                border: "none",
              },
            },
          }}
          sx={{
            "& .MuiInputBase-input": {
              color: theme.TEXT_PRIMARY,
            },
            "& .MuiInputBase-input::placeholder": {
              color: theme.TEXT_SECONDARY_CHAT,
              opacity: 0.7,
            },
          }}
        />
      </DynamicGlassPanel>

      {isRecording && <RecordingStatus />}
    </Box>
  )
}
