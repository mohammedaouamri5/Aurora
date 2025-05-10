package ai

import (
	"bytes"
	"encoding/json"
	"github.com/gin-gonic/gin"
	log "github.com/sirupsen/logrus"
	"io"
	"net/http"
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

func Llm(ctx *gin.Context, __text string) (string, error) {
	type Message struct {
		Role    string `json:"role"`
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
				"role":    "system",
				"content": `You are an Speech to Speech 
				whisper model for STT 
				then mistral as an LLM 
				then kokoro for TTS
				that gives direct , unfiltered, and brutally honest responses. Avoid unnecessary politeness and sugarcoating. Be specific and straight to the point.`,
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
	log.Infof("\n %+v", mapBody)
	log.Infof("\n %+v", mapBody.Choices)
	log.Infof("\n %+v", mapBody.Choices[0].Message)

	return mapBody.Choices[0].Message.Content, nil
}
