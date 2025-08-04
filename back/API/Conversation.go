package api

import (
	"context"
	"errors"
	"fmt"
	"net/http"
	"time"

	sq "github.com/Masterminds/squirrel"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/mohammedaouamri5/Aurora/constant"
	"github.com/mohammedaouamri5/Aurora/initializers"
	"github.com/mohammedaouamri5/Aurora/models"
	"github.com/mohammedaouamri5/Aurora/utile"
	log "github.com/sirupsen/logrus"
)

func NewChat(ctx *gin.Context) {
	type Request struct {
		AssistantID *string `json:"assistant_id"`
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

	err := errors.New("")

	if request.AssistantID == nil {
		request.AssistantID = &constant.DefaultAssistantID
	} else if Status, __err := utile.UUIDIsExist(*request.AssistantID, "Assistant", err); Status == http.StatusInternalServerError {
		log.Error(__err.Error())
		ctx.JSON(Status,
			gin.H{
				"error": __err.Error(),
			},
		)
		return
	} else if Status == http.StatusBadRequest {
		log.Error(__err.Error())
		err = errors.Join(err, __err)
	}

	UserID, DoseExist := ctx.Get("id")
	if !DoseExist {
		ctx.JSON(401, gin.H{"message": "unauthorized"})
		return
	}

	if !utile.IsOK(err) {
		log.Error(err.Error())
		ctx.JSON(http.StatusBadRequest,
			gin.H{
				"error": err.Error(),
			},
		)
		return

	}

	AssistantID, _ := uuid.Parse(*request.AssistantID)
	UserID, _ = uuid.Parse(UserID.(string))
	newConversation := models.Conversation{
		AssistantID: AssistantID,
		UserID:      UserID.(uuid.UUID),
		Titel:       constant.NewChat,
	}

	if err := initializers.DB.Orm.Create(&newConversation).Error; err != nil {
		log.Error(err.Error())
		ctx.JSON(http.StatusInternalServerError,
			gin.H{
				"error": err.Error(),
			},
		)
		return
	}

	SaveToMongoDB := func(newConversation models.Conversation, err error) bool {
		conversation := models.Chat{
			ConversationID: newConversation.ConversationID.String(),
			Messages:       make([]models.Message, 0),
		}
		__ctx, cancel := context.WithTimeout(context.Background(), 1*time.Second)
		defer cancel()

		collection := initializers.DB.Mongo.Collection("conversations")
		_, err = collection.InsertOne(__ctx, conversation)
		if err != nil {
			log.Error(err.Error())
			return true
		}
		__ctx.Done()

		log.Info(conversation)
		return false
	}

	go SaveToMongoDB(newConversation, err)
	log.Info(newConversation)
	ctx.JSON(http.StatusOK, newConversation)

}

func SELECTALLConversation(ctx *gin.Context) {
	type Response struct {
		ConversationID string
		CreatedAt      *time.Time
		AssistantID    string
		Titel          string
	}
	UserID, Exist := ctx.Get("id")
	if !Exist {
		ctx.JSON(401, gin.H{"message": "unauthorized"})
		return
	}

	conversations := make([]Response, 0)
	sql, args, _ := sq.
		Select(`
		Conversation_ID ConversationID, 
		Created_At CreatedAt, 
		Assistant_ID AssistantID, 
		Titel
	`).
		From("CONVERSATIONs").
		Where(fmt.Sprintf("'%s' = user_id", UserID.(string))).
		ToSql()

	rows, err := initializers.DB.Raw.Query(sql, args...)
	if err != nil {
		log.Error(err.Error())
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}
	defer rows.Close()

	for rows.Next() {
		var conv Response
		if err := rows.Scan(
			&conv.ConversationID,
			&conv.CreatedAt,
			&conv.AssistantID,
			&conv.Titel,
		); err != nil {
			log.Error(err.Error())
			ctx.JSON(http.StatusInternalServerError, gin.H{
				"error": err.Error(),
			})
			return
		}
		conversations = append(conversations, conv)
	}

	ctx.JSON(http.StatusOK, gin.H{
		"conversations": conversations,
	})

}
