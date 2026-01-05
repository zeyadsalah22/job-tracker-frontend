import { useState, useEffect, useRef } from "react";
import { Bell, CheckCheck, Trash2, Settings, X, AlertCircle } from "lucide-react";
import { HubConnectionBuilder } from '@microsoft/signalr';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import Button from "../ui/Button";
import { Badge } from "../ui/Badge";
import NotificationItem from "./NotificationItem";
import useNotificationStore from "../../store/notification.store";
import { useAxiosPrivate } from "../../utils/axios";
import { toast } from "react-toastify";
import clsx from "clsx";
import { API_BASE_URL } from "../../config/api";

const NotificationPanel = ({ 
  trigger,
  align = "end",
  maxHeight = "400px",
  showMarkAllAsRead = true,
  showViewAll = true,
  onViewAll,
  className
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const axiosPrivate = useAxiosPrivate();
  const connectionRef = useRef(null);
  
  const {
    unreadNotifications,
    unreadCount,
    isLoading,
    error,
    fetchUnreadNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearError
  } = useNotificationStore();

  // Fetch unread notifications on mount and when panel opens
  useEffect(() => {
    if (isOpen) {
      fetchUnreadNotifications(axiosPrivate).catch(err => {
        console.error('Failed to fetch notifications:', err);
      });
    }
  }, [isOpen, fetchUnreadNotifications, axiosPrivate]);

  // Setup SignalR connection
  useEffect(() => {
    const setupSignalR = async () => {
      try {
        const token = localStorage.getItem('access');
        if (!token) {
          console.log('No access token found, skipping SignalR connection');
          return;
        }
        
        const hubUrl = `${API_BASE_URL}/notificationhub`;
        console.log('Connecting to SignalR hub:', hubUrl);
        
        const connection = new HubConnectionBuilder()
          .withUrl(hubUrl, {
            accessTokenFactory: () => token
          })
          .build();
      
        connectionRef.current = connection;
        
        await connection.start();
        console.log('SignalR connected successfully');
        
        const handleNotification = (message) => {
          console.log('Received notification:', message);
          toast.error(
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-500" />
              <span>{message}</span>
            </div>,
            {
              position: "top-right",
              hideProgressBar: false,
              closeOnClick: true,
              autoClose: 10000,
              pauseOnHover: true,
              onClick: () => {
                // Open notification panel when clicked
                setIsOpen(true);
              }
            }
          );
        };
        
        connection.on("sendtoall", handleNotification);
        connection.on("sendtouser", handleNotification);
        
      } catch (error) {
        console.error('SignalR connection failed:', error);
      }
    };

    setupSignalR();

    return () => {
      if (connectionRef.current) {
        connectionRef.current.stop();
        connectionRef.current = null;
      }
    };
  }, []);

  // Clear error when component unmounts
  useEffect(() => {
    return () => {
      if (error) {
        clearError();
      }
    };
  }, [error, clearError]);

  const handleMarkAsRead = async (notificationId) => {
    try {
      await markAsRead(axiosPrivate, notificationId);
      toast.success("Notification marked as read");
    } catch (err) {
      toast.error("Failed to mark notification as read");
      console.error('Failed to mark notification as read:', err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead(axiosPrivate);
      toast.success("All notifications marked as read");
    } catch (err) {
      toast.error("Failed to mark all notifications as read");
      console.error('Failed to mark all notifications as read:', err);
    }
  };

  const handleDelete = async (notificationId) => {
    try {
      await deleteNotification(axiosPrivate, notificationId);
      toast.success("Notification deleted");
    } catch (err) {
      toast.error("Failed to delete notification");
      console.error('Failed to delete notification:', err);
    }
  };

  const handleViewAll = () => {
    setIsOpen(false);
    if (onViewAll) {
      onViewAll();
    }
  };

  // Default trigger if none provided
  const defaultTrigger = (
    <Button variant="ghost" size="sm" className="relative">
      <Bell className="h-4 w-4" />
      {unreadCount > 0 && (
        <Badge 
          variant="destructive" 
          className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
        >
          {unreadCount > 99 ? '99+' : unreadCount}
        </Badge>
      )}
    </Button>
  );

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        {trigger || defaultTrigger}
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        align={align} 
        className={clsx("w-80 p-0", className)}
        sideOffset={5}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <DropdownMenuLabel className="p-0 text-base font-semibold">
              Notifications
            </DropdownMenuLabel>
            {unreadCount > 0 && (
              <Badge variant="secondary" className="text-xs">
                {unreadCount} new
              </Badge>
            )}
          </div>
          
          {showMarkAllAsRead && unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkAllAsRead}
              disabled={isLoading}
              className="h-8 text-xs hover:bg-gray-100"
            >
              <CheckCheck className="h-3 w-3 mr-1" />
              Mark all read
            </Button>
          )}
        </div>

        {/* Error State */}
        {error && (
          <div className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 text-red-600 text-sm">
              <X className="h-4 w-4" />
              <span>{error}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                clearError();
                fetchUnreadNotifications(axiosPrivate);
              }}
              className="mt-2 text-xs"
            >
              Try Again
            </Button>
          </div>
        )}

        {/* Loading State */}
        {isLoading && !error && (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
            <p className="text-sm text-gray-500 mt-2">Loading notifications...</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && unreadNotifications.length === 0 && (
          <div className="p-8 text-center">
            <Bell className="h-8 w-8 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-500">No new notifications</p>
          </div>
        )}

        {/* Notifications List */}
        {!isLoading && !error && unreadNotifications.length > 0 && (
          <div 
            className="max-h-96 overflow-y-auto"
            style={{ maxHeight }}
          >
            {unreadNotifications.map((notification) => (
              <NotificationItem
                key={notification.notificationId}
                notification={notification}
                onMarkAsRead={handleMarkAsRead}
                onDelete={handleDelete}
                compact={true}
                showActions={true}
              />
            ))}
          </div>
        )}

        {/* Footer */}
        {!error && unreadNotifications.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <div className="p-2">
              {showViewAll && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleViewAll}
                  className="w-full justify-center text-sm"
                >
                  View all notifications
                </Button>
              )}
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationPanel;