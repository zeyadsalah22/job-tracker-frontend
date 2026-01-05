/**
 * Notification Service
 * Handles all notification-related API calls
 * Note: This service requires an authenticated axios instance to be passed to each method
 */
class NotificationService {
  
  /**
   * Get paginated notifications
   * @param {Object} axiosInstance - Authenticated axios instance
   * @param {Object} params - Query parameters
   * @param {number} params.pageNumber - Page number (min: 1, max: 2147483647)
   * @param {number} params.pageSize - Page size (min: 1, max: 500)
   * @param {string} params.sortBy - Sort field
   * @param {boolean} params.sortDescending - Sort direction
   * @returns {Promise<Object>} Paginated notification response
   */
  async getNotifications(axiosInstance, params = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.pageNumber) queryParams.append('PageNumber', params.pageNumber);
      if (params.pageSize) queryParams.append('PageSize', params.pageSize);
      if (params.sortBy) queryParams.append('SortBy', params.sortBy);
      if (params.sortDescending !== undefined) queryParams.append('SortDescending', params.sortDescending);
      
      const response = await axiosInstance.get(`/Notifications?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Create a new notification
   * @param {Object} axiosInstance - Authenticated axios instance
   * @param {Object} notificationData - Notification data
   * @param {number} notificationData.userId - User ID
   * @param {number} notificationData.actorId - Actor ID
   * @param {string} notificationData.type - Notification type
   * @param {number|null} notificationData.entityTargetedId - Entity targeted ID
   * @param {string} notificationData.message - Notification message (required)
   * @returns {Promise<Object>} Created notification response
   */
  async createNotification(axiosInstance, notificationData) {
    try {
      const response = await axiosInstance.post('/Notifications', notificationData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get a specific notification by ID
   * @param {Object} axiosInstance - Authenticated axios instance
   * @param {number} notificationId - Notification ID
   * @returns {Promise<Object>} Notification response
   */
  async getNotificationById(axiosInstance, notificationId) {
    try {
      const response = await axiosInstance.get(`/Notifications/${notificationId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Delete a specific notification
   * @param {Object} axiosInstance - Authenticated axios instance
   * @param {number} notificationId - Notification ID
   * @returns {Promise<void>}
   */
  async deleteNotification(axiosInstance, notificationId) {
    try {
      await axiosInstance.delete(`/Notifications/${notificationId}`);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get all unread notifications
   * @param {Object} axiosInstance - Authenticated axios instance
   * @returns {Promise<Array>} Array of unread notifications
   */
  async getUnreadNotifications(axiosInstance) {
    try {
      const response = await axiosInstance.get('/Notifications/unread');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get count of unread notifications
   * @param {Object} axiosInstance - Authenticated axios instance
   * @returns {Promise<number>} Count of unread notifications
   */
  async getUnreadNotificationsCount(axiosInstance) {
    try {
      const response = await axiosInstance.get('/Notifications/unread/count');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Mark a notification as read
   * @param {Object} axiosInstance - Authenticated axios instance
   * @param {number} notificationId - Notification ID
   * @returns {Promise<void>}
   */
  async markNotificationAsRead(axiosInstance, notificationId) {
    try {
      await axiosInstance.patch(`/Notifications/${notificationId}/read`);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Mark all notifications as read
   * @param {Object} axiosInstance - Authenticated axios instance
   * @returns {Promise<void>}
   */
  async markAllNotificationsAsRead(axiosInstance) {
    try {
      await axiosInstance.patch('/Notifications/read-all');
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Delete multiple notifications in bulk
   * @param {Object} axiosInstance - Authenticated axios instance
   * @param {Array<number>} notificationIds - Array of notification IDs
   * @returns {Promise<void>}
   */
  async bulkDeleteNotifications(axiosInstance, notificationIds) {
    try {
      await axiosInstance.delete('/Notifications/bulk', {
        data: notificationIds
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Handle API errors consistently
   * @param {Error} error - The error object
   * @returns {Error} Formatted error
   */
  handleError(error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const message = error.response.data?.message || error.response.data || 'An error occurred';
      const newError = new Error(message);
      newError.status = error.response.status;
      newError.data = error.response.data;
      return newError;
    } else if (error.request) {
      // The request was made but no response was received
      return new Error('Network error - please check your connection');
    } else {
      // Something happened in setting up the request that triggered an Error
      return new Error(error.message || 'An unexpected error occurred');
    }
  }
}

// Export as singleton
export default new NotificationService();

// Export notification types enum for convenience
export const NOTIFICATION_TYPES = {
  SYSTEM_ANNOUNCEMENT: 'SystemAnnouncement',
  APPLICATION: 'Application',
  TODO_Item: 'TodoItem',
  POST: 'Post',
  COMMENT: 'Comment',
  REACT: 'React'
};