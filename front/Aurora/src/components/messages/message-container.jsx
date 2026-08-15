
import { useEffect, useRef, useState } from "react"
import { Box, Typography, IconButton, Tooltip } from "@mui/material"
import { SmartToy as BotIcon, KeyboardArrowDown as ArrowDownIcon } from "@mui/icons-material"
import { useTheme } from "../../hooks/use-theme"
import { MessageBubble } from "./message-bubble.jsx"

export function MessageContainer({ messages, isPending }) {
  const { theme } = useTheme()
  const scrollRef = useRef(null)
  const [showScrollBtn, setShowScrollBtn] = useState(false)

  const visibleMessages = (messages || []).filter(
    (m) => (m.role || m.Role || "assistant").toLowerCase() !== "system"
  )

  const scrollToBottom = (smooth = false) => {
    const el = scrollRef.current
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: smooth ? "smooth" : "auto" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [visibleMessages.length, isPending])

  const handleScroll = () => {
    const el = scrollRef.current
    if (!el) return
    const distance = el.scrollHeight - el.scrollTop - el.clientHeight
    setShowScrollBtn(distance > 120)
  }

  const showTyping = isPending && visibleMessages.length > 0

  return (
    <Box
      sx={{
        flex: 1,
        minHeight: 0,
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      <Box
        ref={scrollRef}
        onScroll={handleScroll}
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
        {visibleMessages.length > 0 ? (
          <Box sx={{ p: 4, maxWidth: "800px", mx: "auto", width: "100%" }}>
            {visibleMessages.map((message, index) => (
              <MessageBubble key={`${(message.role || message.Role || "assistant")}-${index}`} message={message} />
            ))}

            {showTyping && <TypingIndicator />}
          </Box>
        ) : (
          <EmptyState />
        )}
      </Box>

      {showScrollBtn && (
        <Tooltip title="Scroll to bottom" placement="left" arrow>
          <IconButton
            onClick={() => scrollToBottom(true)}
            sx={{
              position: "absolute",
              bottom: 16,
              right: 16,
              zIndex: 1,
              bgcolor: theme.SIDEBAR_HOVER,
              border: `1px solid ${theme.BORDER_COLOR}`,
              color: theme.TEXT_PRIMARY,
              width: 40,
              height: 40,
              "&:hover": {
                bgcolor: theme.AURORA_PRIMARY,
                color: "#fff",
              },
            }}
          >
            <ArrowDownIcon />
          </IconButton>
        </Tooltip>
      )}
    </Box>
  )
}

function TypingIndicator() {
  const { theme } = useTheme()

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "flex-start",
        gap: 2,
        mb: 3,
        "@keyframes typing-bounce": {
          "0%, 60%, 100%": { transform: "translateY(0)", opacity: 0.4 },
          "30%": { transform: "translateY(-4px)", opacity: 1 },
        },
      }}
    >
      <Box
        sx={{
          width: 32,
          height: 32,
          borderRadius: "50%",
          bgcolor: theme.AURORA_SECONDARY,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          boxShadow: `0 0 12px ${theme.AURORA_SECONDARY}55`,
        }}
      >
        <BotIcon sx={{ fontSize: 18, color: "#fff" }} />
      </Box>
      <Box
        sx={{
          bgcolor: theme.MESSAGE_ASSISTANT_BG,
          border: `1px solid ${theme.BORDER_COLOR}`,
          borderRadius: 2,
          borderTopLeftRadius: 4,
          px: 2,
          py: 1.5,
          display: "flex",
          alignItems: "center",
          gap: 1,
          color: theme.TEXT_SECONDARY_CHAT,
        }}
      >
        <Box sx={{ display: "flex", gap: 0.5 }}>
          {[0, 1, 2].map((i) => (
            <Box
              key={i}
              sx={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                bgcolor: theme.AURORA_PRIMARY,
                animation: "typing-bounce 1.2s ease-in-out infinite",
                animationDelay: `${i * 0.15}s`,
              }}
            />
          ))}
        </Box>
        <Typography variant="caption" sx={{ fontSize: "12px", opacity: 0.8 }}>
          Aurora is thinking…
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
