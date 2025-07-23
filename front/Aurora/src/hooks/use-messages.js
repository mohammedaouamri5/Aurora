"use client"

import { useState, useCallback } from "react"

export function useMessages(initialMessages = []) {
  const [messages, setMessages] = useState(initialMessages)

  const addMessage = useCallback((newMessage) => {
    setMessages((prev) => [...prev, newMessage])
  }, [])

  const addUserMessage = useCallback(
    (content) => {
      const message = {
        id: `msg_${Date.now()}`,
        type: "user",
        content,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }
      addMessage(message)
      return message
    },
    [addMessage],
  )

  const addAssistantMessage = useCallback(
    (content) => {
      const message = {
        id: `msg_${Date.now()}_assistant`,
        type: "assistant",
        content,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }
      addMessage(message)
      return message
    },
    [addMessage],
  )

  const clearMessages = useCallback(() => {
    setMessages([])
  }, [])

  return {
    messages,
    addMessage,
    addUserMessage,
    addAssistantMessage,
    clearMessages,
    setMessages,
  }
}
