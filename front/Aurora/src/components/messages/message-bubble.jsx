import { useState } from "react"
import { Box, Typography, Tooltip, ButtonBase, Collapse, IconButton } from "@mui/material"
import {
  Person as PersonIcon,
  SmartToy as BotIcon,
  Settings as SystemIcon,
  Psychology as PsychologyIcon,
  ExpandMore as ExpandMoreIcon,
  ContentCopy as ContentCopyIcon,
  Check as CheckIcon,
} from "@mui/icons-material"
import { useTheme } from "../../hooks/use-theme"
import { MessageFormatter } from "./message-formatter.jsx"

const ROLE_CONFIG = {
  user: { label: "You", icon: PersonIcon, align: "flex-end" },
  assistant: { label: "Aurora", icon: BotIcon, align: "flex-start" },
  system: { label: "System", icon: SystemIcon, align: "flex-start" },
}

function formatTime(value) {
  if (!value) return ""
  const date = new Date(value)
  if (isNaN(date.getTime())) return ""
  return date.toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function MessageBubble({ message }) {
  const { theme } = useTheme()
  const [showThinking, setShowThinking] = useState(false)
  const [copied, setCopied] = useState(false)

  const role = (message.role || "assistant").toLowerCase()
  const config = ROLE_CONFIG[role] || ROLE_CONFIG.assistant
  const isUser = role === "user"
  const Icon = config.icon
  const avatarBg = isUser ? theme.AURORA_PRIMARY : role === "system" ? theme.AURORA_ACCENT : theme.AURORA_SECONDARY
  const timestamp = formatTime(message.createdAt || message.CreatedAt)

  const thinking = (message.thinking || message.Thinking || "").trim()

  const handleCopy = () => {
    navigator.clipboard?.writeText(message.content || "").then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  const avatar = (
    <Tooltip title={config.label} placement="top" arrow>
      <Box
        sx={{
          width: 32,
          height: 32,
          borderRadius: "50%",
          bgcolor: avatarBg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          boxShadow: `0 0 12px ${avatarBg}55`,
        }}
      >
        <Icon sx={{ fontSize: 18, color: "#fff" }} />
      </Box>
    </Tooltip>
  )

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: config.align,
        mb: 3,
        alignItems: "flex-start",
        gap: 2,
      }}
    >
      {!isUser && avatar}

      <Box sx={{ maxWidth: "72%", minWidth: 0 }}>
        {!isUser && thinking && (
          <Box sx={{ mb: 1 }}>
            <ButtonBase
              onClick={() => setShowThinking((v) => !v)}
              sx={{
                px: 1,
                py: 0.5,
                borderRadius: 1,
                gap: 0.5,
                color: theme.TEXT_SECONDARY_CHAT,
                bgcolor: `${theme.AURORA_ACCENT}15`,
                border: `1px solid ${theme.BORDER_COLOR}`,
                "&:hover": {
                  bgcolor: `${theme.AURORA_ACCENT}25`,
                  color: theme.TEXT_PRIMARY,
                },
              }}
            >
              <PsychologyIcon sx={{ fontSize: 16 }} />
              <Typography variant="caption" sx={{ fontWeight: 600, fontSize: "11px" }}>
                {showThinking ? "Hide thought process" : "Thought process"}
              </Typography>
              <ExpandMoreIcon
                sx={{
                  fontSize: 16,
                  transition: "transform 0.2s ease",
                  transform: showThinking ? "rotate(180deg)" : "none",
                }}
              />
            </ButtonBase>

            <Collapse in={showThinking} unmountOnExit>
              <Box
                sx={{
                  mt: 1,
                  p: 1.5,
                  borderRadius: 1.5,
                  borderLeft: `3px solid ${theme.AURORA_ACCENT}`,
                  bgcolor: "rgba(0, 0, 0, 0.25)",
                  color: theme.TEXT_SECONDARY_CHAT,
                  fontSize: "13px",
                  lineHeight: 1.6,
                  fontStyle: "italic",
                  whiteSpace: "pre-wrap",
                  maxHeight: 320,
                  overflow: "auto",
                }}
              >
                {thinking}
              </Box>
            </Collapse>
          </Box>
        )}

        <Box sx={{ position: "relative", "&:hover .message-copy": { opacity: 1 } }}>
          <Box
            sx={{
              bgcolor: isUser ? undefined : theme.MESSAGE_ASSISTANT_BG,
              background: isUser
                ? `linear-gradient(135deg, ${theme.AURORA_PRIMARY}, ${theme.AURORA_SECONDARY})`
                : undefined,
              color: isUser ? "#fff" : theme.TEXT_PRIMARY,
              border: isUser ? "none" : `1px solid ${theme.BORDER_COLOR}`,
              borderRadius: 2,
              borderTopLeftRadius: isUser ? 12 : 4,
              borderTopRightRadius: isUser ? 4 : 12,
              p: 2,
              backdropFilter: "blur(10px)",
              boxShadow: isUser ? `0 4px 20px ${theme.AURORA_PRIMARY}30` : undefined,
            }}
          >
            {isUser ? (
              <Typography sx={{ whiteSpace: "pre-wrap", lineHeight: 1.5 }}>{message.content}</Typography>
            ) : (
              <MessageFormatter content={message.content} />
            )}
          </Box>

          <Box
            sx={{
              position: "absolute",
              top: -10,
              right: isUser ? "auto" : -6,
              left: isUser ? -6 : "auto",
              opacity: 0,
              transition: "opacity 0.2s ease",
            }}
            className="message-copy"
          >
            <Tooltip title={copied ? "Copied!" : "Copy"} placement="top" arrow>
              <IconButton
                size="small"
                onClick={handleCopy}
                sx={{
                  bgcolor: theme.SIDEBAR_HOVER,
                  border: `1px solid ${theme.BORDER_COLOR}`,
                  color: theme.TEXT_SECONDARY_CHAT,
                  width: 26,
                  height: 26,
                  "&:hover": { color: theme.TEXT_PRIMARY },
                }}
              >
                {copied ? <CheckIcon sx={{ fontSize: 15 }} /> : <ContentCopyIcon sx={{ fontSize: 15 }} />}
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <Typography
          variant="caption"
          sx={{
            display: "block",
            mt: 0.5,
            opacity: 0.6,
            color: theme.TEXT_SECONDARY_CHAT,
            fontSize: "11px",
            textAlign: isUser ? "right" : "left",
          }}
        >
          {config.label}
          {timestamp ? ` · ${timestamp}` : ""}
        </Typography>
      </Box>

      {isUser && avatar}
    </Box>
  )
}
