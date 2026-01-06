import { create } from "zustand";
import notificationPreferenceService from "../services/notificationPreferenceService.js";

const useNotificationPreferenceStore = create((set, get) => ({
  // State
  preferences: null,
  isLoading: false,
  error: null,

  // Actions
  fetchPreferences: async (axiosInstance) => {
    set({ isLoading: true, error: null });
    try {
      const preferences = await notificationPreferenceService.getNotificationPreferences(axiosInstance);
      set({ preferences, isLoading: false });
      return preferences;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  updatePreferences: async (axiosInstance, preferences) => {
    set({ isLoading: true, error: null });
    try {
      const updatedPreferences = await notificationPreferenceService.updateNotificationPreferences(axiosInstance, preferences);
      set({ preferences: updatedPreferences, isLoading: false });
      return updatedPreferences;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  resetToDefault: async (axiosInstance) => {
    set({ isLoading: true, error: null });
    try {
      await notificationPreferenceService.resetToDefault(axiosInstance);
      // Fetch updated preferences after reset
      const preferences = await notificationPreferenceService.getNotificationPreferences(axiosInstance);
      set({ preferences, isLoading: false });
      return preferences;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  disableAll: async (axiosInstance) => {
    set({ isLoading: true, error: null });
    try {
      await notificationPreferenceService.disableAll(axiosInstance);
      // Fetch updated preferences after disabling all
      const preferences = await notificationPreferenceService.getNotificationPreferences(axiosInstance);
      set({ preferences, isLoading: false });
      return preferences;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  enableAll: async (axiosInstance) => {
    set({ isLoading: true, error: null });
    try {
      await notificationPreferenceService.enableAll(axiosInstance);
      // Fetch updated preferences after enabling all
      const preferences = await notificationPreferenceService.getNotificationPreferences(axiosInstance);
      set({ preferences, isLoading: false });
      return preferences;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
  
  reset: () => set({ preferences: null, isLoading: false, error: null })
}));

export default useNotificationPreferenceStore;