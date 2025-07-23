"use client"

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
import { COLORS } from "../../constants/sidebar.js"

export function ChatList({ groupedChats, selectedChat, onChatSelect }) {
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
              color: COLORS.TEXT_SECONDARY,
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
                key={chat.id}
                disablePadding
                onMouseEnter={() => setHoveredChat(chat.id)}
                onMouseLeave={() => setHoveredChat(null)}
                sx={{ px: 2 }}
              >
                <ListItemButton
                  selected={selectedChat === chat.id}
                  onClick={() => onChatSelect(chat.id)}
                  sx={{
                    borderRadius: 1,
                    color: "white",
                    "&.Mui-selected": {
                      bgcolor: COLORS.SIDEBAR_HOVER,
                    },
                    "&:hover": {
                      bgcolor: COLORS.SIDEBAR_HOVER,
                    },
                    "& .MuiListItemText-primary": {
                      fontSize: "14px",
                      fontWeight: 400,
                    },
                  }}
                >
                  <ListItemText
                    primary={chat.title}
                    sx={{
                      "& .MuiListItemText-primary": {
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      },
                    }}
                  />
                  {hoveredChat === chat.id && (
                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuClick(e, chat.id)}
                      sx={{
                        color: COLORS.TEXT_SECONDARY,
                        "&:hover": {
                          color: "white",
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
            bgcolor: COLORS.SIDEBAR_HOVER,
            color: "white",
            border: `1px solid ${COLORS.BORDER_COLOR}`,
          },
        }}
      >
        <MenuItem onClick={handleMenuClose} sx={{ fontSize: "14px" }}>
          <EditIcon sx={{ mr: 1, fontSize: 16 }} />
          Rename
        </MenuItem>
        <MenuItem onClick={handleMenuClose} sx={{ fontSize: "14px", color: "#ff6b6b" }}>
          <DeleteIcon sx={{ mr: 1, fontSize: 16 }} />
          Delete
        </MenuItem>
      </Menu>
    </Box>
  )
}
