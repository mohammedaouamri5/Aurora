import { Box, Typography, Paper, IconButton, Tooltip } from "@mui/material"
import { 
  Person as PersonIcon, 
  SmartToy as BotIcon,
  Settings as SystemIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon
} from "@mui/icons-material"
import { useState } from "react"
import { useTheme } from "../../hooks/use-theme"

export function MessageBubble({ message }) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const { theme } = useTheme()
  
  // Determine message type and styling
  const getMessageConfig = () => {
    switch (message.role) {
      case "user":
        return {
          isUser: true,
          justifyContent: "flex-end",
          bgcolor: theme.MESSAGE_USER_BG,
          color: theme.TEXT_PRIMARY,
          border: `1px solid ${theme.AURORA_PRIMARY}`,
          icon: <PersonIcon sx={{ fontSize: 18, color: "white" }} />,
          avatarBg: theme.AURORA_PRIMARY,
          displayName: message.messenger || "User"
        }
      case "system":
        return {
          isUser: false,
          justifyContent: "flex-start",
          bgcolor: theme.MESSAGE_ASSISTANT_BG,
          color: theme.AURORA_ACCENT,
          border: `1px solid ${theme.AURORA_ACCENT}`,
          icon: <SystemIcon sx={{ fontSize: 18, color: "white" }} />,
          avatarBg: theme.AURORA_ACCENT,
          displayName: message.messenger || "System"
        }
      case "assistant":
      default:
        return {
          isUser: false,
          justifyContent: "flex-start",
          bgcolor: theme.MESSAGE_ASSISTANT_BG,
          color: theme.TEXT_PRIMARY,
          border: `1px solid ${theme.BORDER_COLOR}`,
          icon: <BotIcon sx={{ fontSize: 18, color: "white" }} />,
          avatarBg: theme.PRIMARY_COLOR,
          displayName: message.messenger || "Assistant"
        }
    }
  }

  const config = getMessageConfig()

  const handleToggleCollapse = () => {
    setIsCollapsed(!isCollapsed)
  }

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: config.justifyContent,
        mb: 3,
        alignItems: "flex-start",
        gap: 2,
      }}
    >
      {!config.isUser && (
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Tooltip title={config.displayName} placement="top" arrow>
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                bgcolor: config.avatarBg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                cursor: "pointer",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "scale(1.1)",
                  boxShadow: `0 0 10px ${config.avatarBg}`,
                },
              }}
              onClick={handleToggleCollapse}
            >
              {config.icon}
            </Box>
          </Tooltip>
          {isCollapsed && (
            <Typography
              variant="caption"
              sx={{
                mt: 0.5,
                fontSize: "10px",
                color: theme.TEXT_SECONDARY_CHAT,
                textAlign: "center",
                opacity: 0.8,
              }}
            >
              {config.displayName}
            </Typography>
          )}
        </Box>
      )}

{!isCollapsed && (
        <Paper
          elevation={1}
          sx={{
            p: 2,
            maxWidth: "70%",
            bgcolor: config.bgcolor,
            color: config.color,
            borderRadius: 2,
            border: config.border,
            cursor: "pointer",
            transition: "all 0.3s ease",
            backdropFilter: "blur(10px)",
            "&:hover": {
              transform: "translateY(-1px)",
              boxShadow: `0 8px 25px ${theme.AURORA_PRIMARY}20`,
              borderColor: theme.AURORA_SECONDARY,
            },
          }}
          onClick={handleToggleCollapse}
        >
          <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
            <Typography
              variant="body1"
              sx={{
                whiteSpace: "pre-wrap",
                lineHeight: 1.5,
                flex: 1,
                "& code": {
                  bgcolor: message.role === "user" 
                    ? theme.BG_GRADIENT_1
                    : message.role === "system" 
                      ? theme.BG_GRADIENT_4
                      : theme.BG_GRADIENT_2,
                  padding: "2px 6px",
                  borderRadius: "4px",
                  fontFamily: "monospace",
                  fontSize: "0.9em",
                  border: `1px solid ${theme.BORDER_COLOR}`,
                },
              }}
            >
              {message.content}
            </Typography>
            
            <IconButton
              size="small"
              sx={{
                color: config.color,
                opacity: 0.7,
                minWidth: 20,
                height: 20,
                p: 0,
                "&:hover": {
                  opacity: 1,
                  bgcolor: theme.BG_GRADIENT_1,
                },
              }}
            >
              <ExpandLessIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Box>

          <Typography
            variant="caption"
            sx={{
              display: "block",
              mt: 1,
              opacity: 0.7,
              fontSize: "11px",
              color: theme.TEXT_SECONDARY_CHAT,
            }}
          >
            {message.timestamp}
          </Typography>
        </Paper>
      )}

      {config.isUser && (
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Tooltip title={config.displayName} placement="top" arrow>
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                bgcolor: config.avatarBg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                cursor: "pointer",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "scale(1.1)",
                  boxShadow: `0 0 10px ${config.avatarBg}`,
                },
              }}
              onClick={handleToggleCollapse}
            >
              {config.icon}
            </Box>
          </Tooltip>
          {isCollapsed && (
            <Typography
              variant="caption"
              sx={{
                mt: 0.5,
                fontSize: "10px",
                color: theme.TEXT_SECONDARY_CHAT,
                textAlign: "center",
                opacity: 0.8,
              }}
            >
              {config.displayName}
            </Typography>
          )}
        </Box>
      )}
    </Box>
  )
}
