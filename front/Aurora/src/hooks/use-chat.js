import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GetConversations } from "../redux/ConversationaNameSlice";
import { GetMessages } from "../redux/MessegesSlice";
import { sampleMessages } from "./../data/sample-messages"
import { sampleChats } from "./../data/sample-chats"

export function useChat() {
  const [selectedChat, setSelectedChat] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const dispatchConversationsName = useDispatch();
  const dispatchMessages = useDispatch();
  const {
    data: Conversations,
    status: conversationsStatus,
    error: conversationsError
  } = useSelector((state) => state.ConversationsName);

  const { data: Messages,
    status: messagesStatus,
    error: messagesError
  } = useSelector((state) => state.Messages);

  const fullState = useSelector((state) => state);



  useEffect(() => {
    dispatchConversationsName(GetConversations());
  }, []);


  const groupedChats = useMemo(() => {
    const chats = Conversations || [];

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
  }, [Conversations, searchQuery]);

  const currentMessages = useMemo(() => {
    // console.log("Messages", Messages)
    // console.log("Conversations", Conversations)
    return selectedChat ? Messages[selectedChat] || [] : [];
  }, [selectedChat, Messages]);



  const currentChatTitle = useMemo(() => {
    const chat = sampleChats.find((c) => c.id === selectedChat)
    return chat ? chat.title : null
  }, [selectedChat])


  useEffect(() => {
    dispatchMessages(GetMessages(
      { ConversationID: selectedChat }));
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


