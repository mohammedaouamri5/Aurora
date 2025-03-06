package utile

import (
	"fmt"
	"os"
	"path/filepath"
	"time"
)




func NowPath() (string , error) {



	uploadDir := "Audio"
	if _, err := os.Stat(uploadDir); os.IsNotExist(err) {
		return "" , err
	}

	// Generate a unique filename using timestamp
	timestamp := time.Now().Format("20060102_150405") // e.g., 20240303_143010
	newFileName := fmt.Sprintf("%s.wav", timestamp)
	filePath := filepath.Join(uploadDir, newFileName)

	return filePath , nil

}
