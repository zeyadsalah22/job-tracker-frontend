// components/interviews/SpeechToTextRecorder.jsx
import { useEffect, useRef, useImperativeHandle, forwardRef, useState } from "react";

const SpeechToTextRecorder = forwardRef(({ onTranscriptComplete }, ref) => {
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window)) {
      alert("Your browser does not support Speech Recognition. Use Chrome or Edge.");
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      let finalTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      setTranscript(finalTranscript);
    };

    recognition.onerror = (e) => {
      console.error("Speech recognition error:", e);
    };

    recognitionRef.current = recognition;
  }, []);

  useImperativeHandle(ref, () => ({
    startListening() {
      setTranscript("");
      recognitionRef.current.start();
    },
    stopListening() {
      recognitionRef.current.stop();
      if (onTranscriptComplete && transcript.trim()) {
        onTranscriptComplete(transcript.trim());
      }
    },
    resetTranscript() {
      setTranscript("");
    },
  }));

  return (
    <div className="bg-gray-100 p-4 rounded min-h-[80px] text-sm mt-2">
      {transcript || "Transcript will appear here."}
    </div>
  );
});

export default SpeechToTextRecorder;
