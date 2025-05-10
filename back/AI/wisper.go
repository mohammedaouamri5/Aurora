package ai

import (
	"bytes"
	"encoding/json"
	"io"
	"mime/multipart"
	"net/http"
	"os"
	"path/filepath"

	"github.com/gin-gonic/gin"
	log "github.com/sirupsen/logrus"
)

func Wisper(ctx *gin.Context, filePath string) (string, error) {
	type Segment struct {
		Id    int     `json:"id"`
		Start float32 `json:"start"`
		End   float32 `json:"end"`
		Text  string  `json:"text"`
	}

	type Response struct {
		Task     string    `json:"task"`
		Language string    `json:"language"`
		Text     string    `json:"text"`
		Segments []Segment `json:"segments"`
	}

	log.Info("Transcribing audio file:", filePath)

	// Open the file
	openedFile, err := os.Open(filePath)
	if err != nil {
		log.Error("Failed to open file:", err)
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to open audio file"})
		return "", err
	}
	defer openedFile.Close()

	// Prepare request body
	body := &bytes.Buffer{}
	writer := multipart.NewWriter(body)
	part, err := writer.CreateFormFile("file", filepath.Base(filePath))
	if err != nil {
		log.Error(err.Error())
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create form data"})
		return "", err
	}

	if _, err := io.Copy(part, openedFile); err != nil {
		log.Error(err.Error())
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to copy file data"})
		return "", err
	}

	// Add other fields
	_ = writer.WriteField("model", "ggml-large-v3-turbo-q5_0") // Change model if needed
	_ = writer.WriteField("language", "en")                    // Change model if needed
	_ = writer.WriteField("response_format", "text")
	writer.Close()

	// Send request to Whisper API
	req, err := http.NewRequest("POST", "http://localhost:8888/v1/audio/transcriptions", body)
	if err != nil {
		log.Error("Failed to create request:", err)
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create request"})
		return "", err
	}
	req.Header.Set("Content-Type", writer.FormDataContentType())

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		log.Error(err.Error())
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to send request"})
		return "", err
	}
	defer resp.Body.Close()

	// Read response
	respBody, err := io.ReadAll(resp.Body)
	if err != nil {
		log.Error(err.Error())
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to read response"})
		return "", err
	}
	// Parse JSON response
	var whisperResp Response
	if err := json.Unmarshal(respBody, &whisperResp); err != nil {
		log.Error("Failed to parse JSON response:", err)
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse response"})
		return "", err
	}

	log.Infof("Transcription Task: %s", whisperResp.Task)
	log.Infof("Language: %s", whisperResp.Language)
	log.Infof("Full Text: %s", whisperResp.Text)

	return whisperResp.Text, nil
}
