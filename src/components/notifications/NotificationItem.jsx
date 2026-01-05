import { formatDistanceToNow } from "date-fns";
import { Bell, Clock, Trash2, Check, X } from "lucide-react";
import clsx from "clsx";
import Button from "../ui/Button";
import { Badge } from "../ui/Badge";

const NotificationItem = ({ 
  notification, 
  onMarkAsRead, 
  onDelete, 
  compact = false,
  showActions = true 
}) => {
  const {
    notificationId,
    message,
    isRead,
    createdAt,
    type,
    entityTargetedId
  } = notification;

  const formatCreatedAt = (dateString) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (error) {
      return "Unknown time";
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'SystemAnnouncement':
        return <Bell className="h-4 w-4 text-blue-500" />;
      case 'Application':
        return <Bell className="h-4 w-4 text-green-500" />;
      case 'ToList':
        return <Bell className="h-4 w-4 text-purple-500" />;
      case 'Post':
        return <Bell className="h-4 w-4 text-orange-500" />;
      case 'Comment':
        return <Bell className="h-4 w-4 text-yellow-500" />;
      case 'React':
        return <Bell className="h-4 w-4 text-red-500" />;
      default:
        return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  const getNotificationTypeColor = (type) => {
    switch (type) {
      case 'SystemAnnouncement':
        return 'bg-blue-100 text-blue-800';
      case 'Application':
        return 'bg-green-100 text-green-800';
      case 'ToList':
        return 'bg-purple-100 text-purple-800';
      case 'Post':
        return 'bg-orange-100 text-orange-800';
      case 'Comment':
        return 'bg-yellow-100 text-yellow-800';
      case 'React':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleMarkAsRead = () => {
    if (!isRead && onMarkAsRead) {
      onMarkAsRead(notificationId);
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(notificationId);
    }
  };

  return (
    <div
      className={clsx(
        "p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors",
        !isRead && "bg-blue-50 border-l-4 border-l-blue-500",
        compact && "p-3"
      )}
    >
      <div className="flex items-start gap-3">
        {/* Notification Icon */}
        <div className="flex-shrink-0 mt-1">
          {getNotificationIcon(type)}
        </div>

        {/* Notification Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              {/* Message */}
              <p className={clsx(
                "text-sm",
                isRead ? "text-gray-600" : "text-gray-900 font-medium"
              )}>
                {message}
              </p>

              {/* Metadata */}
              <div className="flex items-center gap-2 mt-1">
                <Badge 
                  variant="secondary" 
                  className={clsx("text-xs", getNotificationTypeColor(type))}
                >
                  {type}
                </Badge>
                
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Clock className="h-3 w-3" />
                  <span>{formatCreatedAt(createdAt)}</span>
                </div>

                {!isRead && (
                  <Badge variant="destructive" className="text-xs">
                    New
                  </Badge>
                )}
              </div>
            </div>

            {/* Actions */}
            {showActions && !compact && (
              <div className="flex items-center gap-1 flex-shrink-0">
                {!isRead && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleMarkAsRead}
                    className="h-8 w-8 p-0 hover:bg-green-100"
                    title="Mark as read"
                  >
                    <Check className="h-4 w-4 text-green-600" />
                  </Button>
                )}
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDelete}
                  className="h-8 w-8 p-0 hover:bg-red-100"
                  title="Delete notification"
                >
                  <Trash2 className="h-4 w-4 text-red-600" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;