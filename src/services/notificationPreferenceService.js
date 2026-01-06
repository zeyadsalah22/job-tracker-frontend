/**
 * Notification Preference Service
 * Handles all notification preference-related API calls
 * Note: This service requires an authenticated axios instance to be passed to each method
 */
class NotificationPreferenceService {
  
  /**
   * Get user's notification preferences
   * @param {Object} axiosInstance - Authenticated axios instance
   * @returns {Promise<Object>} Notification preference response
   */
  async getNotificationPreferences(axiosInstance) {
    try {
      const response = await axiosInstance.get('/NotificationPreferences');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Update user's notification preferences
   * @param {Object} axiosInstance - Authenticated axios instance
   * @param {Object} preferences - Preference data
   * @param {number} preferences.userId - User ID
   * @param {boolean} preferences.enableReminders - Enable reminder notifications
   * @param {boolean} preferences.enableSystem - Enable system notifications
   * @param {boolean} preferences.enableSocial - Enable social notifications
   * @param {boolean} preferences.globallyEnabled - Global notification toggle
   * @returns {Promise<Object>} Updated notification preference response
   */
  async updateNotificationPreferences(axiosInstance, preferences) {
    try {
      const response = await axiosInstance.put('/NotificationPreferences', preferences);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Reset notification preferences to default values
   * @param {Object} axiosInstance - Authenticated axios instance
   * @returns {Promise<void>}
   */
  async resetToDefault(axiosInstance) {
    try {
      await axiosInstance.post('/NotificationPreferences/reset-to-default');
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Disable all notifications
   * @param {Object} axiosInstance - Authenticated axios instance
   * @returns {Promise<void>}
   */
  async disableAll(axiosInstance) {
    try {
      await axiosInstance.post('/NotificationPreferences/disable-all');
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Enable all notifications
   * @param {Object} axiosInstance - Authenticated axios instance
   * @returns {Promise<void>}
   */
  async enableAll(axiosInstance) {
    try {
      await axiosInstance.post('/NotificationPreferences/enable-all');
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
export default new NotificationPreferenceService();

// Export notification categories enum for convenience
export const NOTIFICATION_CATEGORIES = {
  REMINDER: 0,
  SYSTEM: 1,
  SOCIAL: 2
};