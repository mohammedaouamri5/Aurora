import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GetConversations } from "../redux/ConversationaNameSlice";
import { GetMessages } from "../redux/MessegesSlice";

function toDateKey(value) {
  if (!value) return "Today";
  const date = new Date(value);
  if (isNaN(date.getTime())) return "Today";
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (date.toDateString() === today.toDateString()) return "Today";
  if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
  return date.toLocaleDateString([], { month: "long", day: "numeric", year: "numeric" });
}

export function useChat() {
  const [selectedChat, setSelectedChat] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const dispatchConversationsName = useDispatch();
  const dispatchMessages = useDispatch();
  const {
    data: Conversations,
  } = useSelector((state) => state.ConversationsName);

  const { data: Messages } = useSelector((state) => state.Messages);

  useEffect(() => {
    dispatchConversationsName(GetConversations());
  }, []);

  const groupedChats = useMemo(() => {
    const chats = Array.isArray(Conversations) ? Conversations : [];

    const filtered = chats
      .filter((chat) =>
        (chat.Titel || "").toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => new Date(b.CreatedAt) - new Date(a.CreatedAt));

    const groups = {};
    filtered.forEach((chat) => {
      const key = toDateKey(chat.CreatedAt);
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(chat);
    });

    return groups;
  }, [Conversations, searchQuery]);

  const currentMessages = useMemo(() => {
    return selectedChat ? Messages[selectedChat] || [] : [];
  }, [selectedChat, Messages]);

  const currentChatTitle = useMemo(() => {
    const chats = Array.isArray(Conversations) ? Conversations : [];
    const chat = chats.find((c) => c.ConversationID === selectedChat);
    return chat ? chat.Titel : null;
  }, [Conversations, selectedChat]);

  useEffect(() => {
    if (selectedChat) {
      dispatchMessages(GetMessages({ ConversationID: selectedChat }));
    }
  }, [dispatchMessages, selectedChat]);

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
