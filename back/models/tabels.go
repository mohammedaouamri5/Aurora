package models

import (
	"github.com/google/uuid"
	"gorm.io/datatypes"
	"time"
)


type User struct {
	UserID   uuid.UUID `gorm:"type:uuid;default:uuid_generate_v4();primary_key"`
	Name     string    `gorm:"type:varchar(255);not null"`
	Email    string    `gorm:"uniqueIndex;not null"`
	Password []byte    `gorm:"not null"`
}

