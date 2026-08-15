import { useState } from "react"
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material"
import { MoreHoriz as MoreHorizIcon, Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material"
import { useTheme } from "../../hooks/use-theme"

export function ChatList({ groupedChats, selectedChat, onChatSelect }) {
  const { theme } = useTheme()
  const [hoveredChat, setHoveredChat] = useState(null)
  const [anchorEl, setAnchorEl] = useState(null)
  const [menuChatId, setMenuChatId] = useState(null)

  const handleMenuClick = (event, chatId) => {
    event.stopPropagation()
    setAnchorEl(event.currentTarget)
    setMenuChatId(chatId)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    setMenuChatId(null)
  }

  return (
    <Box sx={{ flex: 1, overflow: "auto" }}>
      {Object.entries(groupedChats).map(([category, chats]) => (
        <Box key={category}>
          <Typography
            variant="caption"
            sx={{
              color: theme.TEXT_SECONDARY,
              px: 2,
              py: 1,
              display: "block",
              fontSize: "11px",
              fontWeight: 600,
              textTransform: "uppercase",
            }}
          >
            {category}
          </Typography>
          <List dense sx={{ py: 0 }}>
            {chats.map((chat) => (
              <ListItem
                key={chat.ConversationID}
                disablePadding
                onMouseEnter={() => setHoveredChat(chat.ConversationID)}
                onMouseLeave={() => setHoveredChat(null)}
                sx={{ px: 2 }}
              >
                <ListItemButton
                  selected={selectedChat === chat.ConversationID}
                  onClick={() => onChatSelect(chat.ConversationID)}
                  sx={{
                    borderRadius: 1,
                    color: theme.TEXT_PRIMARY,
                    "&.Mui-selected": {
                      bgcolor: theme.SIDEBAR_HOVER,
                      "&:hover": {
                        bgcolor: theme.SIDEBAR_HOVER,
                      },
                    },
                    "&:hover": {
                      bgcolor: theme.SIDEBAR_HOVER,
                    },
                    "& .MuiListItemText-primary": {
                      fontSize: "14px",
                      fontWeight: 400,
                    },
                  }}
                >
                  <ListItemText
                    primary={chat.Titel}
                    sx={{
                      "& .MuiListItemText-primary": {
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      },
                    }}
                  />
                  {hoveredChat === chat.ConversationID && (
                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuClick(e, chat.ConversationID)}
                      sx={{
                        color: theme.TEXT_SECONDARY,
                        "&:hover": {
                          color: theme.TEXT_PRIMARY,
                        },
                      }}
                    >
                      <MoreHorizIcon fontSize="small" />
                    </IconButton>
                  )}
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      ))}

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            bgcolor: theme.SIDEBAR_HOVER,
            color: theme.TEXT_PRIMARY,
            border: `1px solid ${theme.BORDER_COLOR}`,
            borderRadius: 2,
            backdropFilter: "blur(20px)",
            boxShadow: `0 8px 32px rgba(0, 0, 0, 0.4)`,
          },
        }}
      >
        <MenuItem onClick={handleMenuClose} sx={{ fontSize: "14px" }}>
          <EditIcon sx={{ mr: 1, fontSize: 16 }} />
          Rename
        </MenuItem>
        <MenuItem onClick={handleMenuClose} sx={{ fontSize: "14px", color: theme.RECORDING_RED }}>
          <DeleteIcon sx={{ mr: 1, fontSize: 16 }} />
          Delete
        </MenuItem>
      </Menu>
    </Box>
  )
}
