package api

import (
	"context"
	"errors"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	// "github.com/mohammedaouamri5/Aurora/constant"
	ai "github.com/mohammedaouamri5/Aurora/AI"
	"github.com/mohammedaouamri5/Aurora/constant"
	"github.com/mohammedaouamri5/Aurora/initializers"
	"github.com/mohammedaouamri5/Aurora/models"
	"github.com/mohammedaouamri5/Aurora/utile"
	log "github.com/sirupsen/logrus"
	"go.mongodb.org/mongo-driver/bson"
	// "go.mongodb.org/mongo-driver/mongo/options"
)

func GetMessage(ctx *gin.Context) {
	type Request struct {
		ConversationID *string `binding:"required"`
	}

	var request Request
	if err := ctx.ShouldBindQuery(&request); err != nil {
		log.Error(err.Error())
		ctx.JSON(http.StatusBadRequest,
			gin.H{
				"error": err.Error(),
			},
		)
		return
	}
	// Check UUID Conversation
	if Status, __err := utile.UUIDIsExist(*request.ConversationID, "Conversation", errors.New("")); Status == http.StatusInternalServerError {
		log.Error(__err.Error())
		ctx.JSON(Status,
			gin.H{
				"error": __err.Error(),
			},
		)
		return
	} else if Status == http.StatusBadRequest {
		log.Error(__err.Error())
		ctx.JSON(Status,
			gin.H{
				"error": __err.Error(),
			},
		)
		return
	}

	// MongoDB push message to conversation
	__ctx, cancel := context.WithTimeout(context.Background(), 5*time.Millisecond)
	defer cancel()

	collection := initializers.DB.Mongo.Collection("conversations")

	filter := bson.M{"conversationID": *request.ConversationID}

	// Upsert: true → creates the document if it doesn't exist

	var result models.Chat
	if err := collection.FindOne(__ctx, filter).Decode(&result); err != nil {
		log.Errorf("The error in getting the conversation of %s  is %s ", *request.ConversationID, err.Error())
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}
	log.Infof("You Gonna store %+v in %s ", result.Messages, *request.ConversationID)
	constant.CurrentChats.Store(
		*request.ConversationID, result.Messages,
	)

	ctx.JSON(http.StatusOK, gin.H{
		*request.ConversationID: result.Messages,
	})
}

func SendTextMessage(ctx *gin.Context) {
	type Request struct {
		ConversationID *string `binding:"required"`
		TextMessage    *string `binding:"required"`
	}

	var request Request
	if err := ctx.ShouldBindJSON(&request); err != nil {
		log.Error(err.Error())
		ctx.JSON(http.StatusBadRequest,
			gin.H{
				"error": err.Error(),
			},
		)
		return
	}

	if Status, __err := utile.UUIDIsExist(*request.ConversationID, "Conversation", errors.New("")); Status == http.StatusInternalServerError {
		log.Error(__err.Error())
		ctx.JSON(Status,
			gin.H{
				"error": __err.Error(),
			},
		)
		return
	} else if Status == http.StatusBadRequest {
		log.Error(__err.Error())
		ctx.JSON(Status,
			gin.H{
				"error": __err.Error(),
			},
		)
		return
	}
	__time := time.Now()
	message := models.Message{
		CreatedAt: &__time,
		Role:      "user",
		Content:   *request.TextMessage,
		AudioPath: "",
	}

	// MongoDB push message to conversation
	go utile.PushMessageToMongodb(*request.ConversationID, message)

	messages, IsOk := constant.CurrentChats.Load(*request.ConversationID)
	if !IsOk {
		log.Error(messages)
		log.Errorf("The messages of %s is not stord yet", *request.ConversationID)
		ctx.Status(http.StatusInternalServerError)
		return
	}

	messages = append(messages.([]models.Message), message)
	go TextResponce(*request.ConversationID, messages.([]models.Message))

	ctx.JSON(http.StatusOK, message)
}

func TextResponce(__ID string, __messages []models.Message) {

	text_responce, _ := ai.LLM(__messages)
	now := time.Now()
	new_message := models.Message{
		CreatedAt: &now,
		Role:      "assistant",
		Content:   text_responce,
	}
	__messages = append([]models.Message{new_message}, __messages...)

	constant.TheMassegeChanel <-  utile.MessageStreem{
		ConversationID: __ID,
		Message: new_message,
	}

	constant.CurrentChats.Store(__ID, __messages)

	go utile.PushMessageToMongodb(__ID, new_message)
}
