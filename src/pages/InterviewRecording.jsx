import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import VideoRecorder from "../components/interviews/VideoRecorder";
import { ArrowLeft, CheckCircle, Play, RefreshCw, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function InterviewRecording() {
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [isCameraTested, setIsCameraTested] = useState(false);
  const [recordings, setRecordings] = useState([]);
  const [isTesting, setIsTesting] = useState(true);
  const [testRecording, setTestRecording] = useState(null);
  const [videoRecorderRef, setVideoRecorderRef] = useState(null);
  const [isFinishing, setIsFinishing] = useState(false);

  // Static data for demonstration
  const questions = [
    "Tell me about yourself and your experience.",
    "What are your greatest strengths and weaknesses?",
    "Why do you want to work for this company?",
    "Where do you see yourself in 5 years?",
    "How do you handle stress and pressure?",
  ];

  const handleRecordingComplete = (blob) => {
    if (isTesting) {
      setTestRecording(blob);
    } else {
      setRecordings((prev) => [...prev, blob]);
      setCurrentQuestionIndex((prev) => prev + 1);
    }
    setIsRecording(false);
  };

  const handleStartRecording = () => {
    setIsRecording(true);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
  };

  const handleStartInterview = () => {
    setIsTesting(false);
    setTestRecording(null);
  };

  const handleRetest = () => {
    setTestRecording(null);
  };

  const handleFinishInterview = () => {
    setIsFinishing(true);
    // Stop the camera before navigating away
    if (videoRecorderRef) {
      videoRecorderRef.stopCamera();
    }
    // Simulate loading time
    setTimeout(() => {
      // TODO: Save all recordings and interview data
      console.log("Interview completed with recordings:", recordings);
      navigate("/interviews/1"); // Navigate to the interview view page
    }, 2000);
  };

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <Layout>
      <div className="bg-white rounded-lg h-full flex flex-col p-4">
        <div className="flex items-center gap-2 pb-4 border-b-2">
          <button
            onClick={() => navigate("/interviews")}
            className="py-2 px-4 hover:bg-[#f1f1f1] transition-all w-fit rounded-lg flex items-center gap-2 text-sm"
          >
            <ArrowLeft size={19} />
          </button>
          <h1 className="text-lg font-semibold">Interview Recording</h1>
        </div>

        <div className="flex gap-6 mt-6 h-full">
          {/* Questions Panel - Only show when not testing */}
          {!isTesting && (
            <div className="w-1/3 flex flex-col">
              <div className="bg-gray-50 p-4 rounded-lg h-full">
                <h2 className="text-lg font-medium mb-4">Interview Questions</h2>
                <div className="space-y-4">
                  {questions.map((question, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg ${
                        index === currentQuestionIndex
                          ? "bg-blue-50 border border-blue-200"
                          : index < currentQuestionIndex
                          ? "bg-green-50 border border-green-200"
                          : "bg-gray-50 border border-gray-200"
                      }`}
                    >
                      <div
                        className={`${
                          index === currentQuestionIndex
                            ? "text-gray-900"
                            : index < currentQuestionIndex
                            ? "text-gray-700"
                            : "text-gray-400 blur-sm"
                        }`}
                      >
                        <span className="font-medium">Question {index + 1}:</span>{" "}
                        {question}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Video Recording Panel */}
          <div className={`${isTesting ? "w-full" : "w-2/3"} flex flex-col`}>
            <div className="bg-gray-50 p-4 rounded-lg h-full">
              <h2 className="text-lg font-medium mb-4">
                {isTesting
                  ? "Test Your Camera & Microphone"
                  : currentQuestion
                  ? `Question ${currentQuestionIndex + 1} of ${questions.length}`
                  : "Interview Complete"}
              </h2>

              <VideoRecorder
                ref={setVideoRecorderRef}
                onRecordingComplete={handleRecordingComplete}
                isRecording={isRecording}
                onStartRecording={handleStartRecording}
                onStopRecording={handleStopRecording}
                isCameraTested={isCameraTested}
                setIsCameraTested={setIsCameraTested}
              />

              {isTesting && testRecording && (
                <div className="mt-6 flex flex-col items-center gap-4">
                  <video
                    src={URL.createObjectURL(testRecording)}
                    controls
                    className="w-full max-w-lg rounded-lg"
                  />
                  <div className="flex gap-4">
                    <button
                      onClick={handleRetest}
                      className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors flex items-center gap-2"
                    >
                      <RefreshCw size={18} />
                      Retest
                    </button>
                    <button
                      onClick={handleStartInterview}
                      className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
                    >
                      <Play size={18} />
                      Start Interview
                    </button>
                  </div>
                </div>
              )}

              {!isTesting && currentQuestion && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-2">Current Question:</h3>
                  <p className="text-gray-700">{currentQuestion}</p>
                </div>
              )}

              {!isTesting && !currentQuestion && (
                <div className="mt-6 flex justify-center">
                  <AnimatePresence>
                    {isFinishing ? (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="flex flex-col items-center gap-4"
                      >
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        >
                          <Loader2 size={40} className="text-primary" />
                        </motion.div>
                        <p className="text-gray-600">Generating feedback...</p>
                      </motion.div>
                    ) : (
                      <motion.button
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        onClick={handleFinishInterview}
                        className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
                      >
                        <CheckCircle size={18} />
                        Finish Interview
                      </motion.button>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
} 