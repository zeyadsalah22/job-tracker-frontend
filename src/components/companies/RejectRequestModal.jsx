import React, { useState } from "react";
import { X, Loader2 } from "lucide-react";
import Button from "../ui/Button";
import Label from "../ui/Label";
import Textarea from "../ui/Textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/Dialog";

export default function RejectRequestModal({ 
  isOpen, 
  onClose, 
  request,
  onReject
}) {
  const [rejectionReason, setRejectionReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!rejectionReason.trim()) {
      setError("Rejection reason is required");
      return;
    }

    if (rejectionReason.length > 1000) {
      setError("Rejection reason must not exceed 1000 characters");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await onReject(request.requestId, rejectionReason);
      
      // Reset and close
      setRejectionReason("");
      onClose();
    } catch (err) {
      setError(err.message || "Failed to reject request");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setRejectionReason("");
    setError("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Reject Company Request
            <button
              onClick={handleClose}
              className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </button>
          </DialogTitle>
          <DialogDescription>
            Please provide a reason for rejecting the request for "{request?.companyName}". 
            This will be sent to the user who submitted the request.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Rejection Reason */}
          <div className="space-y-2">
            <Label htmlFor="rejectionReason">
              Rejection Reason <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="rejectionReason"
              value={rejectionReason}
              onChange={(e) => {
                setRejectionReason(e.target.value);
                setError("");
              }}
              placeholder="e.g., Company already exists in our database with a different name, or insufficient information provided..."
              maxLength={1000}
              rows={5}
              className={error ? "border-destructive" : ""}
            />
            <p className="text-xs text-muted-foreground">
              {rejectionReason.length}/1000 characters
            </p>
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || !rejectionReason.trim()}
              variant="destructive"
              className="min-w-[100px]"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Rejecting...</span>
                </div>
              ) : (
                "Reject Request"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

