package logic

import (
	"encoding/json"
	"strings"
	"time"

	ai "github.com/mohammedaouamri5/Aurora/AI"
	"github.com/mohammedaouamri5/Aurora/constant"
	"github.com/mohammedaouamri5/Aurora/initializers"
	"github.com/mohammedaouamri5/Aurora/models"
	"github.com/mohammedaouamri5/Aurora/utile"
	"github.com/mohammedaouamri5/go-log/log"
)

func TextResponce(__ID string, __messages []models.Message) {
	// get the Responce From LLM
	text_responce, thinking, err := ai.OLLAMA(__messages, utile.GetUserConfig("").MainChatter, nil)

	if err != nil {
		log.Error(err.Error())
		return
	}

	// mkmessage and push it to the array
	now := time.Now()
	new_message := models.Message{
		CreatedAt: &now,
		Role:      "assistant",
		Content:   text_responce,
		Thinking:  thinking,
	}

	// Send the New Message to the front-end
	if __bytes, __err := json.Marshal(constant.MessageStreem{
		ConversationID: __ID,
		Message:        new_message,
	}); __err != nil {
		log.Error(__err.Error())
		return
	} else {
		constant.Broadcast(constant.WSmessages, "/ws/messages/", __bytes)
	}
	// Cach The Message
	__messages = append(append([]models.Message{}, __messages...), new_message)
	constant.CurrentChats.Store(__ID, __messages)

	// MK title
	go MakeTitle(__ID, __messages)

	// Save New Message
	go utile.PushMessageToMongodb(__ID, new_message)
}

const titlePrompt = "You create concise chat titles. Reply with only the title, no quotes or punctuation, 5 words or fewer."

func MakeTitle(__ID string, __messages []models.Message) {
	// Only title the conversation once it has at least 5 user messages
	var userMessages []models.Message
	for _, msg := range __messages {
		if msg.Role == "user" {
			userMessages = append(userMessages, msg)
		}
	}
	if len(userMessages) < 5 {
		return
	}

	// Only generate once: keep "New Chat" otherwise
	var currentTitle string
	if err := initializers.Clients.Raw.QueryRow(
		"SELECT titel FROM conversations WHERE conversation_id=$1", __ID,
	).Scan(&currentTitle); err != nil {
		log.WithErr(err).Error("Failed to load current title")
		return
	}
	if currentTitle != "" && currentTitle != constant.NewChat {
		return
	}

	// Build a focused prompt from the conversation (no system prompt)
	titleMessages := make([]models.Message, 0, len(userMessages)+2)
	titleMessages = append(titleMessages, models.Message{Role: "system", Content: titlePrompt})
	titleMessages = append(titleMessages, userMessages...)
	titleMessages = append(titleMessages, models.Message{
		Role:    "user",
		Content: "Title for this conversation:",
	})

	textResponse, _, err := ai.OLLAMA(titleMessages, utile.GetUserConfig("").TitelGenerator, nil)
	if err != nil {
		log.WithErr(err).Error("Failed to generate title")
	}

	title := ""
	if err == nil {
		title = cleanTitle(textResponse)
	}
	if title == "" || title == "Error" {
		title = cleanTitle(userMessages[0].Content)
	}
	if title == "" {
		return
	}

	sql := `UPDATE public.conversations SET titel=$1 WHERE conversation_id =$2 ;`
	if _, err := initializers.Clients.Raw.Exec(sql, title, __ID); err != nil {
		log.WithErr(err).Error("Failed to update title")
		return
	}

	if __bytes, __err := json.Marshal(constant.TitleStreem{
		ConversationID: __ID,
		Title:          title,
	}); __err != nil {
		log.Error(__err.Error())
		return
	} else {
		constant.Broadcast(constant.WStitels, "/ws/titles/", __bytes)

		log.WithField("title", &title).WithField("conversation_id", &__ID).WithField("type", "title").Info(" title for conversation is Sended")
	}

	log.Info("Updated title for conversation " + __ID + ": " + title)
}

func cleanTitle(raw string) string {
	title := strings.TrimSpace(raw)
	title = strings.TrimPrefix(title, "Title:")
	title = strings.Trim(title, "\"“”'\n\r\t -—")
	title = strings.TrimSpace(title)

	runes := []rune(title)
	if len(runes) > 40 {
		title = string(runes[:40])
	}
	return strings.TrimSpace(title)
}
