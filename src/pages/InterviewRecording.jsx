import { useState, useEffect, useRef} from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../components/Layout";
import VideoRecorder from "../components/interviews/VideoRecorder";
import SpeechToTextRecorder from "../components/interviews/SpeechToTextRecorder";
import { ArrowLeft, CheckCircle, Play, RefreshCw, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAxiosPrivate } from "../utils/axios";

export default function InterviewRecording() {
  const { interviewId } = useParams();
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const speechRef = useRef(null);
  const videoRecorderRef = useRef(null);

  const [interview, setInterview] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [isCameraTested, setIsCameraTested] = useState(false);
  const [recordings, setRecordings] = useState([]);
  const [isTesting, setIsTesting] = useState(true);
  const [testRecording, setTestRecording] = useState(null);
  // const [videoRecorderRef, setVideoRecorderRef] = useState(null);
  const [isFinishing, setIsFinishing] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [canRecord, setCanRecord] = useState(true); // Controls if "Start Recording" is enabled
  const [hasRecorded, setHasRecorded] = useState(false); // Indicates if a question has been recorded
  const [firstQuestion, setFirstQuestion] = useState(true);
  const [lastQestion, setLastQuestions] = useState(false);

  const questions = interview?.interviewQuestions || [];
  const currentQuestion = questions[currentQuestionIndex]?.question;

  useEffect(() => {
    const fetchInterview = async () => {
      try {
        const res = await axiosPrivate.get(`/mockinterview/${interviewId}`);
        setInterview(res.data);
      } catch (error) {
        console.error("Failed to load interview data", error);
        alert("Unable to load interview data");
        navigate("/interviews");
      }
    };

    if (interviewId) fetchInterview();
  }, [interviewId]);

  const handleRecordingComplete = (blob) => {
    if (isTesting) {
      setTestRecording(blob);
    } else {
      setFirstQuestion(false); // After the first question, this will be false
      setRecordings((prev) => {
        const updated = [...prev];
        updated[currentQuestionIndex] = blob; // overwrite instead of pushing
        return updated;
      });
    }
    setHasRecorded(true); // Mark that a recording has been made
    setCanRecord(false); // Disable further recording
    setIsRecording(false);

  };

  const handleStartRecording = () => {
    // call speech to text start listening
    setIsRecording(true);
    if (speechRef.current) {
      speechRef.current.startListening();
    }
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    if (speechRef.current) {
      speechRef.current.stopListening();
    }

    if(currentQuestionIndex == questions.length - 1) {
        setLastQuestions(true); // If it's the last question, prepare to finish the interview
      }
  };

  const handleStartInterview = () => {
    setIsTesting(false);
    setTestRecording(null);
    if(speechRef.current) {
      speechRef.current.resetTranscript(); // Reset the transcript when starting the interview
    }
  };

  const handleNextQuestion = () => {
    // if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setCanRecord(true); // Enable recording for the next question
      setHasRecorded(false); // Reset recorded state for the next question
      setIsRecording(false); // Stop recording for the current question
      if (speechRef.current) {
        speechRef.current.stopListening(); // Stop speech recognition for the current question
        speechRef.current.resetTranscript(); // Reset the transcript for the next question
      }

  };
  const handleRetest = () => {
    setTestRecording(null);
  };

  const handleFinishInterview = async () => {
    setIsFinishing(true);

    if (videoRecorderRef.current?.stopCamera) {
      videoRecorderRef.current.stopCamera();
    }

    

    const updatedQuestions = questions.map((q, index) => ({
      id: q.id,
      interviewId: parseInt(interviewId),
      answer: answers[index] || ""
    }));

    // duration = timenow - interview.startDate
    const duration = Math.floor((new Date() - new Date(interview.startDate)) / 60000); // duration in minutes
    const payload = {
      userId: interview.userId,
      companyId: interview.companyId,
      applicationId: interview.applicationId,
      position: interview.position,
      jobDescription: interview.jobDescription,
      feedback: "",
      startDate: interview.startDate,
      duration: duration,
      interviewQuestions: updatedQuestions
    };

    try {
      await axiosPrivate.patch(`/mockinterview/${interviewId}`, payload);
      navigate(`/interviews/${interviewId}`);
    } catch (error) {
      console.error("❌ Failed to save interview answers", error);
      alert("Failed to save interview. Check console for details.");
    } finally {
      setIsFinishing(false);
    }
  };

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
          {!isTesting && (
            <div className="w-1/3 flex flex-col">
              <div className="bg-gray-50 p-4 rounded-lg h-full">
                <h2 className="text-lg font-medium mb-4">Interview Questions</h2>
                <div className="space-y-4">
                  {questions.map((q, index) => (
                    <div
                      key={q.id}
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
                        <span className="font-medium">Question {index + 1}:</span> {q.question}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

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
                ref={videoRecorderRef}
                onRecordingComplete={handleRecordingComplete}
                isRecording={isRecording}
                onStartRecording={handleStartRecording}
                onStopRecording={handleStopRecording}
                isCameraTested={isCameraTested}
                setIsCameraTested={setIsCameraTested}
                canRecord={canRecord}
                firstQuestion={firstQuestion}
              />

              {!isTesting && currentQuestion && (
                <SpeechToTextRecorder
                  ref={speechRef}
                  onTranscriptComplete={(text) => {
                    setAnswers((prev) => {
                      const updated = [...prev];
                      updated[currentQuestionIndex] = text;
                      return updated;
                    });
                  }}
                />
              )}
              {!isTesting && 
              currentQuestion && 
              hasRecorded && 
              !firstQuestion && 
              !lastQestion && (
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={handleNextQuestion}
                    // disabled={!canRecord && }
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                  >
                    Next Question
                  </button>
                </div>
              )}
              {!isTesting && hasRecorded && !firstQuestion && (
                <div className="flex justify-center mt-4">
                  <button
                    onClick={() => {
                      setCanRecord(true);
                      setHasRecorded(false);
                    }}
                    className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors"
                  >
                    Re-test
                  </button>
                </div>
              )}

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

              {!isTesting && lastQestion && (
                <div className="mt-6 flex justify-end">
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
