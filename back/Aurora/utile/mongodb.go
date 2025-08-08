package utile

import (
	"context"
	"time"

	"github.com/mohammedaouamri5/Aurora/initializers"
	"github.com/mohammedaouamri5/Aurora/models"
	log "github.com/sirupsen/logrus"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func PushMessageToMongodb(conversationID string, message models.Message) {
	__ctx, cancel := context.WithTimeout(context.Background(), 500*time.Millisecond)
	defer cancel()

	collection := initializers.DB.Mongo.Collection("conversations")

	filter := bson.M{"conversationID": conversationID}
	update := bson.M{
		"$push": bson.M{
			"messages": message,
		},
	}

	// Upsert: true → creates the document if it doesn't exist
	opts := options.Update().SetUpsert(true)

	if _, err := collection.UpdateOne(__ctx, filter, update, opts); err != nil {
		log.Error(err.Error())

	}
}
