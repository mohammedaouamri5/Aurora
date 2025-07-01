package utile

import (
	"fmt"
	"time"
)

func PrintUtile(p_data Wave) {

	// AudioInput string `json:"audio_input"`
	// TextInput  string `json:"text_input"`
	// AudioOutput string `json:"audio_output"`
	// TextOutput  string `json:"text_output"`
	// PhoniticsOutput string `json:"phonitics_output"`

	println("\t--> INPUT  TEXT :")
	println(p_data.TextInput)

	println("\t--> OUTPUT TEXT :")
	println(p_data.TextOutput)

	println("\t--> OUTPUT Phonitic :")
	println(p_data.TextOutput)
}

func PrintTimestamp(t time.Duration) string {
	return fmt.Sprintf("%02d:%02d:%02d,%03d", t/time.Hour, (t%time.Hour)/time.Minute, (t%time.Minute)/time.Second, (t%time.Second)/time.Millisecond)
}
