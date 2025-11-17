import { useState } from "react";
import { Trash2, X } from "lucide-react";
import Button from "../ui/Button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/Dialog";
import useNotificationStore from "../../store/notification.store";
import { useAxiosPrivate } from "../../utils/axios";
import { toast } from "react-toastify";

const DeleteNotificationModal = ({ 
  isOpen, 
  onClose, 
  notification,
  onSuccess 
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const axiosPrivate = useAxiosPrivate();
  const { deleteNotification } = useNotificationStore();

  const handleDelete = async () => {
    if (!notification) return;
    
    setIsDeleting(true);
    try {
      await deleteNotification(axiosPrivate, notification.notificationId);
      
      toast.success("Notification deleted successfully");
      
      if (onSuccess) {
        onSuccess(notification.notificationId);
      }
      
      onClose();
    } catch (error) {
      toast.error(error.message || "Failed to delete notification");
      console.error("Failed to delete notification:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  if (!notification) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <Trash2 className="h-5 w-5" />
              Delete Notification
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Are you sure you want to delete this notification? This action cannot be undone.
          </p>

          {/* Notification Preview */}
          <div className="p-3 bg-gray-50 rounded-lg border">
            <p className="text-sm font-medium text-gray-900 line-clamp-2">
              {notification.message}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs text-gray-500">
                Type: {notification.type}
              </span>
              {!notification.isRead && (
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  Unread
                </span>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteNotificationModal;