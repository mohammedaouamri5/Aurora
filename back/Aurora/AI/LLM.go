package ai

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"io"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/mohammedaouamri5/Aurora/initializers"
	"github.com/mohammedaouamri5/Aurora/models"
	ollama "github.com/ollama/ollama/api"
	"github.com/mohammedaouamri5/go-log/log"
)

/*


curl http://localhost:1234/api/v0/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "granite-3.0-2b-instruct",
    "messages": [
      { "role": "system", "content": "Always answer in rhymes." },
      { "role": "user", "content": "Introduce yourself." }
    ],
    "temperature": 0.7,
    "max_tokens": -1,
    "stream": false
  }'



*/
// THIS WILL USE CONTEX

func OLLAMA(messages []models.Message, model models.ModelConfig, result chan string) (string, string, error) {
	ctx := context.Background()

	ollamaMessages := make([]ollama.Message, len(messages))
	for i, msg := range messages {
		ollamaMessages[i].Role = msg.Role
		ollamaMessages[i].Content = msg.Content
		ollamaMessages[i].Thinking = msg.Thinking
		ollamaMessages[i].Images = msg.Images
		ollamaMessages[i].ToolCalls = msg.ToolCalls
		ollamaMessages[i].ToolName = msg.ToolName

	}

	stream := false
	req := &ollama.ChatRequest{
		Model:    model.Name,
		Messages: ollamaMessages,
		Stream:   &stream,
	}
	if model.Thinking {
		req.Think = &ollama.ThinkValue{Value: true}
	}

	var finalResult strings.Builder
	var finalThinking strings.Builder

	respFunc := func(resp ollama.ChatResponse) error {

		finalResult.WriteString(resp.Message.Content)
		finalThinking.WriteString(resp.Message.Thinking)
		return nil
	}

	// log.Infof("ChatRequest: %s", b)
	err := initializers.Clients.Ollama.Chat(ctx, req, respFunc)
	if err != nil {
		return "Error", "", err
	}

	// Return the full collected response
	return finalResult.String(), finalThinking.String(), nil
}

