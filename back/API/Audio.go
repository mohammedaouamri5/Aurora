package api

import (
	"fmt"
	"mime/multipart"
	"net/http"
	"os"
	"path/filepath"
	"time"

	"github.com/gin-gonic/gin"
	ai "github.com/mohammedaouamri5/Aurora/AI"
	log "github.com/sirupsen/logrus"
)

func reciveAudio(ctx *gin.Context) (*multipart.FileHeader, string, error) {
	// Handle audio file upload
	file, err := ctx.FormFile("file")
	if err != nil {
		log.Warn("No file found in request")
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "No file found"})
		return nil, "", nil
	}

	if filepath.Ext(file.Filename) != ".wav" {
		log.Warnf("Invalid file type: %s", file.Filename)
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Only .wav files are allowed"})
		return nil, "", nil
	}

	uploadDir := "uploads"
	if _, err := os.Stat(uploadDir); os.IsNotExist(err) {
		if err := os.Mkdir(uploadDir, os.ModePerm); err != nil {
			log.Error("Failed to create upload directory:", err)
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create upload directory"})
			return nil, "", nil
		}
	}

	// Generate a unique filename using timestamp
	timestamp := time.Now().Format("20060102_150405") // e.g., 20240303_143010
	newFileName := fmt.Sprintf("%s.wav", timestamp)
	filePath := filepath.Join(uploadDir, newFileName)

	// Save the file
	if err := ctx.SaveUploadedFile(file, filePath); err != nil {
		log.Error("Failed to save file:", err)
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save file"})
		return nil, "", nil
	}

	return file, filePath, nil
}





func Audio(ctx *gin.Context) {

	// Open uploaded file
	_, filePath, err := reciveAudio(ctx)
	if err != nil {
		log.Error("Failed to recive audio:", err)
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to recive audio"})
		return
	}


	text, _ := ai.Wisper(ctx, filePath)
	ai.Llm(ctx, text)
	log.Info(text)
	// wisper(ctx, "uploads/LJ037-0171.wav")
	ctx.File(filePath)



}

func Text(ctx *gin.Context) {

}
