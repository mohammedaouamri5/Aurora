
import { useState } from "react";

const Conversation = () => {

  const [audioBlob, setAudioBlob] = useState(null);
  const [receivedAudioURL, setReceivedAudioURL] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);

  const startRecording = async () => {
    setReceivedAudioURL(null); // Clear previous processed audio

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    setMediaRecorder(recorder);

    let chunks = [];
    let silenceTimer = null;
    let audioContext = new AudioContext();
    let analyser = audioContext.createAnalyser();
    let source = audioContext.createMediaStreamSource(stream);
    source.connect(analyser);
    analyser.fftSize = 512;
    let bufferLength = analyser.frequencyBinCount;
    let dataArray = new Uint8Array(bufferLength);

    recorder.ondataavailable = (event) => {
      chunks.push(event.data);
    };

    const checkSilence = () => {
      analyser.getByteFrequencyData(dataArray);
      let averageVolume = dataArray.reduce((a, b) => a + b) / bufferLength;

      if (averageVolume < 10) {
        if (!silenceTimer) {
          silenceTimer = setTimeout(() => {
            console.log("Silence detected, stopping recording...");
            stopRecording();
          }, 5500); // Stop after 5.5 sec of silence
        }
      } else {
        if (silenceTimer) {
          clearTimeout(silenceTimer);
          silenceTimer = null;
        }
      }

      if (isRecording) {
        requestAnimationFrame(checkSilence);
      }
    };

    recorder.onstop = () => {
      setIsRecording(false);
      stream.getTracks().forEach((track) => track.stop());
      audioContext.close();

      const recordedBlob = new Blob(chunks, { type: "audio/wav" });
      setAudioBlob(recordedBlob);

      sendAudio(recordedBlob);
    };

    setIsRecording(true);
    recorder.start();
    checkSilence();
  };

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
      receivedAudioURL(null )
    }
  };

  const handleButtonClick = () => {
    if (isRecording) {
      stopRecording();
  } else {
      startRecording();
    }
  };

  const sendAudio = async (blob) => {
    const formData = new FormData();
    formData.append("file", blob, "recording.wav");

    try {
      const response = await fetch("https://100.84.234.49:8443/audio", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      console.log("Upload response:", data);

      if (data.audio) {
        // Convert Base64 response to Blob
        const byteCharacters = atob(data.audio);
        const byteArrays = [];
        for (let i = 0; i < byteCharacters.length; i++) {
          byteArrays.push(byteCharacters.charCodeAt(i));
        }
        const processedAudioBlob = new Blob([new Uint8Array(byteArrays)], { type: "audio/wav" });

        // Create URL for playback
        const processedAudioURL = URL.createObjectURL(processedAudioBlob);
        setReceivedAudioURL(processedAudioURL);

        // Play the processed audio automatically
        const audio = new Audio(processedAudioURL);
        audio.play();
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  return (
    <div>
      <h1>Voice Recorder</h1>
      <button onClick={handleButtonClick}>
        {isRecording ? "Stop Recording" : "Start Recording"}
      </button>

      {receivedAudioURL ? (
        <div>
          <h3>Processed Audio:</h3>
          <audio controls src={receivedAudioURL} />
        </div>
      ) : audioBlob ? (
        <div>
          <h3>Recorded Audio:</h3>
          <audio controls src={URL.createObjectURL(audioBlob)} />
        </div>
      ) : null}
    </div>
  );
};

export default Conversation;
