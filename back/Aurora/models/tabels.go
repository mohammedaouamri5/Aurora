package models

import (
	"time"

	"github.com/google/uuid"
	ollama "github.com/ollama/ollama/api"
)

type User struct {
	UserID   uuid.UUID `gorm:"type:uuid;default:uuid_generate_v4();primary_key"`
	Name     string    `gorm:"type:varchar(255);not null"`
	Email    string    `gorm:"uniqueIndex;not null"`
	Password []byte    `gorm:"not null"`
}

type ModelConfig struct {
	Name        string
	Temperature float32
	Max_tokens  int
	Thinking    bool // enable reasoning/thinking for models that support it
	Options     map[string]any `json:"options" gorm:"type:jsonb"`
}

type UserConfig struct {
	MainChatter    ModelConfig
	TitelGenerator ModelConfig
}

type Assistant struct {
	AssistantID   uuid.UUID `gorm:"type:uuid;default:uuid_generate_v4();primary_key"`
	AssistantName string    `gorm:"type:varchar(20);not null"`
	SystemPrompt  string    `gorm:"type:text;not null"`
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
	CreatedAt *time.Time         `bson:"createdAt" json:"createdAt"`
	Role      string             `bson:"role" json:"role"` // e.g. "User" or "Assistant"
	Content   string             `bson:"content" json:"content"`
	AudioPath string             `bson:"audioPath" json:"audioPath"`
	Thinking  string             `json:"thinking,omitempty"`
	Images    []ollama.ImageData `json:"images,omitempty"`
	ToolCalls []ollama.ToolCall  `json:"tool_calls,omitempty"`
	ToolName  string             `json:"tool_name,omitempty"`
}

type Chat struct {
	ConversationID string    `bson:"conversationID" json:"conversationID"`
	Messages       []Message `bson:"messages" json:"messages"`
}

type File struct {
    FileID   uuid.UUID `gorm:"type:uuid;default:uuid_generate_v4();primaryKey"` // Primary key with UUID default
    OwnerID  uuid.UUID `gorm:"type:uuid;not null"`                               // Foreign key referencing User
    FileName string    `gorm:"type:varchar(255);not null"`                       // File name
    MetaData string    `gorm:"type:text;not null"`                               // Metadata in JSON or string
    Owner    User      `gorm:"foreignKey:OwnerID"`                               // Association with User
}

type FileMetaData struct {
}








