package constant

import (
	"sync"

	"github.com/google/uuid"
	"github.com/mohammedaouamri5/Aurora/models"
	wsm "github.com/mohammedaouamri5/WSM"
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
		Name:        "gemma3:270m",
		Temperature: 0.8,
		Max_tokens:  400,
		Options: map[string]interface{}{
			"temperature":    0.7,
			"num_ctx":        1024,
			"num_predict":    25,
			"top_p":          0.9,
			"repeat_penalty": 1.1,
			"num_thread":     8,
		},
	},
	TitelGenerator: models.ModelConfig{
		Name:        "gemma3:270m",
		Temperature: 0.8,
		Max_tokens:  100,
		Options: map[string]interface{}{
			"temperature":    0.7,
			"num_ctx":        1024,
			"num_predict":    5,
			"top_p":          0.9 ,
			"repeat_penalty": 2.1,
			"num_thread":     8,
		},
	},
}

var NewChat = "New Chat"

var TheMassegeChanel chan MessageStreem

var CurrentChats sync.Map


var WSmanager = wsm.NewManager()


