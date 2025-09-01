package logic

import (
	"fmt"
	"strings"

	ai "github.com/mohammedaouamri5/Aurora/AI"
	"github.com/mohammedaouamri5/Aurora/initializers"
	"github.com/mohammedaouamri5/Aurora/models"
	"github.com/mohammedaouamri5/Aurora/utile"
	log "github.com/sirupsen/logrus"
)

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

	sql := `UPDATE public.conversations 
	SET titel=$1
	WHERE conversation_id =$2 ;`

	result, err := initializers.Clients.Raw.Exec(sql, title, __ID)
	if err != nil {
		log.Error("Failed to update title: " + err.Error())
		return
	}

	log.Info("Updated title for conversation " + __ID + ": " + title)
	_ = result // avoid unused warning
}
