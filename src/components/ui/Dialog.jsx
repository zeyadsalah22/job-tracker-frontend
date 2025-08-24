import { forwardRef } from "react";
import clsx from "clsx";
import { X } from "lucide-react";

export const Dialog = ({ open, onOpenChange, children }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div 
        className="fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
        onClick={() => onOpenChange?.(false)}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {children}
      </div>
    </div>
  );
};

export const DialogContent = forwardRef(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={clsx(
        "relative grid w-full max-w-4xl gap-4 border bg-background p-6 shadow-lg duration-200 sm:rounded-lg",
        "animate-in fade-in-0 zoom-in-95 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        className
      )}
      onClick={(e) => e.stopPropagation()}
      {...props}
    >
      {children}
    </div>
  );
});

export const DialogHeader = ({ className, children, ...props }) => {
  return (
    <div className={clsx("flex flex-col space-y-1.5 text-center sm:text-left", className)} {...props}>
      {children}
    </div>
  );
};

export const DialogTitle = ({ className, children, ...props }) => {
  return (
    <h2 className={clsx("text-lg font-semibold leading-none tracking-tight", className)} {...props}>
      {children}
    </h2>
  );
};

export const DialogDescription = ({ className, children, ...props }) => {
  return (
    <p className={clsx("text-sm text-muted-foreground", className)} {...props}>
      {children}
    </p>
  );
};

export const DialogFooter = ({ className, children, ...props }) => {
  return (
    <div className={clsx("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)} {...props}>
      {children}
    </div>
  );
};

export const DialogClose = ({ className, children, ...props }) => {
  return (
    <button
      className={clsx(
        "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground",
        className
      )}
      {...props}
    >
      <X className="h-4 w-4" />
      <span className="sr-only">Close</span>
    </button>
  );
};
