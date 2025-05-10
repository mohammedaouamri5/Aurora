package ai

import (
	"bytes"
	"encoding/json"
	"errors"
	"io"
	"net/http"
	"regexp"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/mohammedaouamri5/Aurora/utile"
	log "github.com/sirupsen/logrus"
)

/*
	╭    …/kokoro-onnx    main 
	╰&curl -X POST http://127.0.0.1:7860/gradio_api/call/create -s -H "Content-Type: application/json" -d '{                              01:13
	  "data": [
															"Hello!!",
															"af_alloy",
															"en-us",
															"af_alloy"
	]}' \
	  | awk -F'"' '{ print $4}'  \
	  | read EVENT_ID; curl -N http://127.0.0.1:7860/gradio_api/call/create/$EVENT_ID
	event: complete
	data: [{"path": "/tmp/gradio/a0a2c180ef5a89922b0cb5c83c73d284f222d1efb29681c1986c01756eeb1954/audio.wav", "url": "http://127.0.0.1:7860/gradio_api/file=/tmp/gradio/a0a2c180ef5a89922b0cb5c83c73d284f222d1efb29681c1986c01756eeb1954/audio.wav", "size": null, "orig_name": "audio.wav", "mime_type": null, "is_stream": false, "meta": {"_type": "gradio.FileData"}}, "h\u0259l\u02c8o\u028a!!"]
*/

func get_event(__text string) (string, error) {
	type Result struct {
		EventID string `json:"event_id"`
	}
	requestBody, err := json.Marshal(map[string]interface{}{
		"data": []string{__text, "af_alloy", "en-us", "af_alloy"},
	})

	log.Info(string(requestBody))

	if err != nil {
		log.Error(err)
		return "", err
	}

	resp, err := http.Post("http://127.0.0.1:7860/gradio_api/call/create", "application/json", bytes.NewBuffer(requestBody))
	if err != nil {
		log.Error(err)
		return "", err
	}

	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		log.Error(err)
		return "", err
	}

	var result Result

	err = json.Unmarshal(body, &result)
	if err != nil {
		log.Error(err)
		return "", err
	}

	return result.EventID, nil
}

func parce(str string) string {
	// Step 1: Convert "event: complete" to JSON format
	str = strings.Replace(str, "event: ", "\"event\": \"", 1)
	str = strings.Replace(str, "\ndata: ", "\", \"data\": ", 1)

	// Step 2: Convert remaining JSON-like structure properly
	str = "{" + str + "}"

	// Step 3: Fix double escape sequences
	str = strings.ReplaceAll(str, "\\\"", "\"")

	// Step 4: Fix JSON formatting issues using regex
	re := regexp.MustCompile(`"data": (\[.*])`)
	str = re.ReplaceAllString(str, `"data": $1`)

	return str
}

func get_voice(__event_id string) (map[string]interface{}, error) {
	// var wave Wave

	resp, err := http.Get("http://127.0.0.1:7860/gradio_api/call/create/" + __event_id)
	if err != nil {
		log.Error(err.Error())
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		log.Error(resp.Status)
		return nil, errors.New("the kokono server returned: " + resp.Status)
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		log.Error(err)
		return nil, err
	}
	streamS := strings.Split(string(body), "\n\n")
	__max := 0
	for k, v := range streamS {
		if len(v) > len(streamS[__max]) {
			__max = k
		}
	}

	strBody := parce(streamS[__max])

	log.Info(
		"\n-----------------------------------------------------\n",
		string(body),
		"\n-----------------------------------------------------\n",
	)

	log.Info(
		"\n-----------------------------------------------------\n",
		streamS[__max],
		"\n-----------------------------------------------------\n",
	)

	log.Info(
		"\n-----------------------------------------------------\n",
		strBody,
		"\n-----------------------------------------------------\n",
	)
	var response map[string]interface{}
	err = json.Unmarshal([]byte(strBody), &response)
	if err != nil {
		log.Error(err.Error())
		return nil, err
	}
	return response, nil
}

func Kokoro(ctx *gin.Context, __text string) (string, string, error) {
	// var result  Wave
	log.Info("llm")

	event_id, err := get_event(__text)
	if err != nil {
		log.Error(err.Error())
		return "", "", err
	}
	result, err := get_voice(event_id)
	if err != nil {
		log.Error(err.Error())
		return "", "", err
	}

	__source := result["data"].([]interface{})[0].(map[string]interface{})["path"].(string)
	__sincke, err := utile.NowPath()
	log.Info("\n__source : ", __source, "\n__sincke : ", __sincke)
	if err != nil {
		log.Error(err.Error())
		return "", "", err
	}
	if err := utile.MoveFile(__source, __sincke); err != nil {
		log.Error(err.Error())
		return "", "", err
	}

	PhoniticsOutput := result["data"].([]interface{})[1].(string)
	return __sincke, PhoniticsOutput, nil
}
