import { useState } from "react"
import { Box } from "@mui/material"
import { SidebarContent } from "./sidebar/sidebar-content.jsx"
import { MainContent } from "./main-content.jsx"
import { useLayout } from "../hooks/use-layout.jsx"
import { useChat } from "../hooks/use-chat.js"
import { useRecording } from "../hooks/use-recording.js"
import { DRAWER_WIDTH } from "../constants/sidebar.js"
import { useDispatch, useSelector } from "react-redux"
import { SendTextMessage } from "../redux/MessegesSlice.js"
import { AddConversation } from "../redux/ConversationaNameSlice.js"

export default function ChatGPTSidebar() {
  const { sidebarOpen } = useLayout()
  const [message, setMessage] = useState("")
  const dispatch = useDispatch()

  const { pending } = useSelector((state) => state.Messages)

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

  const handleSendMessage = async () => {
    if (!message.trim()) return

    let conversationID = selectedChat
    if (!conversationID) {
      try {
        const conversation = await dispatch(AddConversation({})).unwrap()
        conversationID = conversation?.ConversationID
        setSelectedChat(conversationID)
      } catch (err) {
        console.error("Failed to create conversation:", err)
        return
      }
    }

    dispatch(
      SendTextMessage({
        ConversationID: conversationID,
        Textmessage: message,
      })
    )
    setMessage("")
  }

  const handleNewChat = async () => {
    try {
      const conversation = await dispatch(AddConversation({})).unwrap()
      setSelectedChat(conversation?.ConversationID)
    } catch (err) {
      console.error("Failed to create conversation:", err)
    }
  }

  return (
    <Box sx={{ display: "flex", height: "100%" }}>
      {/* Sidebar */}
      <Box
        sx={{
          width: sidebarOpen ? DRAWER_WIDTH : 0,
          flexShrink: 0,
          overflow: "hidden",
          transition: "width 0.3s ease",
        }}
      >
        <SidebarContent
          groupedChats={groupedChats}
          selectedChat={selectedChat}
          onChatSelect={setSelectedChat}
          onNewChat={handleNewChat}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      </Box>

      {/* Main Content */}
      <Box sx={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
        <MainContent
          isRecording={isRecording}
          message={message}
          onMessageChange={setMessage}
          onStartRecording={startRecording}
          onStopRecording={stopRecording}
          onSendMessage={handleSendMessage}
          messages={currentMessages}
          chatTitle={currentChatTitle}
          isPending={pending[selectedChat]}
        />
      </Box>
    </Box>
  )
}
