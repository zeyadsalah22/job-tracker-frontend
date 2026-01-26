import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/Card";
import { Badge } from "../../ui/Badge";
import { Progress } from "../../ui/Progress";
import { Video, CheckCircle2, AlertTriangle, Lightbulb, TrendingUp } from "lucide-react";

/**
 * Component to display video analysis feedback
 * @param {Object} videoFeedback - The video feedback object from the API
 */
export default function VideoFeedbackCard({ videoFeedback }) {
  if (!videoFeedback || videoFeedback.status !== "success") {
    return null;
  }

  const { metrics, feedback } = videoFeedback;
  const { summary, strengths, improvements, recommendations } = feedback || {};

  // Helper to get color for metric value (0-100 scale from backend)
  const getMetricColor = (value) => {
    if (value >= 70) return "text-green-600";
    if (value >= 40) return "text-yellow-600";
    return "text-red-600";
  };

  const getMetricBgColor = (value) => {
    if (value >= 70) return "bg-green-500";
    if (value >= 40) return "bg-yellow-500";
    return "bg-red-500";
  };

  // Helper to get priority badge color
  const getPriorityBadge = (priority) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return { className: "bg-red-100 text-red-800", label: "High Priority" };
      case "medium":
        return { className: "bg-yellow-100 text-yellow-800", label: "Medium Priority" };
      case "low":
        return { className: "bg-blue-100 text-blue-800", label: "Low Priority" };
      default:
        return { className: "bg-gray-100 text-gray-800", label: priority || "Normal" };
    }
  };

  // Helper to get category badge color
  const getCategoryBadge = (category) => {
    const colors = {
      "body_language": "bg-purple-100 text-purple-800",
      "verbal": "bg-blue-100 text-blue-800",
      "emotional": "bg-pink-100 text-pink-800",
      "engagement": "bg-green-100 text-green-800",
      "general": "bg-gray-100 text-gray-800"
    };
    return colors[category?.toLowerCase()] || colors.general;
  };

  const metricsData = [
    { name: "Confidence", value: metrics?.confidence || 0, icon: TrendingUp },
    { name: "Engagement", value: metrics?.engagement || 0, icon: CheckCircle2 },
    { name: "Stress Level", value: metrics?.stress || 0, icon: AlertTriangle, inverse: true },
    { name: "Authenticity", value: metrics?.authenticity || 0, icon: CheckCircle2 }
  ];

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Video className="h-6 w-6 text-primary" />
          Video Analysis Feedback
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-1">
          AI-powered analysis of your body language, tone, and emotional reactions
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Summary */}
        {summary && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold flex items-center gap-2">
              <Video className="h-4 w-4" />
              Overall Summary
            </h4>
            <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-4 border border-blue-200 dark:border-blue-900">
              <p className="text-sm leading-relaxed">
                {summary}
              </p>
            </div>
          </div>
        )}

        {/* Metrics Grid */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold">Performance Metrics</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {metricsData.map((metric, index) => {
              // Backend returns values as percentages (0-100), not decimals (0-1)
              const displayValue = metric.inverse ? (100 - metric.value) : metric.value;
              const percentage = displayValue; // Already a percentage
              const Icon = metric.icon;

              return (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">{metric.name}</span>
                    </div>
                    <span className={`text-sm font-bold ${getMetricColor(displayValue)}`}>
                      {percentage.toFixed(1)}%
                    </span>
                  </div>
                  <div className="relative h-2 w-full overflow-hidden rounded-full bg-secondary">
                    <div
                      className={`h-full transition-all ${getMetricBgColor(displayValue)}`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Strengths */}
        {strengths && strengths.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-semibold flex items-center gap-2 text-green-700 dark:text-green-400">
              <CheckCircle2 className="h-4 w-4" />
              Strengths Observed
            </h4>
            <div className="space-y-3">
              {strengths.map((strength, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900"
                >
                  <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      {strength.metric && (
                        <span className="text-sm font-medium">{strength.metric}</span>
                      )}
                      {strength.category && (
                        <Badge variant="outline" className={getCategoryBadge(strength.category)}>
                          {strength.category}
                        </Badge>
                      )}
                      {strength.score !== undefined && (
                        <span className="text-xs text-muted-foreground">
                          Score: {strength.score.toFixed(1)}%
                        </span>
                      )}
                    </div>
                    {strength.message && (
                      <p className="text-sm leading-relaxed">{strength.message}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Areas for Improvement */}
        {improvements && improvements.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-semibold flex items-center gap-2 text-orange-700 dark:text-orange-400">
              <AlertTriangle className="h-4 w-4" />
              Areas for Improvement
            </h4>
            <div className="space-y-3">
              {improvements.map((improvement, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3 rounded-lg bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-900"
                >
                  <AlertTriangle className="h-5 w-5 text-orange-600 dark:text-orange-400 shrink-0 mt-0.5" />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      {improvement.metric && (
                        <span className="text-sm font-medium">{improvement.metric}</span>
                      )}
                      {improvement.category && (
                        <Badge variant="outline" className={getCategoryBadge(improvement.category)}>
                          {improvement.category}
                        </Badge>
                      )}
                      {improvement.score !== undefined && (
                        <span className="text-xs text-muted-foreground">
                          Score: {improvement.score.toFixed(1)}%
                        </span>
                      )}
                    </div>
                    {improvement.message && (
                      <p className="text-sm leading-relaxed">{improvement.message}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommendations */}
        {recommendations && recommendations.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-semibold flex items-center gap-2 text-blue-700 dark:text-blue-400">
              <Lightbulb className="h-4 w-4" />
              Actionable Recommendations
            </h4>
            <div className="space-y-3">
              {recommendations.map((rec, idx) => {
                const priorityBadge = getPriorityBadge(rec.priority);
                
                return (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900"
                  >
                    <Lightbulb className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        {rec.category && (
                          <Badge variant="outline" className={getCategoryBadge(rec.category)}>
                            {rec.category}
                          </Badge>
                        )}
                        {rec.priority && (
                          <Badge variant="outline" className={priorityBadge.className}>
                            {priorityBadge.label}
                          </Badge>
                        )}
                      </div>
                      {rec.message && (
                        <p className="text-sm leading-relaxed">{rec.message}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Metadata */}
        {videoFeedback.updatedAt && (
          <div className="pt-2 border-t">
            <p className="text-xs text-muted-foreground">
              Video analyzed on {new Date(videoFeedback.updatedAt).toLocaleString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
            {videoFeedback.video_path && (
              <p className="text-xs text-muted-foreground mt-1">
                Video file: {videoFeedback.video_path}
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

