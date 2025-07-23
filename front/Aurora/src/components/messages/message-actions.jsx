"use client"

import { Box, IconButton, Tooltip } from "@mui/material"
import { VolumeUp as VolumeUpIcon, ContentCopy as CopyIcon, Edit as EditIcon } from "@mui/icons-material"
import { COLORS } from "../../constants/sidebar.js"

export function MessageActions({ message, onRead, onCopy, onEdit }) {
  const handleCopy = () => {
    navigator.clipboard.writeText(message.content)
    onCopy && onCopy(message)
  }

  const handleEdit = () => {
    onEdit && onEdit(message)
  }

  const handleRead = () => {
    onRead && onRead(message)
  }

  return (
    <Box
      className="message-actions"
      sx={{
        opacity: 0,
        transition: "opacity 0.2s ease",
        display: "flex",
        gap: 0.5,
      }}
    >
      <Tooltip title="Read message aloud" arrow>
        <IconButton
          size="small"
          onClick={handleRead}
          sx={{
            color: COLORS.TEXT_SECONDARY_CHAT,
            bgcolor: COLORS.MESSAGE_ASSISTANT_BG,
            width: 28,
            height: 28,
            "&:hover": {
              bgcolor: COLORS.SIDEBAR_HOVER,
              color: COLORS.TEXT_PRIMARY,
            },
          }}
        >
          <VolumeUpIcon sx={{ fontSize: 16 }} />
        </IconButton>
      </Tooltip>

      <Tooltip title="Copy message" arrow>
        <IconButton
          size="small"
          onClick={handleCopy}
          sx={{
            color: COLORS.TEXT_SECONDARY_CHAT,
            bgcolor: COLORS.MESSAGE_ASSISTANT_BG,
            width: 28,
            height: 28,
            "&:hover": {
              bgcolor: COLORS.SIDEBAR_HOVER,
              color: COLORS.TEXT_PRIMARY,
            },
          }}
        >
          <CopyIcon sx={{ fontSize: 16 }} />
        </IconButton>
      </Tooltip>

      {message.type === "user" && (
        <Tooltip title="Edit message" arrow>
          <IconButton
            size="small"
            onClick={handleEdit}
            sx={{
              color: COLORS.TEXT_SECONDARY_CHAT,
              bgcolor: COLORS.MESSAGE_ASSISTANT_BG,
              width: 28,
              height: 28,
              "&:hover": {
                bgcolor: COLORS.SIDEBAR_HOVER,
                color: COLORS.TEXT_PRIMARY,
              },
            }}
          >
            <EditIcon sx={{ fontSize: 16 }} />
          </IconButton>
        </Tooltip>
      )}
    </Box>
  )
}
