package api

import (
	"context"
	"errors"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/mohammedaouamri5/Aurora/initializers"
	"github.com/mohammedaouamri5/Aurora/models"
	"github.com/mohammedaouamri5/Aurora/utile"
	log "github.com/sirupsen/logrus"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo/options"
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

	filter := bson.M{"conversationid": *request.ConversationID}

	// Upsert: true → creates the document if it doesn't exist

	var result models.Chat
	if err := collection.FindOne(__ctx, filter).Decode(&result); err != nil {
		log.Error(err.Error())
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	log.Infof("==> %+v ", result)
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
	__ctx, cancel := context.WithTimeout(context.Background(), 500*time.Millisecond)
	defer cancel()

	collection := initializers.DB.Mongo.Collection("conversations")

	filter := bson.M{"conversationid": *request.ConversationID}
	update := bson.M{
		"$push": bson.M{
			"messages": message,
		},
	}

	// Upsert: true → creates the document if it doesn't exist
	opts := options.Update().SetUpsert(true)

	if _, err := collection.UpdateOne(__ctx, filter, update, opts); err != nil {
		log.Error(err.Error())
		ctx.JSON(http.StatusInternalServerError,
			gin.H{
				"error": err.Error(),
			},
		)
		return

	}

	ctx.JSON(http.StatusOK, message)

}
