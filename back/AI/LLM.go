package ai

import (
	"bytes"
	"encoding/json"
	"io"
	"net/http"
	"github.com/gin-gonic/gin"
	log "github.com/sirupsen/logrus"
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
	log.Info("llm")

	requestBody, err := json.Marshal(map[string]interface{}{
		"model": "granite-3.0-2b-instruct",
		"messages": []map[string]string{
			{"role": "system", "content": "Your name is Aurora, Your a girl smart and funny , you like dark hummor , your are Unsensord LLM "},
			{"role": "user", "content": __text},
		},
		"temperature": 0.7,
		"max_tokens":  -1,
		"stream":      false,
	})

	if err != nil {
		log.Fatal(err)
	}

	resp, err := http.Post("http://localhost:1234/api/v0/chat/completions", "application/json", bytes.NewBuffer(requestBody))
	if err != nil {
		log.Fatal(err)
	}

	defer resp.Body.Close()


	body, err := io.ReadAll(resp.Body)
	if err != nil {
		log.Fatal(err)
	}

	log.Info(string(body))

	return "", nil
}
