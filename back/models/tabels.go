package models

import (
	"time"

	"github.com/google/uuid"
)

type User struct {
	UserID   uuid.UUID `gorm:"type:uuid;default:uuid_generate_v4();primary_key"`
	Name     string    `gorm:"type:varchar(255);not null"`
	Email    string    `gorm:"uniqueIndex;not null"`
	Password []byte    `gorm:"not null"`
}

type Assistant struct {
	AssistantID   uuid.UUID `gorm:"type:uuid;default:uuid_generate_v4();primary_key"`
	AssistantName string    `gorm:"type:varchar(255);not null"`
}

type Conversation struct {
	ConversationID uuid.UUID `gorm:"type:uuid;default:uuid_generate_v4();primary_key"`
	CreatedAt      time.Time `gorm:"type:timestamp;default:NOW()"`
	UserID         uuid.UUID `gorm:"type:uuid;foreignKey:UserID"`
	AssistantID    uuid.UUID `gorm:"type:uuid;foreignKey:AssistantID"`
	Titel          string
	User           User
	Assistant      Assistant
}

type Message struct {
	CreatedAt *time.Time `bson:"createdAt" json:"createdAt"`
	Role      string     `bson:"role" json:"role"` // e.g. "User" or "Assistant"
	Content   string     `bson:"content" json:"content"`
	AudioPath string     `bson:"audioPath" json:"audioPath"`
}

type Chat struct {
	ConversationID       string    `bson:"conversationID" json:"conversationID"`
	Messages []Message `bson:"messages" json:"messages"`
}
