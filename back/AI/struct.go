package ai 




type Wave struct {
	AudioInput string `json:"audio_input"`
	TextInput  string `json:"text_input"`
	AudioOutput string `json:"audio_output"`
	TextOutput  string `json:"text_output"`
	PhoniticsOutput string `json:"phonitics_output"`
}
