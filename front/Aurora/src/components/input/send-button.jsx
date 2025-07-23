"use client"

import { IconButton } from "@mui/material"
import { Send as SendIcon } from "@mui/icons-material"
import { COLORS } from "../../constants/sidebar.js"

export function SendButton({ onSend }) {
  return (
    <IconButton
      onClick={onSend}
      sx={{
        bgcolor: COLORS.PRIMARY_GREEN,
        color: "white",
        width: 40,
        height: 40,
        "&:hover": {
          bgcolor: "#0d8f6f",
        },
      }}
    >
      <SendIcon />
    </IconButton>
  )
}
