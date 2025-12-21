import { create } from "zustand";
import notificationService, { NOTIFICATION_TYPES } from "../services/notificationService.js";

const useNotificationStore = create((set, get) => ({
  // State
  notifications: [],
  unreadNotifications: [],
  unreadCount: 0,
  isLoading: false,
  error: null,
  
  // Pagination state
  currentPage: 1,
  pageSize: 20,
  totalCount: 0,
  totalPages: 0,
  hasNext: false,
  hasPrevious: false,
  
  // Filter state
  sortBy: 'CreatedAt',
  sortDescending: true,

  // Actions
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),

  // Fetch notifications with pagination
  fetchNotifications: async (axiosInstance, params = {}) => {
    const state = get();
    set({ isLoading: true, error: null });
    
    try {
      const queryParams = {
        pageNumber: params.pageNumber || state.currentPage,
        pageSize: params.pageSize || state.pageSize,
        sortBy: params.sortBy || state.sortBy,
        sortDescending: params.sortDescending !== undefined ? params.sortDescending : state.sortDescending
      };

      const response = await notificationService.getNotifications(axiosInstance, queryParams);
      
      set({
        notifications: response.items || [],
        currentPage: response.pageNumber || 1,
        pageSize: response.pageSize || 20,
        totalCount: response.totalCount || 0,
        totalPages: response.totalPages || 0,
        hasNext: response.hasNext || false,
        hasPrevious: response.hasPrevious || false,
        isLoading: false
      });

      return response;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  // Fetch unread notifications
  fetchUnreadNotifications: async (axiosInstance) => {
    set({ isLoading: true, error: null });
    
    try {
      const unreadNotifications = await notificationService.getUnreadNotifications(axiosInstance);
      const unreadCount = await notificationService.getUnreadNotificationsCount(axiosInstance);
      
      set({
        unreadNotifications,
        unreadCount,
        isLoading: false
      });

      return { unreadNotifications, unreadCount };
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  // Create a new notification
  createNotification: async (axiosInstance, notificationData) => {
    set({ isLoading: true, error: null });
    
    try {
      const newNotification = await notificationService.createNotification(axiosInstance, notificationData);
      
      // Add to current notifications list if it's the first page
      const state = get();
      if (state.currentPage === 1) {
        set({
          notifications: [newNotification, ...state.notifications],
          totalCount: state.totalCount + 1,
          isLoading: false
        });
      } else {
        set({ isLoading: false });
      }

      return newNotification;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  // Mark notification as read
  markAsRead: async (axiosInstance, notificationId) => {
    set({ error: null });
    
    try {
      await notificationService.markNotificationAsRead(axiosInstance, notificationId);
      
      const state = get();
      
      // Update notifications list
      const updatedNotifications = state.notifications.map(notification =>
        notification.notificationId === notificationId
          ? { ...notification, isRead: true }
          : notification
      );
      
      // Update unread notifications list
      const updatedUnreadNotifications = state.unreadNotifications.filter(
        notification => notification.notificationId !== notificationId
      );
      
      set({
        notifications: updatedNotifications,
        unreadNotifications: updatedUnreadNotifications,
        unreadCount: Math.max(0, state.unreadCount - 1)
      });
      
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  // Mark all notifications as read
  markAllAsRead: async (axiosInstance) => {
    set({ error: null });
    
    try {
      await notificationService.markAllNotificationsAsRead(axiosInstance);
      
      const state = get();
      
      // Update all notifications to read
      const updatedNotifications = state.notifications.map(notification => ({
        ...notification,
        isRead: true
      }));
      
      set({
        notifications: updatedNotifications,
        unreadNotifications: [],
        unreadCount: 0
      });
      
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  // Delete notification
  deleteNotification: async (axiosInstance, notificationId) => {
    set({ error: null });
    
    try {
      await notificationService.deleteNotification(axiosInstance, notificationId);
      
      const state = get();
      
      // Remove from notifications list
      const updatedNotifications = state.notifications.filter(
        notification => notification.notificationId !== notificationId
      );
      
      // Remove from unread notifications list
      const updatedUnreadNotifications = state.unreadNotifications.filter(
        notification => notification.notificationId !== notificationId
      );
      
      // Check if the deleted notification was unread
      const wasUnread = state.unreadNotifications.some(
        notification => notification.notificationId === notificationId
      );
      
      set({
        notifications: updatedNotifications,
        unreadNotifications: updatedUnreadNotifications,
        unreadCount: wasUnread ? Math.max(0, state.unreadCount - 1) : state.unreadCount,
        totalCount: Math.max(0, state.totalCount - 1)
      });
      
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  // Bulk delete notifications
  bulkDeleteNotifications: async (axiosInstance, notificationIds) => {
    set({ error: null });
    
    try {
      await notificationService.bulkDeleteNotifications(axiosInstance, notificationIds);
      
      const state = get();
      
      // Remove from notifications list
      const updatedNotifications = state.notifications.filter(
        notification => !notificationIds.includes(notification.notificationId)
      );
      
      // Remove from unread notifications list
      const updatedUnreadNotifications = state.unreadNotifications.filter(
        notification => !notificationIds.includes(notification.notificationId)
      );
      
      // Count how many unread notifications were deleted
      const deletedUnreadCount = state.unreadNotifications.filter(
        notification => notificationIds.includes(notification.notificationId)
      ).length;
      
      set({
        notifications: updatedNotifications,
        unreadNotifications: updatedUnreadNotifications,
        unreadCount: Math.max(0, state.unreadCount - deletedUnreadCount),
        totalCount: Math.max(0, state.totalCount - notificationIds.length)
      });
      
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  // Update pagination
  setPage: (page) => set({ currentPage: page }),
  setPageSize: (size) => set({ pageSize: size }),
  
  // Update sorting
  setSorting: (sortBy, sortDescending = true) => set({ sortBy, sortDescending }),
  
  // Reset store
  reset: () => set({
    notifications: [],
    unreadNotifications: [],
    unreadCount: 0,
    isLoading: false,
    error: null,
    currentPage: 1,
    pageSize: 20,
    totalCount: 0,
    totalPages: 0,
    hasNext: false,
    hasPrevious: false,
    sortBy: 'createdAt',
    sortDescending: true
  })
}));

export default useNotificationStore;
export { NOTIFICATION_TYPES };