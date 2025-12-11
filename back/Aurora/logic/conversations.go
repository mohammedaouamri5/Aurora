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
	text_responce, err := ai.OLLAMA(__messages, utile.GetUserConfig("").MainChatter, nil)

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
	}

	// Send the New Message to the front-end
	if __bytes, __err := json.Marshal(constant.MessageStreem{
		ConversationID: __ID,
		Message:        new_message,
	}); __err != nil {
		log.Error(__err.Error())
		return
	} else {
		constant.WSmessages.Send("/ws/messages", __bytes)
	}
	// Cach The Message
	__messages = append([]models.Message{new_message}, __messages...)
	constant.CurrentChats.Store(__ID, __messages)

	// MK title
	if true {
		go MakeTitle(__ID, __messages)
	}

	// Save New Message
	go utile.PushMessageToMongodb(__ID, new_message)
}

func MakeTitle(__ID string, __messages []models.Message) {
	messages := append(__messages , models.Message{
			Role:    "user",
			Content: "In 5 words maximum whats the topic of this conversation",
	})

	// Get response from LLM
	textResponse, err := ai.OLLAMA(messages, utile.GetUserConfig("").TitelGenerator, nil)
	if err != nil {
		log.Error(err.Error())
		return
	}

	title := strings.TrimSpace(textResponse)

	if len(title) > 20 {title = title[:20]}

	log.Info("New Title: " + title)

	sql := `UPDATE public.conversations SET titel=$1 WHERE conversation_id =$2 ;`

	result, err := initializers.Clients.Raw.Exec(sql, title, __ID)
	if err != nil {
		log.Error("Failed to update title: " + err.Error())
		return
	}

	if __bytes, __err := json.Marshal(constant.TitleStreem{
		ConversationID: __ID,
		Title:   title,
	}); __err != nil {
		log.Error(__err.Error())
		return
	} else {
		constant.WSmessages.Send("/ws/titles", __bytes)

		log.WithField("title", &title).WithField("conversation_id", &__ID).WithField("type", "title").Info(" title for conversation is Sended")
	}

	log.Info("Updated title for conversation " + __ID + ": " + title)
	_ = result // avoid unused warning
}
