import { useState, useEffect, useRef } from "react";
import VideoRecorder from "./VideoRecorder";
import SpeechToTextRecorder from "./SpeechToTextRecorder";
import { ArrowLeft, CheckCircle, Play, RefreshCw, Loader2, Pause, Square, Mic, MicOff, Video, VideoOff, Clock } from "lucide-react";
import { useAxiosPrivate } from "../../utils/axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/Dialog";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { Badge } from "../ui/Badge";
import Button from "../ui/Button";
import Textarea from "../ui/Textarea";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export default function InterviewRecordingModal({ open, setOpen, interviewId, refetch }) {
  const axiosPrivate = useAxiosPrivate();
  const speechRef = useRef(null);
  const videoRecorderRef = useRef(null);

  const [interview, setInterview] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [isCameraTested, setIsCameraTested] = useState(false);
  const [recordings, setRecordings] = useState([]);
  const [isTesting, setIsTesting] = useState(true);
  const [testRecording, setTestRecording] = useState(null);
  const [isFinishing, setIsFinishing] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [canRecord, setCanRecord] = useState(true);
  const [hasRecorded, setHasRecorded] = useState(false);
  const [firstQuestion, setFirstQuestion] = useState(true);
  const [lastQuestion, setLastQuestion] = useState(false);
  
  // Setup states
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isTestingCamera, setIsTestingCamera] = useState(false);
  
  // Recording states
  const [recordingTime, setRecordingTime] = useState(0);
  const [notes, setNotes] = useState("");
  const [liveTranscript, setLiveTranscript] = useState([]);
  const [activeRecordingQuestion, setActiveRecordingQuestion] = useState(null);

  const questions = interview?.interviewQuestions || [];
  const currentQuestion = questions[currentQuestionIndex]?.question;

  useEffect(() => {
    const fetchInterview = async () => {
      if (!interviewId || !open) return;
      
      try {
        const res = await axiosPrivate.get(`/mockinterview/${interviewId}`);
        setInterview(res.data);
        setNotes(res.data.notes || "");
        
        // Initialize answers array
        if (res.data.interviewQuestions) {
          setAnswers(res.data.interviewQuestions.map(q => q.answer || ""));
        }
      } catch (error) {
        console.error("Failed to load interview data", error);
        alert("Unable to load interview data");
        setOpen(false);
      }
    };

    if (open && interviewId) {
      fetchInterview();
    }
  }, [interviewId, open]);

  // Reset states when modal closes
  useEffect(() => {
    if (!open) {
      setInterview(null);
      setCurrentQuestionIndex(0);
      setIsRecording(false);
      setIsCameraTested(false);
      setRecordings([]);
      setIsTesting(true);
      setTestRecording(null);
      setIsFinishing(false);
      setAnswers([]);
      setCanRecord(true);
      setHasRecorded(false);
      setFirstQuestion(true);
      setLastQuestion(false);
      setIsVideoEnabled(true);
      setIsAudioEnabled(true);
      setIsTestingCamera(false);
      setRecordingTime(0);
      setNotes("");
      setLiveTranscript([]);
      setActiveRecordingQuestion(null);
    }
  }, [open]);

  // Timer effect for recording
  useEffect(() => {
    let interval;
    if (isRecording && !isTesting) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording, isTesting]);

  const handleRecordingComplete = (blob) => {
    if (isTesting) {
      setTestRecording(blob);
      setIsCameraTested(true);
      setIsTestingCamera(false);
    } else {
      setFirstQuestion(false);
      setRecordings((prev) => {
        const updated = [...prev];
        updated[currentQuestionIndex] = blob;
        return updated;
      });
    }
    setHasRecorded(true);
    setCanRecord(false);
    setIsRecording(false);
  };

  const handleStartRecording = () => {
    setIsRecording(true);
    setActiveRecordingQuestion(currentQuestionIndex);
    if (speechRef.current) {
      speechRef.current.startListening();
    }
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    setActiveRecordingQuestion(null);
    if (speechRef.current) {
      speechRef.current.stopListening();
    }

    if (currentQuestionIndex === questions.length - 1) {
      setLastQuestion(true);
    }
  };

  const handleStartInterview = () => {
    setIsTesting(false);
    setTestRecording(null);
    setRecordingTime(0);
    
    // Don't reset transcript - instead add the first AI question
    const firstQuestion = questions[0]?.question;
    if (firstQuestion) {
      setLiveTranscript([{
        speaker: 'AI Interviewer',
        text: firstQuestion,
        timestamp: formatTime(0),
        confidence: 1.0
      }]);
    }
  };

  const handleNextQuestion = () => {
    const nextIndex = currentQuestionIndex + 1;
    setCurrentQuestionIndex(nextIndex);
    setCanRecord(true);
    setHasRecorded(false);
    setIsRecording(false);
    
    // Add the next AI question to transcript instead of resetting
    const nextQuestion = questions[nextIndex]?.question;
    if (nextQuestion) {
      setLiveTranscript(prev => [...prev, {
        speaker: 'AI Interviewer',
        text: nextQuestion,
        timestamp: formatTime(recordingTime),
        confidence: 1.0
      }]);
    }
    
    // Reset speech recognition for the new question to avoid mixing answers
    if (speechRef.current) {
      speechRef.current.resetTranscript();
    }
  };

  const handleFinishInterview = async () => {
    setIsFinishing(true);
    try {
      // Ensure we have answers for all questions
      const updatedAnswers = [...answers];
      while (updatedAnswers.length < questions.length) {
        updatedAnswers.push("");
      }

      // Calculate actual duration in minutes (recordingTime is in seconds)
      const actualDuration = Math.ceil(recordingTime / 60);

      // Save interview data with notes and correct duration
      const updateData = {
        notes: notes,
        duration: actualDuration,
        interviewQuestions: questions.map((q, index) => ({
          id: q.id,
          answer: updatedAnswers[index] || "",
          interviewId: parseInt(interviewId)
        }))
      };

      console.log("Sending interview data:", updateData);
      console.log("Answers being sent:", updatedAnswers);
      await axiosPrivate.patch(`/mockinterview/${interviewId}`, updateData);
      if (refetch) refetch();
      setOpen(false);
    } catch (error) {
      console.error("Error saving interview:", error);
      console.log("Error response:", error.response?.data);
      alert("Failed to save interview data: " + (error.response?.data?.title || error.message));
    } finally {
      setIsFinishing(false);
    }
  };

  const handleTestCamera = () => {
    setIsTestingCamera(true);
    if (videoRecorderRef.current) {
      videoRecorderRef.current.startRecording();
    }
  };

  const handleStopTestCamera = () => {
    setIsTestingCamera(false);
    if (videoRecorderRef.current) {
      videoRecorderRef.current.stopRecording();
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle transcript updates
  const handleTranscriptUpdate = (transcript) => {
    if (transcript.trim()) {
      const timestamp = formatTime(recordingTime);
      
      // Update live transcript for display
      setLiveTranscript(prev => {
        const updated = [...prev];
        const lastEntry = updated[updated.length - 1];
        
        // If the last entry is from "You" (same speaker), update it
        if (lastEntry && lastEntry.speaker === 'You') {
          // Update the last entry with new transcript (this handles continuous speech)
          updated[updated.length - 1] = {
            speaker: 'You',
            text: transcript,
            timestamp: lastEntry.timestamp, // Keep original timestamp
            confidence: 0.95
          };
        } else {
          // Add new entry (this happens when starting to speak after AI question)
          updated.push({
            speaker: 'You',
            text: transcript,
            timestamp: timestamp,
            confidence: 0.95
          });
        }
        
        return updated; // Keep full conversation history
      });

      // CRITICAL FIX: Only update answers when actively recording that specific question
      if (activeRecordingQuestion !== null && isRecording) {
        setAnswers(prev => {
          const updated = [...prev];
          // Ensure the array has enough elements
          while (updated.length <= activeRecordingQuestion) {
            updated.push("");
          }
          // Update ONLY the actively recording question's answer
          updated[activeRecordingQuestion] = transcript.trim();
          return updated;
        });
      }
    }
  };

  if (!interview) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <div className="flex items-center justify-center py-8">
            <div className="flex items-center gap-2">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span>Loading interview...</span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Pre-interview setup modal
  if (isTesting) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Interview Setup</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="text-center">
              <p className="text-muted-foreground mb-4">Test your camera and microphone before starting</p>
              
              <div className="w-full max-w-lg mx-auto mb-4">
                <VideoRecorder
                  ref={videoRecorderRef}
                  onRecordingComplete={handleRecordingComplete}
                  isRecording={isTestingCamera}
                  onStartRecording={() => setIsTestingCamera(true)}
                  onStopRecording={() => setIsTestingCamera(false)}
                  isCameraTested={isCameraTested}
                  setIsCameraTested={setIsCameraTested}
                  canRecord={true}
                  firstQuestion={true}
                />
              </div>

              
              <div className="space-y-4">
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Interview Details</h4>
                  <div className="text-sm space-y-1">
                    <p><span className="font-medium">Position:</span> {interview.position}</p>
                    <p><span className="font-medium">Duration:</span> {interview.duration} minutes</p>
                    <p><span className="font-medium">Questions:</span> {questions.length} questions</p>
                  </div>
                </div>



                <Button 
                  onClick={handleStartInterview} 
                  size="lg" 
                  className="w-full"
                  disabled={!isCameraTested}
                >
                  <Play className="w-4 h-4 mr-2" />
                  Start Interview
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Main interview modal
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="h-3 w-3 bg-red-500 rounded-full animate-pulse"></div>
            {interview.position} Interview
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Recording Header */}
          <Card className="bg-red-50 border-red-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="font-medium text-red-700">RECORDING</span>
                  </div>
                  <div className="text-2xl font-mono font-bold">
                    {formatTime(recordingTime)}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button variant="outline" onClick={() => setOpen(false)}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Exit Interview
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Left Column - Video & Transcription */}
            <div className="space-y-4">
              {/* Video Feed */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Video Feed</CardTitle>
                </CardHeader>
                <CardContent>
                  <VideoRecorder
                    ref={videoRecorderRef}
                    onRecordingComplete={handleRecordingComplete}
                    isRecording={isRecording}
                    onStartRecording={handleStartRecording}
                    onStopRecording={handleStopRecording}
                    isCameraTested={true}
                    setIsCameraTested={() => {}}
                    canRecord={canRecord}
                    firstQuestion={firstQuestion}
                  />
                </CardContent>
              </Card>
              
              {/* Live Transcription */}
              <Card className="h-64">
                <CardHeader>
                  <CardTitle className="text-lg">Live Transcription</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-48 overflow-y-auto space-y-3">
                  {/* Full conversation history */}
                  {liveTranscript.map((segment, index) => (
                    <div key={index} className="flex gap-3">
                      <span className="text-xs font-mono text-muted-foreground min-w-[60px]">
                        {segment.timestamp}
                      </span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`font-medium text-sm ${segment.speaker === 'AI Interviewer' ? 'text-primary' : 'text-foreground'}`}>
                            {segment.speaker}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {Math.round(segment.confidence * 100)}%
                          </Badge>
                        </div>
                        <p className="text-sm">{segment.text}</p>
                      </div>
                    </div>
                  ))}
                  
                  {isRecording && (
                    <div className="flex gap-3 animate-pulse">
                      <span className="text-xs font-mono text-muted-foreground min-w-[60px]">
                        {formatTime(recordingTime)}
                      </span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">You</span>
                        </div>
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - AI Interviewer & Controls */}
            <div className="space-y-4">
              {/* AI Interviewer */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">AI Interviewer</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <div className="w-24 h-24 shrink-0">
                      <DotLottieReact
                        src="https://lottie.host/c6f9b304-f3b8-4dea-b810-ac2d3e958d83/Xy3NrWVSF2.lottie"
                        loop
                        autoplay
                        className="w-full h-full"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="relative">
                        <div className="bg-white  border rounded-xl shadow p-3">
                          <p className="text-sm">
                            <span className="font-medium">Question {currentQuestionIndex + 1}: </span>
                            {currentQuestion}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Button
                    onClick={handleNextQuestion}
                    disabled={currentQuestionIndex >= questions.length - 1}
                    variant="outline"
                    className="w-full"
                  >
                    Next Question
                  </Button>

                  <div className="text-center text-sm text-muted-foreground">
                    Question {currentQuestionIndex + 1} of {questions.length}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Notes */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add notes during the interview..."
                    rows={4}
                    className="resize-none"
                  />
                </CardContent>
              </Card>

              {/* Debug: Show collected answers */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Debug: Collected Answers</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm space-y-2">
                    {answers.map((answer, index) => (
                      <div key={index}>
                        <span className="font-medium">Q{index + 1}:</span> {answer || "No answer yet"}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Finish Interview */}
              {lastQuestion && (
                <Card className="border-green-200 bg-green-50">
                  <CardContent className="p-4 text-center">
                    <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <p className="text-green-800 font-medium mb-3">Interview Complete!</p>
                    <Button 
                      onClick={handleFinishInterview}
                      disabled={isFinishing}
                      className="w-full"
                    >
                      {isFinishing ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Finish Interview
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Hidden Speech to Text Component */}
          <div className="hidden">
            <SpeechToTextRecorder
              ref={speechRef}
              onTranscriptUpdate={handleTranscriptUpdate}
              onTranscriptComplete={handleTranscriptUpdate}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
