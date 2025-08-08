package api

import (
	"encoding/base64"
	"github.com/gin-gonic/gin"
	ai "github.com/mohammedaouamri5/Aurora/AI"
	"github.com/mohammedaouamri5/Aurora/utile"
	log "github.com/sirupsen/logrus"
	"mime/multipart"
	"net/http"
	"os"
	"path/filepath"
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

	// Generate a unique filename using timestamp
	filePath, err := utile.NewPath()
	if err != nil {
		log.Error(err)
		return nil, "", err
	}

	// Save the file
	if err := ctx.SaveUploadedFile(file, filePath); err != nil {
		log.Error("Failed to save file:", err)
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save file"})
		return nil, "", nil
	}

	return file, filePath, nil
}

func Audio(ctx *gin.Context) {

	wave := utile.Wave{}

	_, AudioInput, err := reciveAudio(ctx)
	if err != nil {
		log.Error(err.Error())
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	wave.AudioInput = AudioInput

	TextInput, err := ai.Wisper(ctx, AudioInput)

	println(TextInput)
	if err != nil {
		log.Error(err.Error())
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	wave.TextInput = TextInput

	log.Info(" \n\n\n\n we've git the Inputtext :  \n\n\n\n ")
	log.Info(wave)
	utile.PrintUtile(wave)

	TextOutput, err := ai.Llm(ctx, TextInput)
	if err != nil {
		log.Error(err.Error())
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	wave.TextOutput = TextOutput

	log.Info(" \n\n\n\n we've git the TextOutput :  \n\n\n\n ")
	utile.PrintUtile(wave)

	ai.KokoroCLI(ctx, &wave)

	// Read the audio file
	audioData, err := os.ReadFile(wave.AudioOutput)
	if err != nil {
		log.Error(err.Error())
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to load audio"})
		return
	}

	// Encode audio file to Base64
	audioBase64 := base64.StdEncoding.EncodeToString(audioData)

	log.Infof(" \n\n\n\n%+v\n\n\n\n ", wave)
	// Send JSON with Base64 audio
	ctx.JSON(http.StatusOK, gin.H{
		"data":  wave,
		"audio": audioBase64,
	})
}

// New endpoint to serve the audio file
func GetAudio(ctx *gin.Context) {
	audioPath := ctx.Query("path") // Get audio file path from query params
	if audioPath == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Missing audio file path"})
		return
	}

	ctx.Header("Content-Type", "audio/wav")
	ctx.File(audioPath) // Serve the audio file
}

func Text(ctx *gin.Context) {

}
