package logic

import (
	"encoding/json"
	"fmt"
	"strings"
	"time"

	ai "github.com/mohammedaouamri5/Aurora/AI"
	"github.com/mohammedaouamri5/Aurora/constant"
	"github.com/mohammedaouamri5/Aurora/initializers"
	"github.com/mohammedaouamri5/Aurora/models"
	"github.com/mohammedaouamri5/Aurora/utile"
	log "github.com/sirupsen/logrus"
)

func TextResponce(__ID string, __messages []models.Message) {
	// get the Responce From LLM
	text_responce, err := ai.OLLAMA(__messages, utile.GetUserConfi("").MainChatter, nil)

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
	if len(__messages)%5 == 0 {
		// go MakeTitle(__ID, __messages)
	}

	// Save New Message
	go utile.PushMessageToMongodb(__ID, new_message)
}

func MakeTitle(__ID string, __messages []models.Message) {
	messages := []models.Message{
		{
			Role:    "system",
			Content: "in one line discribe the conversation , I want to give it a titel , I need it to  be short",
		},
		{
			Role:    "user",
			Content: fmt.Sprintf("%+v", __messages),
		},
	}

	// Get response from LLM
	textResponse, err := ai.OLLAMA(messages, utile.GetUserConfi("").MainChatter, nil)
	if err != nil {
		log.Error(err.Error())
		return
	}

	log.Info("New Title: " + textResponse)
	title := strings.TrimSpace(textResponse)

	// Use parameterized query to prevent SQL injection

	sql := `UPDATE public.conversations SET titel=$1 WHERE conversation_id =$2 ;`

	result, err := initializers.Clients.Raw.Exec(sql, title, __ID)
	if err != nil {
		log.Error("Failed to update title: " + err.Error())
		return
	}

	log.Info("Updated title for conversation " + __ID + ": " + title)
	_ = result // avoid unused warning
}
