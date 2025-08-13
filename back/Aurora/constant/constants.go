package constant

import (
	"sync"

	"github.com/google/uuid"
	"github.com/mohammedaouamri5/Aurora/models"
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

var DefaultUserConfig = models.UserConfig{
	MainChatter: models.ModelConfig{
		Name:        "dolphin-llama-13b",
		Temperature: 0.8,
		Max_tokens:  400,
	},
	TitelGenerator: models.ModelConfig{
		Name:        "llama-3.2-1b-instruct",
		Temperature: 0.8,
		Max_tokens:  50,
	},
}

var NewChat = "New Chat"

var TheMassegeChanel chan MessageStreem

var CurrentChats sync.Map
