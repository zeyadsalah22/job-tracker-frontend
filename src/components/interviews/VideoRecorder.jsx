import { useImperativeHandle, useState, useRef, useEffect, forwardRef } from "react";
import { Video, Mic, MicOff, VideoOff, Square, Circle } from "lucide-react";

const VideoRecorder = forwardRef(({ 
  onRecordingComplete, 
  isRecording, 
  onStartRecording, 
  onStopRecording, 
  isCameraTested, 
  setIsCameraTested,
  canRecord,
  firstQuestion
}, ref) => {
  const [stream, setStream] = useState(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isMicOn, setIsMicOn] = useState(false);
  // const [firstQuestion, setFirstQuestion] = useState(true); // Track if it's the first question
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setIsCameraOn(true);
      setIsMicOn(true);
      setIsCameraTested(true);
    } catch (error) {
      console.error("Error accessing camera and microphone:", error);
      alert("Please allow camera and microphone access to continue.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      // Stop all tracks
      stream.getTracks().forEach(track => {
        track.stop();
        track.enabled = false;
      });
      
      // Clear the stream
      setStream(null);
      
      // Clear the video element
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      
      // Reset states
      setIsCameraOn(false);
      setIsMicOn(false);
      setIsCameraTested(false);
      
      // Release media devices
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        mediaRecorderRef.current.stop();
      }
      
      // Clear any remaining chunks
      chunksRef.current = [];
      
      // Reset the media recorder
      mediaRecorderRef.current = null;
    }
  };

  useImperativeHandle(ref, () => ({
    stream,
    stopCamera,
  }));

  const toggleCamera = () => {
    if (isCameraOn) {
      stream.getVideoTracks().forEach((track) => (track.enabled = false));
      setIsCameraOn(false);
    } else {
      stream.getVideoTracks().forEach((track) => (track.enabled = true));
      setIsCameraOn(true);
    }
  };

  const toggleMic = () => {
    if (isMicOn) {
      stream.getAudioTracks().forEach((track) => (track.enabled = false));
      setIsMicOn(false);
    } else {
      stream.getAudioTracks().forEach((track) => (track.enabled = true));
      setIsMicOn(true);
    }
  };

  const startRecording = () => {
    if (!stream) return;

    chunksRef.current = [];
    mediaRecorderRef.current = new MediaRecorder(stream);

    mediaRecorderRef.current.ondataavailable = (e) => {
      if (e.data.size > 0) {
        chunksRef.current.push(e.data);
      }
    };

    mediaRecorderRef.current.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: "video/webm" });
      onRecordingComplete(blob);
    };

    mediaRecorderRef.current.start();
    onStartRecording();
    // setFirstQuestion(false); // Set to false after first recording
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
      onStopRecording();
    }
  };

  // Cleanup function to stop camera when component unmounts
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <div className="relative w-full aspect-video bg-gray-900 rounded-lg overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
        />
        {!stream && (
          <div className="absolute inset-0 flex items-center justify-center text-white">
            Camera Preview
          </div>
        )}
      </div>

      <div className="flex justify-center gap-4">
        {!stream ? (
          <button
            onClick={startCamera}
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
          >
            Test Camera & Mic
          </button>
        ) : (
          <>
            <button
              onClick={toggleCamera}
              className={`p-2 rounded-lg ${
                isCameraOn ? "bg-green-500" : "bg-red-500"
              } text-white hover:opacity-90 transition-colors`}
            >
              {isCameraOn ? <Video size={20} /> : <VideoOff size={20} />}
            </button>
            <button
              onClick={toggleMic}
              className={`p-2 rounded-lg ${
                isMicOn ? "bg-green-500" : "bg-red-500"
              } text-white hover:opacity-90 transition-colors`}
            >
              {isMicOn ? <Mic size={20} /> : <MicOff size={20} />}
            </button>
            {!isRecording ? (
              <button
                onClick={startRecording}
                className={`bg-green-500 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                            !canRecord && !firstQuestion ? "opacity-50 cursor-not-allowed" : "hover:bg-green-600"
                }`}
                disabled={!canRecord && !firstQuestion}
              >
                <Circle size={20} />
                Start Recording
              </button>
            ) : (
              <button
                onClick={stopRecording}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
              >
                <Square size={20} />
                Stop Recording
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
});

export default VideoRecorder;