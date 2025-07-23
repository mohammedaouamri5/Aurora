"use client"

import { Box, Typography, Avatar, IconButton, Tooltip } from "@mui/material"
import { Person as PersonIcon, SmartToy as BotIcon, VolumeUp as VolumeUpIcon } from "@mui/icons-material"
import { DynamicGlassPanel } from "../aurora/dynamic-glass-panel.jsx"
import { MessageFormatter } from "./message-formatter.jsx"
import { useTheme } from "../../hooks/use-theme"

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
            <MessageBubble key={message.id || index} message={message} />
          ))}
        </Box>
      ) : (
        <EmptyState />
      )}
    </Box>
  )
}

function MessageBubble({ message }) {
  const { theme } = useTheme()
  const isUser = message.type === "user"

  const handleReadMessage = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(message.content)
      utterance.rate = 0.9
      utterance.pitch = 1
      utterance.volume = 0.8

      const voices = window.speechSynthesis.getVoices()
      const preferredVoice = voices.find(
        (voice) => voice.name.includes("Google") || voice.name.includes("Microsoft") || voice.lang.startsWith("en"),
      )
      if (preferredVoice) {
        utterance.voice = preferredVoice
      }

      window.speechSynthesis.speak(utterance)
    }
  }

  return (
    <Box
      sx={{
        display: "flex",
        gap: 3,
        mb: 6,
        alignItems: "flex-start",
        position: "relative",
        "&:hover .message-actions": {
          opacity: 1,
        },
        "&:hover": {
          "& .message-content": {
            boxShadow: isUser ? `0 0 20px ${theme.AURORA_PRIMARY}30` : `0 0 20px ${theme.AURORA_SECONDARY}30`,
          },
        },
      }}
    >
      {/* Avatar */}
      <Avatar
        sx={{
          width: 32,
          height: 32,
          bgcolor: isUser ? theme.AURORA_PRIMARY : theme.AURORA_SECONDARY,
          flexShrink: 0,
          boxShadow: isUser ? `0 0 15px ${theme.AURORA_PRIMARY}50` : `0 0 15px ${theme.AURORA_SECONDARY}50`,
          border: `1px solid ${isUser ? `${theme.AURORA_PRIMARY}40` : `${theme.AURORA_SECONDARY}40`}`,
          transition: "all 0.3s ease",
          "&:hover": {
            transform: "scale(1.02)",
            boxShadow: isUser ? `0 0 20px ${theme.AURORA_PRIMARY}70` : `0 0 20px ${theme.AURORA_SECONDARY}70`,
          },
        }}
      >
        {isUser ? (
          <PersonIcon sx={{ fontSize: 18, color: "white" }} />
        ) : (
          <BotIcon sx={{ fontSize: 18, color: "white" }} />
        )}
      </Avatar>

      {/* Message Content */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        {/* Sender Label and Actions */}
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
          <Typography
            variant="body2"
            sx={{
              color: theme.TEXT_PRIMARY,
              fontWeight: 600,
              fontSize: "14px",
              textShadow: `0 0 10px ${theme.TEXT_PRIMARY}40`,
            }}
          >
            {isUser ? "You" : "Assistant"}
          </Typography>

          {/* Message Actions */}
          <Box
            className="message-actions"
            sx={{
              opacity: 0,
              transition: "opacity 0.3s ease",
              display: "flex",
              gap: 0.5,
            }}
          >
            <Tooltip title="Read message aloud" arrow>
              <IconButton
                size="small"
                onClick={handleReadMessage}
                sx={{
                  color: theme.TEXT_SECONDARY_CHAT,
                  bgcolor: theme.SIDEBAR_BG,
                  backdropFilter: "blur(10px)",
                  border: `1px solid ${theme.BORDER_COLOR}`,
                  width: 28,
                  height: 28,
                  "&:hover": {
                    bgcolor: `${theme.AURORA_PRIMARY}20`,
                    color: theme.TEXT_PRIMARY,
                    boxShadow: `0 0 15px ${theme.AURORA_PRIMARY}40`,
                  },
                }}
              >
                <VolumeUpIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Message Content with Syntax Highlighting */}
        <DynamicGlassPanel
          className="message-content"
          variant={isUser ? "message-user" : "message-assistant"}
          sx={{
            p: 3,
            mb: 2,
            transition: "all 0.3s ease",
          }}
        >
          <MessageFormatter content={message.content} />
        </DynamicGlassPanel>

        {/* Timestamp */}
        <Typography
          variant="caption"
          sx={{
            color: theme.TEXT_SECONDARY_CHAT,
            fontSize: "12px",
            opacity: 0.8,
          }}
        >
          {message.timestamp}
        </Typography>
      </Box>
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
