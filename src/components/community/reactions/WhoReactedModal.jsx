import { useState, useEffect } from "react";
import { useAxiosPrivate } from "../../../utils/axios";
import { toast } from "react-toastify";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../ui/Dialog";
import Avatar from "../../ui/Avatar";
import { Tabs } from "../../ui/Tabs";
import { ThumbsUp, ThumbsDown, Lightbulb, Brain, Heart } from "lucide-react";

const WhoReactedModal = ({ isOpen, onClose, postId }) => {
  const axiosPrivate = useAxiosPrivate();

  const [loading, setLoading] = useState(true);
  const [reactions, setReactions] = useState({});
  const [totalCount, setTotalCount] = useState(0);
  const [activeTab, setActiveTab] = useState("all");

  const reactionTypes = [
    { key: "UPVOTE", label: "Upvote", icon: ThumbsUp },
    { key: "HELPFUL", label: "Helpful", icon: Lightbulb },
    { key: "INSIGHTFUL", label: "Insightful", icon: Brain },
    { key: "THANKS", label: "Thanks", icon: Heart },
    { key: "DOWNVOTE", label: "Downvote", icon: ThumbsDown },
  ];

  useEffect(() => {
    if (isOpen && postId) {
      fetchReactions();
    }
  }, [isOpen, postId]);

  const fetchReactions = async () => {
    try {
      setLoading(true);
      const response = await axiosPrivate.get(`/PostReactions/${postId}/who-reacted`);
      
      if (response.data?.data) {
        setReactions(response.data.data.reactionsByType || {});
        setTotalCount(response.data.data.totalCount || 0);
      }
    } catch (error) {
      console.error("Error fetching reactions:", error);
      toast.error("Failed to load reactions");
    } finally {
      setLoading(false);
    }
  };

  const getReactionCount = (type) => {
    return reactions[type]?.length || 0;
  };

  const getAllReactions = () => {
    const all = [];
    Object.entries(reactions).forEach(([type, users]) => {
      users.forEach((user) => {
        all.push({ ...user, reactionType: type });
      });
    });
    return all;
  };

  const renderUserList = (users) => {
    if (!users || users.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          <p>No reactions yet</p>
        </div>
      );
    }

    return (
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {users.map((user, index) => {
          const ReactionIcon = reactionTypes.find((r) => r.key === user.reactionType)?.icon;
          
          return (
            <div key={index} className="flex items-center justify-between py-2 px-3 hover:bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Avatar
                  src={user.profilePictureUrl}
                  fallback={user.userName?.[0] || "U"}
                  className="h-10 w-10"
                />
                <div>
                  <p className="font-medium text-gray-900">{user.userName || "Unknown User"}</p>
                  <p className="text-xs text-gray-500">{user.reactedAt ? new Date(user.reactedAt).toLocaleDateString() : ""}</p>
                </div>
              </div>
              {ReactionIcon && (
                <div className="flex items-center gap-1 text-gray-600">
                  <ReactionIcon className="h-4 w-4" />
                  <span className="text-xs">{user.reactionTypeName}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Reactions ({totalCount})</DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Tabs */}
            <div className="border-b border-gray-200">
              <div className="flex gap-2 overflow-x-auto">
                <button
                  onClick={() => setActiveTab("all")}
                  className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === "all"
                      ? "border-primary text-primary"
                      : "border-transparent text-gray-600 hover:text-gray-900"
                  }`}
                >
                  All ({totalCount})
                </button>
                {reactionTypes.map(({ key, label, icon: Icon }) => {
                  const count = getReactionCount(key);
                  if (count === 0) return null;

                  return (
                    <button
                      key={key}
                      onClick={() => setActiveTab(key)}
                      className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
                        activeTab === key
                          ? "border-primary text-primary"
                          : "border-transparent text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {label} ({count})
                    </button>
                  );
                })}
              </div>
            </div>

            {/* User List */}
            {activeTab === "all" ? (
              renderUserList(getAllReactions())
            ) : (
              renderUserList(reactions[activeTab] || [])
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default WhoReactedModal;

