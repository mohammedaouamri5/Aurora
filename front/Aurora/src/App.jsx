import { useEffect, useState } from "react";

const App = () => {
  const [ws, setWs] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8080/ws");
    socket.binaryType = "arraybuffer"; // Handle binary data
    socket.onmessage = (event) => {
      console.log("Audio received from server");
      const receivedBlob = new Blob([event.data], { type: "audio/wav" });
      setAudioBlob(receivedBlob);
    };
    setWs(socket);

    return () => socket.close();
  }, []);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    let chunks = [];

    mediaRecorder.ondataavailable = (event) => {
      chunks.push(event.data);
    };

    mediaRecorder.onstop = () => {
      const recordedBlob = new Blob(chunks, { type: "audio/wav" });
      setAudioBlob(recordedBlob); // Set the recorded blob for playback

      // Play the recorded audio before sending
      const audioURL = URL.createObjectURL(recordedBlob);
      const audio = new Audio(audioURL);
      audio.play();

      // Send to server after playback
      audio.onended = () => {
        sendAudio(recordedBlob);
      };
    };

    mediaRecorder.start();
    setTimeout(() => mediaRecorder.stop(), 5000); // Record for 5 sec
  };

  const sendAudio = (blob) => {
    blob.arrayBuffer().then((buffer) => {
      ws.send(buffer);
      console.log("Audio sent to server");
    });
  };

  return (
    <div>
      <h1>WebSocket Voice Streaming</h1>
      <button onClick={startRecording}>Record, Replay & Send</button>
      {audioBlob && (
        <audio controls src={URL.createObjectURL(audioBlob)} />
      )}
    </div>
  );
};

export default App;
