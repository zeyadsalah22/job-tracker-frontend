import { useState, useEffect } from "react";
import { Bell, Search, CheckCheck, Trash2, Filter, SortAsc, SortDesc, Eye, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../components/ui/Select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { 
  NotificationItem, 
  DeleteNotificationModal 
} from "../components/notifications";
import useNotificationStore, { NOTIFICATION_TYPES } from "../store/notification.store";
import { useAxiosPrivate } from "../utils/axios";

const Notifications = () => {
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [selectedNotifications, setSelectedNotifications] = useState([]);

  const {
    notifications,
    unreadCount,
    isLoading,
    error,
    currentPage,
    pageSize,
    totalCount,
    totalPages,
    hasNext,
    hasPrevious,
    sortBy,
    sortDescending,
    fetchNotifications,
    fetchUnreadNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    bulkDeleteNotifications,
    setPage,
    setSorting,
    clearError
  } = useNotificationStore();

  // Fetch notifications on component mount
  useEffect(() => {
    fetchNotifications(axiosPrivate);
    fetchUnreadNotifications(axiosPrivate);
  }, [fetchNotifications, fetchUnreadNotifications, axiosPrivate]);

  // Filter notifications based on search and filters
  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = !searchTerm || 
      notification.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.type.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = !selectedType || notification.type === selectedType;
    const matchesUnread = !showUnreadOnly || !notification.isRead;
    
    return matchesSearch && matchesType && matchesUnread;
  });

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleTypeFilter = (type) => {
    setSelectedType(type);
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await markAsRead(axiosPrivate, notificationId);
      toast.success("Notification marked as read");
    } catch (err) {
      toast.error("Failed to mark notification as read");
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead(axiosPrivate);
      toast.success("All notifications marked as read");
    } catch (err) {
      toast.error("Failed to mark all notifications as read");
    }
  };

  const handleDelete = async (notificationId) => {
    try {
      await deleteNotification(axiosPrivate, notificationId);
      toast.success("Notification deleted");
    } catch (err) {
      toast.error("Failed to delete notification");
    }
  };

  const handleBulkDelete = async () => {
    if (selectedNotifications.length === 0) return;
    
    try {
      await bulkDeleteNotifications(axiosPrivate, selectedNotifications);
      toast.success(`${selectedNotifications.length} notifications deleted`);
      setSelectedNotifications([]);
    } catch (err) {
      toast.error("Failed to delete notifications");
    }
  };

  const handleSelectNotification = (notificationId, isSelected) => {
    if (isSelected) {
      setSelectedNotifications(prev => [...prev, notificationId]);
    } else {
      setSelectedNotifications(prev => prev.filter(id => id !== notificationId));
    }
  };

  const handleSelectAll = () => {
    if (selectedNotifications.length === filteredNotifications.length) {
      setSelectedNotifications([]);
    } else {
      setSelectedNotifications(filteredNotifications.map(n => n.notificationId));
    }
  };

  const handlePageChange = (page) => {
    setPage(page);
    fetchNotifications(axiosPrivate, { pageNumber: page });
  };

  const handleSortChange = (field) => {
    const newSortDescending = sortBy === field ? !sortDescending : true;
    setSorting(field, newSortDescending);
    fetchNotifications(axiosPrivate, { sortBy: field, sortDescending: newSortDescending });
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedType("");
    setShowUnreadOnly(false);
  };

  const notificationTypeOptions = Object.entries(NOTIFICATION_TYPES).map(([key, value]) => ({
    value: value,
    label: key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  }));

  return (
    <div className="space-y-6 animate-fade-in px-4 sm:px-6 lg:px-8 pt-2 pb-4 sm:pb-6 lg:pb-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-2">
            <Bell className="h-6 w-6 sm:h-8 sm:w-8" />
            Notifications
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Manage all your notifications and stay updated
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handleMarkAllAsRead}
            disabled={isLoading || unreadCount === 0}
          >
            <CheckCheck className="h-4 w-4 mr-2" />
            Mark all as read {unreadCount > 0 && `(${unreadCount})`}
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search notifications..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Type Filter */}
            <Select
              value={selectedType}
              onValueChange={handleTypeFilter}
            >
              <SelectTrigger className="sm:w-48">
                <SelectValue placeholder="All Types">
                  {selectedType ? notificationTypeOptions.find(opt => opt.value === selectedType)?.label : "All Types"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Types</SelectItem>
                {notificationTypeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Unread Filter */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showUnreadOnly}
                onChange={(e) => setShowUnreadOnly(e.target.checked)}
                className="rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="text-sm">Unread only</span>
            </label>

            {/* Clear Filters */}
            {(searchTerm || selectedType || showUnreadOnly) && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
              >
                <X className="h-4 w-4 mr-2" />
                Clear
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedNotifications.length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                {selectedNotifications.length} notification{selectedNotifications.length > 1 ? 's' : ''} selected
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBulkDelete}
                  disabled={isLoading}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Selected
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedNotifications([])}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Notifications List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">
              {filteredNotifications.length} Notification{filteredNotifications.length !== 1 ? 's' : ''}
            </CardTitle>
            
            <div className="flex items-center gap-2">
              {/* Sort Controls */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSortChange('createdAt')}
                className="flex items-center gap-1"
              >
                Date
                {sortBy === 'createdAt' && (
                  sortDescending ? <SortDesc className="h-3 w-3" /> : <SortAsc className="h-3 w-3" />
                )}
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSortChange('type')}
                className="flex items-center gap-1"
              >
                Type
                {sortBy === 'type' && (
                  sortDescending ? <SortDesc className="h-3 w-3" /> : <SortAsc className="h-3 w-3" />
                )}
              </Button>

              {/* Select All */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSelectAll}
              >
                {selectedNotifications.length === filteredNotifications.length ? 'Deselect All' : 'Select All'}
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
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
                  fetchNotifications(axiosPrivate);
                }}
                className="mt-2"
              >
                Try Again
              </Button>
            </div>
          )}

          {/* Loading State */}
          {isLoading && !error && (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-sm text-gray-500 mt-2">Loading notifications...</p>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !error && filteredNotifications.length === 0 && (
            <div className="p-8 text-center">
              <Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-900 mb-2">No notifications found</p>
              <p className="text-sm text-gray-500 mb-4">
                {searchTerm || selectedType || showUnreadOnly 
                  ? "Try adjusting your filters to see more notifications."
                  : "You don't have any notifications yet."
                }
              </p>

            </div>
          )}

          {/* Notifications List */}
          {!isLoading && !error && filteredNotifications.length > 0 && (
            <div className="divide-y divide-gray-200">
              {filteredNotifications.map((notification) => (
                <div key={notification.notificationId} className="relative">
                  {/* Selection Checkbox */}
                  <div className="absolute left-4 top-4 z-10">
                    <input
                      type="checkbox"
                      checked={selectedNotifications.includes(notification.notificationId)}
                      onChange={(e) => handleSelectNotification(notification.notificationId, e.target.checked)}
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                  </div>
                  
                  {/* Notification Item */}
                  <div className="pl-12">
                    <NotificationItem
                      notification={notification}
                      onMarkAsRead={handleMarkAsRead}
                      onDelete={(id) => {
                        setSelectedNotification(notifications.find(n => n.notificationId === id));
                        setShowDeleteModal(true);
                      }}
                      showActions={true}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t">
              <div className="text-sm text-gray-500">
                Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, totalCount)} of {totalCount} notifications
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={!hasPrevious || isLoading}
                >
                  Previous
                </Button>
                
                <span className="text-sm text-gray-500">
                  Page {currentPage} of {totalPages}
                </span>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={!hasNext || isLoading}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      <DeleteNotificationModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedNotification(null);
        }}
        notification={selectedNotification}
        onSuccess={(deletedId) => {
          console.log('Deleted notification:', deletedId);
          setSelectedNotifications(prev => prev.filter(id => id !== deletedId));
          // Refresh data after deletion
          fetchNotifications(axiosPrivate);
          fetchUnreadNotifications(axiosPrivate);
        }}
      />
    </div>
  );
};

export default Notifications;