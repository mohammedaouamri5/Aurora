"use client"

import { SidebarHeader } from "./sidebar-header.jsx"
import { SidebarSearch } from "./sidebar-search.jsx"
import { ChatList } from "./chat-list.jsx"
import { SidebarFooter } from "./sidebar-footer.jsx"
import { DynamicGlassPanel } from "../aurora/dynamic-glass-panel.jsx"
import { useTheme } from "../../hooks/use-theme"

export function SidebarContent({ groupedChats, selectedChat, onChatSelect, searchQuery, onSearchChange }) {
  const { theme } = useTheme()

  return (
    <DynamicGlassPanel
      variant="sidebar"
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        pt: "64px",
        borderRadius: 0,
        border: "none",
        borderRight: `1px solid ${theme.BORDER_COLOR}`,
      }}
    >
      <SidebarHeader />
      <SidebarSearch searchQuery={searchQuery} onSearchChange={onSearchChange} />
      <ChatList groupedChats={groupedChats} selectedChat={selectedChat} onChatSelect={onChatSelect} />
      <SidebarFooter />
    </DynamicGlassPanel>
  )
}