func LLM(messages []models.Message, model models.ModelConfig, result chan string) (string, error) {
	pushToChannel := func(str string) {
		if result != nil {
			select {
			case result <- str:
			default:
				// Channel is full or closed, don't block
			}
		}
	}

	type Usage struct {
		PromptTokens     int `json:"prompt_tokens"`
		CompletionTokens int `json:"completion_tokens"`
		TotalTokens      int `json:"total_tokens"`
	}

	type Stats struct {
		TokensPerSecond  float64 `json:"tokens_per_second"`
		TimeToFirstToken float64 `json:"time_to_first_token"`
		GenerationTime   float64 `json:"generation_time"`
		StopReason       string  `json:"stop_reason"`
	}

	type ModelInfo struct {
		Arch          string `json:"arch"`
		Quant         string `json:"quant"`
		Format        string `json:"format"`
		ContextLength int    `json:"context_length"`
	}

	type Runtime struct {
		Name             string   `json:"name"`
		Version          string   `json:"version"`
		SupportedFormats []string `json:"supported_formats"`
	}

	type Choice struct {
		Index        int            `json:"index"`
		Logprobs     *string        `json:"logprobs"`
		FinishReason string         `json:"finish_reason"`
		Message      models.Message `json:"message"`
	}

	type LLMResponse struct {
		ID        string    `json:"id"`
		Object    string    `json:"object"`
		Created   int64     `json:"created"`
		Model     string    `json:"model"`
		Choices   []Choice  `json:"choices"`
		Usage     Usage     `json:"usage"`
		Stats     Stats     `json:"stats"`
		ModelInfo ModelInfo `json:"model_info"`
		Runtime   Runtime   `json:"runtime"`
	}

	requestBody, err := json.Marshal(map[string]interface{}{
		"model":       model.Name,
		"messages":    messages,
		"temperature": model.Temperature,
		"max_tokens":  model.Max_tokens,
		"stream":      false,
	})
	if err != nil {
		log.Error(err.Error())
		pushToChannel("")
		return "", err

	}

	// log.Infof("Sending request to LLM: %s", string(requestBody))

	resp, err := http.Post(
		"http://localhost:1234/api/v0/chat/completions",
		"application/json",
		bytes.NewBuffer(requestBody),
	)
	if err != nil {
		log.Error(err.Error())
		pushToChannel("")
		return "", err
	}
	defer resp.Body.Close()

	// Check HTTP status code
	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		log.Error("HTTP error %d: %s", resp.StatusCode, string(body))
		pushToChannel("")
		return "", err
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		log.Error(err.Error())
		pushToChannel("")
		return "", err
	}

	var response LLMResponse
	if err := json.Unmarshal(body, &response); err != nil {
		log.Error(err.Error())
		pushToChannel("")
		return "", err
	}

	// Safety check for choices slice
	if len(response.Choices) == 0 {
		pushToChannel("")
		return "", errors.New("no choices returned from LLM")
	}

	content := response.Choices[0].Message.Content
	pushToChannel(content)
	return content, nil
}
func Llm(ctx *gin.Context, __text string) (string, error) {
	type Message struct {
		Role string `json:"role"`

		Content string `json:"content"`
	}

	type Usage struct {
		PromptTokens     int `json:"prompt_tokens"`
		CompletionTokens int `json:"completion_tokens"`
		TotalTokens      int `json:"total_tokens"`
	}

	type Stats struct {
		TokensPerSecond  float64 `json:"tokens_per_second"`
		TimeToFirstToken float64 `json:"time_to_first_token"`
		GenerationTime   float64 `json:"generation_time"`
		StopReason       string  `json:"stop_reason"`
	}

	type ModelInfo struct {
		Arch          string `json:"arch"`
		Quant         string `json:"quant"`
		Format        string `json:"format"`
		ContextLength int    `json:"context_length"`
	}

	type Runtime struct {
		Name             string   `json:"name"`
		Version          string   `json:"version"`
		SupportedFormats []string `json:"supported_formats"`
	}

	type Choice struct {
		Index        int     `json:"index"`
		Logprobs     *string `json:"logprobs"`
		FinishReason string  `json:"finish_reason"`
		Message      Message `json:"message"`
	}

	type LLMResponse struct {
		ID        string    `json:"id"`
		Object    string    `json:"object"`
		Created   int64     `json:"created"`
		Model     string    `json:"model"`
		Choices   []Choice  `json:"choices"`
		Usage     Usage     `json:"usage"`
		Stats     Stats     `json:"stats"`
		ModelInfo ModelInfo `json:"model_info"`
		Runtime   Runtime   `json:"runtime"`
	}

	log.Info("llm")

	requestBody, err := json.Marshal(map[string]interface{}{
		"messages": []map[string]string{
			{
				"role": "system",
				"content": `You are an Speech to Speech 
				whisper model for STT 
				then mistral as an LLM 
				then kokoro for TTS
				that gives direct , unfiltered, and brutally honest responses. Avoid unnecessary politeness and sugarcoating. Be specific and straight to the point and dont yap try to use the minimome word posibal.`,
			},
			{"role": "user", "content": __text},
		},
		"temperature": 0.8,
		"max_tokens":  100, // Adjust as needed
		"stream":      false,
	})

	log.Info(string(requestBody))

	if err != nil {
		log.Error(err.Error())
	}

	resp, err := http.Post("http://localhost:1234/api/v0/chat/completions", "application/json", bytes.NewBuffer(requestBody))
	if err != nil {
		log.Error(err.Error())
	}

	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		log.Error(err.Error())
	}

	var mapBody LLMResponse
	if err := json.Unmarshal(body, &mapBody); err != nil {
		log.Error(err.Error())
	}
	log.Info("\n", string(body))
	// log.Infof("\n %+v", mapBody)
	// log.Infof("\n %+v", mapBody.Choices)
	// log.Infof("\n %+v", mapBody.Choices[0].Message)

	return mapBody.Choices[0].Message.Content, nil
}
