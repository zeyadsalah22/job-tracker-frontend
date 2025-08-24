import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Minimize2 } from 'lucide-react';
import useUserStore from '../../store/user.store';
import useChatStore from '../../store/chat.store';
import { useAxiosPrivate } from '../../utils/axios';
import LottieRobot from './LottieRobot';
import { useLocation } from 'react-router-dom';

const FloatingChatBot = () => {
  const user = useUserStore((state) => state.user);
  const axiosPrivate = useAxiosPrivate();
  const location = useLocation();
  
  // Chat store state
  const {
    sessionId,
    messages,
    isInitialized,
    isOpen,
    isLoading,
    isStreaming,
    setSessionId,
    addMessage,
    updateMessage,
    setIsInitialized,
    setIsOpen,
    setIsLoading,
    setIsStreaming,
    resetChat,
    initializeWithWelcome
  } = useChatStore();

  // Local state for input and page messages
  const [inputMessage, setInputMessage] = useState('');
  const [introMessage, setIntroMessage] = useState(null);
  const messagesEndRef = useRef(null);
  const hideTimerRef = useRef(null);

  // Page intro messages
  const pageIntro = {
    '/dashboard': 'View your application progress and job statistics.',
    '/applications': 'Manage and track your job applications.',
    '/companies': 'Browse and research potential employers.',
    '/user-companies': 'Manage your company preferences.',
    '/employees': 'View employee profiles and information.',
    '/questions': 'Practice interview questions and get feedback.',
    '/interviews': 'Schedule and track your interviews.',
    '/resume-matching': 'Optimize your resume for better job matches.',
    '/profile': 'Update your profile and preferences.'
  };

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle page intro messages
  useEffect(() => {
    const path = location.pathname;
    const msg = pageIntro[path];
    
    if (msg && !isOpen) {
      setIntroMessage(msg);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
      hideTimerRef.current = setTimeout(() => setIntroMessage(null), 4000);
    } else {
      setIntroMessage(null);
    }
    
    return () => {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, [location.pathname, isOpen]);

  // Initialize chat session
  const initializeChat = async () => {
    console.log('Initializing chat...', { user, userId: user?.userId });
    
    if (!user?.userId) {
      console.log('No user ID found, cannot initialize chat');
      return;
    }
    
    setIsLoading(true);
    try {
      console.log('Making API call to initialize chat...');
      const response = await axiosPrivate.post(`/chatbot/initialize/${user.userId}`);
      console.log('Initialize chat response:', response.data);
      
      // Use store method to initialize with welcome message
      initializeWithWelcome(response.data.session_id);
    } catch (error) {
      console.error('Error initializing chat:', error);
      console.error('Error details:', error.response?.data);
      alert('Failed to initialize chat. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Send message with simple response
  const sendMessage = async () => {
    if (!inputMessage.trim() || !sessionId || isStreaming) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage.trim(),
      timestamp: new Date().toISOString()
    };

    console.log('Sending message:', { sessionId, message: userMessage.content });

    addMessage(userMessage);
    setInputMessage('');
    setIsStreaming(true);

    // Create bot message placeholder
    const botMessageId = Date.now() + 1;
    const botMessage = {
      id: botMessageId,
      type: 'bot',
      content: '',
      timestamp: new Date().toISOString(),
      isComplete: false
    };

    addMessage(botMessage);

    try {
      console.log('Making API call to send message...');
      
      const response = await axiosPrivate.post('/chatbot/send-message', {
        sessionId: sessionId,
        message: userMessage.content
      });

      console.log('Send message response:', response.data);

      // Handle simple JSON response
      if (response.data && response.data.response) {
        updateMessage(botMessageId, {
          content: response.data.response,
          isComplete: true
        });
      } else {
        // Handle unexpected response format
        updateMessage(botMessageId, {
          content: 'Sorry, I received an unexpected response format.',
          isComplete: true,
          isError: true
        });
      }
    } catch (error) {
      console.error('Error sending message:', error);
      console.error('Error details:', error.response?.data);
      
      let errorMessage = 'Sorry, there was an error processing your message. Please try again.';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }
      
      updateMessage(botMessageId, {
        content: errorMessage,
        isComplete: true,
        isError: true
      });
    } finally {
      setIsStreaming(false);
    }
  };

  // Close chat session
  const closeChat = async () => {
    console.log('Close chat clicked, sessionId:', sessionId);
    
    if (!sessionId) {
      console.log('No session ID, skipping API call');
      // Still reset the UI state even if no session
      resetChat();
      return;
    }

    try {
      console.log('Making API call to close chat...');
      const response = await axiosPrivate.post('/chatbot/close-chat', { sessionId });
      console.log('Close chat response:', response.data);

      // Reset state using store
      resetChat();
      console.log('Chat state reset successfully');
    } catch (error) {
      console.error('Error closing chat:', error);
      console.error('Error details:', error.response?.data);
      
      // Reset state even if API call fails
      resetChat();
      console.log('Chat state reset after error');
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Handle opening chat
  const handleOpenChat = () => {
    setIsOpen(true);
    setIntroMessage(null); // Hide intro message when chat opens
  };

  // Hide robot when chat is open
  if (isOpen) {
    return (
      /* Chat Panel */
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="fixed bottom-20 right-6 w-96 h-[28rem] bg-white shadow-2xl z-50 flex flex-col rounded-lg border border-gray-200"
        >
          {/* Chat Header */}
          <div className="flex items-center justify-between p-4 bg-primary text-white rounded-t-lg">
            <div className="flex items-center gap-3">
              <MessageCircle size={20} />
              <h3 className="font-semibold text-sm">Job Assistant</h3>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white/20 rounded transition-colors"
              >
                <Minimize2 size={16} />
              </button>
              <button
                onClick={closeChat}
                className="p-1 hover:bg-white/20 rounded transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Chat Content */}
          {!isInitialized ? (
            <div className="flex-1 flex flex-col items-center justify-center p-4 text-center">
              <MessageCircle size={40} className="text-primary/20 mb-3" />
              <h4 className="font-semibold text-gray-800 mb-2 text-sm">Welcome to your personal job assistant!</h4>
              <p className="text-xs text-gray-600 mb-4">I can help you with questions about your job applications, companies, interview status, and more.</p>
              <button 
                onClick={initializeChat} 
                disabled={isLoading}
                className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg transition-all disabled:opacity-50 text-sm"
              >
                {isLoading ? 'Getting Ready...' : 'Start Chat'}
              </button>
            </div>
          ) : (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-3 space-y-3">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] p-2 rounded-lg text-sm ${
                        message.type === 'user'
                          ? 'bg-primary text-white'
                          : message.isError
                          ? 'bg-red-50 text-red-800 border border-red-200'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      <div className="whitespace-pre-wrap">
                        {message.content}
                        {message.type === 'bot' && !message.isComplete && (
                          <span className="inline-block ml-2 animate-pulse">●●●</span>
                        )}
                      </div>
                      <div className="text-xs opacity-70 mt-1">
                        {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </motion.div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-3 border-t border-gray-200 rounded-b-lg">
                <div className="flex gap-2">
                  <textarea
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask me about your applications..."
                    disabled={isStreaming}
                    rows="2"
                    className="flex-1 resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary min-h-[2.5rem]"
                  />
                  <button 
                    onClick={sendMessage}
                    disabled={!inputMessage.trim() || isStreaming}
                    className="bg-primary hover:bg-primary/90 text-white p-2 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed self-end"
                  >
                    <Send size={16} />
                  </button>
                </div>
              </div>
            </>
          )}
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2 select-none group">
      {/* Intro Message */}
      {introMessage && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="mb-1 bg-white border border-primary/20 shadow-lg rounded-xl px-3 py-2 text-sm max-w-xs"
        >
          {introMessage}
        </motion.div>
      )}

      {/* Lottie Robot */}
      <div className="flex items-center gap-2">
        <div className="relative" onClick={handleOpenChat}>
          <LottieRobot 
            size="lg"
            className="cursor-pointer hover:scale-110 transition-transform duration-300"
          />
        </div>
      </div>
    </div>
  );
};

export default FloatingChatBot;
