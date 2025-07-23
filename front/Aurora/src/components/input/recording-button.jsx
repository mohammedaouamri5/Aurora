"use client"

import { IconButton } from "@mui/material"
import { Mic as MicIcon, MicOff as MicOffIcon } from "@mui/icons-material"
import { COLORS } from "../../constants/sidebar.js"

export function RecordingButton({ isRecording, onToggleRecording }) {
  return (
    <IconButton
      onClick={onToggleRecording}
      sx={{
        bgcolor: isRecording ? COLORS.RECORDING_RED : "#f0f0f0",
        color: isRecording ? "white" : "#666",
        width: 40,
        height: 40,
        "&:hover": {
          bgcolor: isRecording ? "#ff3333" : "#e0e0e0",
        },
        animation: isRecording ? "pulse 1.5s infinite" : "none",
        "@keyframes pulse": {
          "0%": {
            transform: "scale(1)",
            opacity: 1,
          },
          "50%": {
            transform: "scale(1.1)",
            opacity: 0.8,
          },
          "100%": {
            transform: "scale(1)",
            opacity: 1,
          },
        },
      }}
    >
      {isRecording ? <MicOffIcon /> : <MicIcon />}
    </IconButton>
  )
}
