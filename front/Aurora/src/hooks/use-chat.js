import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GetConversations } from "../redux/ConversationaNameSlice";
import { sampleMessages } from "./../data/sample-messages"
import { sampleChats } from "./../data/sample-chats"

export function useChat() {
  const [selectedChat, setSelectedChat] = useState("1");
  const [searchQuery, setSearchQuery] = useState("");

  const dispatch = useDispatch();
  const { data, status, error } = useSelector((state) => state.ConversationsName);

  useEffect(() => {
    dispatch(GetConversations());
  }, [dispatch]);

  const groupedChats = useMemo(() => {
    const chats = data || [];

    console.log("NIGGGA", chats.length)
    console.log("NIGGGA", chats)
    if (
      !Array.isArray(chats)
    ) { return {} }



    
    const filtered = chats.filter((chat) => chat.Titel.toLowerCase().includes(searchQuery.toLowerCase()));
    filtered.sort((a, b) => new Date(b.CreatedAt) - new Date(a.CreatedAt));

    const groups = {};
    filtered.forEach((chat) => {
      if (!groups[chat.CreatedAt]) {
        groups[chat.CreatedAt] = [];
      }
      groups[chat.CreatedAt].push(chat);
    });

    return groups;
  }, [data, searchQuery]);

  const currentMessages = useMemo(() => {
    return selectedChat ? sampleMessages[selectedChat] || [] : []
  }, [selectedChat])

  const currentChatTitle = useMemo(() => {
    const chat = sampleChats.find((c) => c.id === selectedChat)
    return chat ? chat.title : null
  }, [selectedChat])

  return {
    selectedChat,
    setSelectedChat,
    searchQuery,
    setSearchQuery,
    groupedChats,
    currentMessages,
    currentChatTitle,
  }
}

