import { useState, useEffect } from "react";
import { Bell, RotateCcw, ToggleLeft, ToggleRight } from "lucide-react";
import { toast } from "react-toastify";
import ReactLoading from "react-loading";
import { useAxiosPrivate } from "../../utils/axios";
import useNotificationPreferenceStore from "../../store/notificationPreference.store";

const NotificationPreferences = ({ user }) => {
  const axiosPrivate = useAxiosPrivate();
  const [loading, setLoading] = useState(false);

  const {
    preferences,
    isLoading,
    error,
    fetchPreferences,
    updatePreferences,
    resetToDefault,
    disableAll,
    enableAll,
    clearError
  } = useNotificationPreferenceStore();

  // Fetch preferences on component mount
  useEffect(() => {
    if (user?.userId) {
      fetchPreferences(axiosPrivate).catch(err => {
        console.error('Failed to fetch notification preferences:', err);
      });
    }
  }, [user?.userId, fetchPreferences, axiosPrivate]);

  const handleTogglePreference = async (preferenceKey, currentValue) => {
    if (!user?.userId) return;

    setLoading(true);
    try {
      const updateData = {
        userId: user.userId,
        [preferenceKey]: !currentValue
      };
      
      await updatePreferences(axiosPrivate, updateData);
      toast.success("Notification preference updated successfully");
    } catch (err) {
      toast.error("Failed to update notification preference");
      console.error('Failed to update preference:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleResetToDefault = async () => {
    setLoading(true);
    try {
      await resetToDefault(axiosPrivate);
      toast.success("Notification preferences reset to default");
    } catch (err) {
      toast.error("Failed to reset preferences");
      console.error('Failed to reset preferences:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDisableAll = async () => {
    setLoading(true);
    try {
      await disableAll(axiosPrivate);
      toast.success("All notifications disabled");
    } catch (err) {
      toast.error("Failed to disable all notifications");
      console.error('Failed to disable all:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEnableAll = async () => {
    setLoading(true);
    try {
      await enableAll(axiosPrivate);
      toast.success("All notifications enabled");
    } catch (err) {
      toast.error("Failed to enable all notifications");
      console.error('Failed to enable all:', err);
    } finally {
      setLoading(false);
    }
  };

  if (isLoading && !preferences) {
    return (
      <div className="mt-8 pt-8 border-t-2">
        <div className="flex items-center justify-center py-8">
          <ReactLoading type="spinningBubbles" color="#7571F9" height={50} width={50} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-8 pt-8 border-t-2">
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => {
              clearError();
              fetchPreferences(axiosPrivate);
            }}
            className="bg-primary hover:bg-primary/85 transition-all text-white py-2 px-4 rounded-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const ToggleButton = ({ isEnabled, onClick, disabled }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`transition-colors ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      {isEnabled ? (
        <ToggleRight className="h-6 w-6 text-green-500" />
      ) : (
        <ToggleLeft className="h-6 w-6 text-gray-400" />
      )}
    </button>
  );

  return (
    <div className="mt-8 pt-8 border-t-2">
      <div className="flex items-center gap-2 mb-6">
        <Bell className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-bold">Notification Preferences</h2>
      </div>

      {preferences && (
        <div className="space-y-6">
          {/* Global Toggle */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h3 className="font-semibold text-gray-900">Global Notifications</h3>
              <p className="text-sm text-gray-600">Enable or disable all notifications</p>
            </div>
            <ToggleButton
              isEnabled={preferences.globallyEnabled}
              onClick={() => handleTogglePreference('globallyEnabled', preferences.globallyEnabled)}
              disabled={loading}
            />
          </div>

          {/* Individual Preferences */}
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h3 className="font-semibold text-gray-900">Reminder Notifications</h3>
                <p className="text-sm text-gray-600">Get notified about upcoming events, deadlines, and tasks</p>
              </div>
              <ToggleButton
                isEnabled={preferences.enableReminders}
                onClick={() => handleTogglePreference('enableReminders', preferences.enableReminders)}
                disabled={loading || !preferences.globallyEnabled}
              />
            </div>

            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h3 className="font-semibold text-gray-900">System Notifications</h3>
                <p className="text-sm text-gray-600">Receive system updates, security alerts, and maintenance notices</p>
              </div>
              <ToggleButton
                isEnabled={preferences.enableSystem}
                onClick={() => handleTogglePreference('enableSystem', preferences.enableSystem)}
                disabled={loading || !preferences.globallyEnabled}
              />
            </div>

            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h3 className="font-semibold text-gray-900">Social Notifications</h3>
                <p className="text-sm text-gray-600">Get notified about comments, mentions, and social interactions</p>
              </div>
              <ToggleButton
                isEnabled={preferences.enableSocial}
                onClick={() => handleTogglePreference('enableSocial', preferences.enableSocial)}
                disabled={loading || !preferences.globallyEnabled}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            {loading ? (
              <div className="flex items-center justify-center">
                <ReactLoading type="bubbles" color="#7571F9" height={25} width={25} />
              </div>
            ) : (
              <>
                <button
                  onClick={handleEnableAll}
                  className="bg-green-600 hover:bg-green-700 transition-all text-white py-2 px-4 rounded-lg text-sm font-semibold"
                >
                  Enable All
                </button>
                <button
                  onClick={handleDisableAll}
                  className="bg-red-600 hover:bg-red-700 transition-all text-white py-2 px-4 rounded-lg text-sm font-semibold"
                >
                  Disable All
                </button>
                <button
                  onClick={handleResetToDefault}
                  className="bg-gray-600 hover:bg-gray-700 transition-all text-white py-2 px-4 rounded-lg text-sm font-semibold flex items-center gap-2"
                >
                  <RotateCcw className="h-4 w-4" />
                  Reset to Default
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationPreferences;