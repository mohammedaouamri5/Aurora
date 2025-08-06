package constant

import (
	"github.com/google/uuid"
	"github.com/mohammedaouamri5/Aurora/models"
)

var DefaultAssistantID = "18d1b57a-d4cd-4d50-879d-b9a3a6754bdc"
var NewChat = "New Chat"

var DefaultAssistant = models.Assistant{
	AssistantID:   uuid.MustParse(DefaultAssistantID),
	AssistantName: "Default",
}

var TheChatChanel chan models.Chat

