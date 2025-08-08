package constant

import (
	"sync"

	"github.com/google/uuid"
	"github.com/mohammedaouamri5/Aurora/models"
	"github.com/mohammedaouamri5/Aurora/utile"
)

var DefaultAssistantID = "18d1b57a-d4cd-4d50-879d-b9a3a6754bdc"

var DefaultAssistant = models.Assistant{
	AssistantID:   uuid.MustParse(DefaultAssistantID),
	AssistantName: "Default",
	SystemPrompt: `
				You are a Speech-to-Speech assistant:
				- Whisper for STT (speech-to-text)
				- Mistral as the LLM
				- Kokoro for TTS (text-to-speech)

				Your job is to give direct, unfiltered, and brutally honest responses. Avoid politeness, sugarcoating, and unnecessary words. Be specific, straight to the point, and use the fewest words possible.
	`,
}


var NewChat = "New Chat"

var TheMassegeChanel chan  utile.MessageStreem

var CurrentChats sync.Map
