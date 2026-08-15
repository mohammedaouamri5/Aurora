import { IconButton } from "@mui/material"
import { Send as SendIcon } from "@mui/icons-material"
import { useTheme } from "../../hooks/use-theme"

export function SendButton({ onSend }) {
  const { theme } = useTheme()

  return (
    <IconButton
      onClick={onSend}
      sx={{
        bgcolor: theme.AURORA_PRIMARY,
        color: "#ffffff",
        width: 40,
        height: 40,
        "&:hover": {
          bgcolor: theme.AURORA_PRIMARY,
          boxShadow: `0 0 15px ${theme.AURORA_PRIMARY}60`,
        },
      }}
    >
      <SendIcon />
    </IconButton>
  )
}
