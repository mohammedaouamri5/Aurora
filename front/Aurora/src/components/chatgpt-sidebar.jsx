"use client"

import { useState } from "react"
import { Box, Drawer } from "@mui/material"
import { TopBar } from "./top-bar/top-bar.jsx"
import { SidebarContent } from "./sidebar/sidebar-content.jsx"
import { MainContent } from "./main-content.jsx"
import { DynamicAuroraBackground } from "./aurora/dynamic-aurora-background.jsx"
import { DynamicParticles } from "./aurora/dynamic-particles.jsx"
import { ThemeProvider } from "../hooks/use-theme"
import { useChat } from "../hooks/use-chat.js"
import { useRecording } from "../hooks/use-recording.js"
import { useMessages } from "../hooks/use-messages.js"
import { DRAWER_WIDTH } from "../constants/sidebar.js"
import { useDispatch } from "react-redux"
import { SendTextMessage } from "../redux/MessegesSlice.js"

function ChatGPTSidebarContent() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [message, setMessage] = useState("")
  const dispatch = useDispatch();

  const {
    selectedChat,
    setSelectedChat,
    searchQuery,
    setSearchQuery,
    groupedChats,
    currentMessages,
    currentChatTitle,
  } = useChat()


  const { isRecording, startRecording, stopRecording } = useRecording()
  const { addUserMessage, addAssistantMessage } = useMessages()

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const handleSendMessage = () => {
    if (message.trim()) {
      addUserMessage(message)
      console.log(message)
      dispatch(SendTextMessage(
        {
          ConversationID: selectedChat,
          Textmessage: message
        }
      ))
      setMessage("")
    }
  }

  const handleAddMessage = (newMessage) => {
    console.log("New message added:", newMessage)
  }

  return (
    <Box sx={{ display: "flex", height: "100vh", position: "relative" }}>
      {/* Dynamic Aurora Background */}
      <DynamicAuroraBackground />
      <DynamicParticles />

      {/* Fixed Top Bar */}
      <TopBar sidebarOpen={sidebarOpen} onToggleSidebar={toggleSidebar} />

      {/* Sidebar */}
      <Drawer
        variant="persistent"
        anchor="left"
        open={sidebarOpen}
        sx={{
          width: sidebarOpen ? DRAWER_WIDTH : 0,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: DRAWER_WIDTH,
            boxSizing: "border-box",
            border: "none",
            bgcolor: "transparent",
            zIndex: 1200,
          },
        }}
      >
        <SidebarContent
          groupedChats={groupedChats}
          selectedChat={selectedChat}
          onChatSelect={setSelectedChat}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      </Drawer>

      {/* Main Content */}
      <Box
        sx={{
          flexGrow: 1,
          transition: "margin-left 0.3s ease",
          marginLeft: sidebarOpen ? 0 : `-${DRAWER_WIDTH}px`,
        }}
      >
        <MainContent
          sidebarOpen={sidebarOpen}
          isRecording={isRecording}
          message={message}
          onMessageChange={setMessage}
          onStartRecording={startRecording}
          onStopRecording={stopRecording}
          onSendMessage={handleSendMessage}
          selectedChat={selectedChat}
          messages={currentMessages}
          chatTitle={currentChatTitle}
          onAddMessage={handleAddMessage}
        />
      </Box>
    </Box>
  )
}

export default function ChatGPTSidebar() {
  return (
    <ThemeProvider>
      <ChatGPTSidebarContent />
    </ThemeProvider>
  )
}
