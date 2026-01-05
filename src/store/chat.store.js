import { create } from "zustand";
import { persist } from "zustand/middleware";

const useChatStore = create(
  persist(
    (set, get) => ({
      // Chat state
      sessionId: null,
      messages: [],
      isInitialized: false,
      isOpen: false,
      isLoading: false,
      isStreaming: false,

      // Actions
      setSessionId: (sessionId) => set({ sessionId }),
      setMessages: (messages) => set({ messages }),
      addMessage: (message) => set((state) => ({ 
        messages: [...state.messages, message] 
      })),
      updateMessage: (messageId, updates) => set((state) => ({
        messages: state.messages.map(msg => 
          msg.id === messageId ? { ...msg, ...updates } : msg
        )
      })),
      setIsInitialized: (isInitialized) => set({ isInitialized }),
      setIsOpen: (isOpen) => set({ isOpen }),
      setIsLoading: (isLoading) => set({ isLoading }),
      setIsStreaming: (isStreaming) => set({ isStreaming }),

      // Close chat (minimize - keep session)
      closeChat: () => set({
        isOpen: false,
      }),

      // Reset chat (clear all - for logout or manual clear)
      resetChat: () => set({
        sessionId: null,
        messages: [],
        isInitialized: false,
        isOpen: false,
        isLoading: false,
        isStreaming: false,
      }),

      // Initialize with welcome message
      initializeWithWelcome: (sessionId) => set({
        sessionId,
        isInitialized: true,
        messages: [{
          id: Date.now(),
          type: 'bot',
          content: 'Hello! I\'m your job application assistant. I can help you with questions about your applications, companies, and interview progress. What would you like to know?',
          timestamp: new Date().toISOString()
        }]
      }),
    }),
    {
      name: "chat-storage", // localStorage key
      // Only persist certain fields, not loading states
      partialize: (state) => ({
        sessionId: state.sessionId,
        messages: state.messages,
        isInitialized: state.isInitialized,
        isOpen: state.isOpen,
      }),
    }
  )
);

export default useChatStore; 