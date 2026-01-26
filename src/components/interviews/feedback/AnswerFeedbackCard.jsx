import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/Card";
import { Badge } from "../../ui/Badge";
import { Progress } from "../../ui/Progress";
import { CheckCircle2, AlertTriangle, TrendingUp, MessageSquare } from "lucide-react";

/**
 * Component to display feedback for a single interview question
 * @param {Object} feedback - The feedback object from the API
 * @param {number} index - Question index for display
 */
export default function AnswerFeedbackCard({ feedback, index }) {
  if (!feedback) return null;

  const { question, answer, score, feedback: feedbackText, strengths, improvements } = feedback;

  // Calculate score color and badge variant
  const getScoreColor = (score) => {
    if (score >= 4.5) return "text-green-600";
    if (score >= 3.5) return "text-blue-600";
    if (score >= 2.5) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBadge = (score) => {
    if (score >= 4.5) return { label: "Excellent", variant: "default", className: "bg-green-100 text-green-800" };
    if (score >= 3.5) return { label: "Good", variant: "default", className: "bg-blue-100 text-blue-800" };
    if (score >= 2.5) return { label: "Fair", variant: "default", className: "bg-yellow-100 text-yellow-800" };
    return { label: "Needs Work", variant: "default", className: "bg-red-100 text-red-800" };
  };

  const scoreBadge = getScoreBadge(score || 0);
  const scorePercentage = ((score || 0) / 5) * 100;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <CardTitle className="flex items-center gap-2 text-lg">
              <MessageSquare className="h-5 w-5 text-primary" />
              Question {index + 1}
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
              {question}
            </p>
          </div>
          <div className="flex flex-col items-end gap-2 shrink-0">
            <div className={`text-3xl font-bold ${getScoreColor(score || 0)}`}>
              {(score || 0).toFixed(1)}/5
            </div>
            <Badge variant={scoreBadge.variant} className={scoreBadge.className}>
              {scoreBadge.label}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Score Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Performance Score</span>
            <span className="font-medium">{scorePercentage.toFixed(0)}%</span>
          </div>
          <Progress value={scorePercentage} className="h-2" />
        </div>

        {/* Your Answer */}
        {answer && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Your Answer
            </h4>
            <div className="bg-muted/50 rounded-lg p-3">
              <p className="text-sm leading-relaxed whitespace-pre-line">
                {answer}
              </p>
            </div>
          </div>
        )}

        {/* Overall Feedback */}
        {feedbackText && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Overall Feedback
            </h4>
            <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-3 border border-blue-200 dark:border-blue-900">
              <p className="text-sm leading-relaxed">
                {feedbackText}
              </p>
            </div>
          </div>
        )}

        {/* Strengths */}
        {strengths && strengths.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold flex items-center gap-2 text-green-700 dark:text-green-400">
              <CheckCircle2 className="h-4 w-4" />
              Strengths
            </h4>
            <ul className="space-y-2">
              {strengths.map((strength, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{strength}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Areas for Improvement */}
        {improvements && improvements.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold flex items-center gap-2 text-orange-700 dark:text-orange-400">
              <AlertTriangle className="h-4 w-4" />
              Areas for Improvement
            </h4>
            <ul className="space-y-2">
              {improvements.map((improvement, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm">
                  <AlertTriangle className="h-4 w-4 text-orange-600 dark:text-orange-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{improvement}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Metadata */}
        {feedback.updatedAt && (
          <div className="pt-2 border-t">
            <p className="text-xs text-muted-foreground">
              Analyzed on {new Date(feedback.updatedAt).toLocaleString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

