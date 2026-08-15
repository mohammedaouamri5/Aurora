import { IconButton } from "@mui/material"
import { Mic as MicIcon, MicOff as MicOffIcon } from "@mui/icons-material"
import { useTheme } from "../../hooks/use-theme"

export function RecordingButton({ isRecording, onToggleRecording }) {
  const { theme } = useTheme()

  return (
    <IconButton
      onClick={onToggleRecording}
      sx={{
        bgcolor: isRecording ? theme.RECORDING_RED : theme.SIDEBAR_HOVER,
        color: isRecording ? "#ffffff" : theme.TEXT_SECONDARY,
        border: `1px solid ${theme.BORDER_COLOR}`,
        width: 40,
        height: 40,
        "&:hover": {
          bgcolor: isRecording ? theme.RECORDING_RED : theme.SIDEBAR_BG,
          borderColor: theme.AURORA_PRIMARY,
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
