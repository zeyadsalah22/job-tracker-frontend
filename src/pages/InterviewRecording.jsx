import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import VideoRecorder from "../components/interviews/VideoRecorder";
import { ArrowLeft, CheckCircle } from "lucide-react";

export default function InterviewRecording() {
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [isCameraTested, setIsCameraTested] = useState(false);
  const [recordings, setRecordings] = useState([]);

  // Static data for demonstration
  const questions = [
    "Tell me about yourself and your experience.",
    "What are your greatest strengths and weaknesses?",
    "Why do you want to work for this company?",
    "Where do you see yourself in 5 years?",
    "How do you handle stress and pressure?",
  ];

  const handleRecordingComplete = (blob) => {
    setRecordings((prev) => [...prev, blob]);
    setCurrentQuestionIndex((prev) => prev + 1);
    setIsRecording(false);
  };

  const handleStartRecording = () => {
    setIsRecording(true);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
  };

  const handleFinishInterview = () => {
    // TODO: Save all recordings and interview data
    console.log("Interview completed with recordings:", recordings);
    navigate("/interviews");
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
          {/* Questions Panel */}
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

          {/* Video Recording Panel */}
          <div className="w-2/3 flex flex-col">
            <div className="bg-gray-50 p-4 rounded-lg h-full">
              <h2 className="text-lg font-medium mb-4">
                {!isCameraTested
                  ? "Test Your Camera & Microphone"
                  : currentQuestion
                  ? `Question ${currentQuestionIndex + 1} of ${questions.length}`
                  : "Interview Complete"}
              </h2>

              <VideoRecorder
                onRecordingComplete={handleRecordingComplete}
                isRecording={isRecording}
                onStartRecording={handleStartRecording}
                onStopRecording={handleStopRecording}
                isCameraTested={isCameraTested}
                setIsCameraTested={setIsCameraTested}
              />

              {isCameraTested && currentQuestion && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-2">Current Question:</h3>
                  <p className="text-gray-700">{currentQuestion}</p>
                </div>
              )}

              {!currentQuestion && (
                <div className="mt-6 flex justify-center">
                  <button
                    onClick={handleFinishInterview}
                    className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
                  >
                    Finish Interview
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
} 