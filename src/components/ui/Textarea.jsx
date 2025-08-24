import clsx from "clsx";
import { forwardRef } from "react";

const Textarea = forwardRef(function Textarea({ className, invalid, ...props }, ref) {
  return (
    <textarea
      ref={ref}
      className={clsx(
        "flex w-full rounded-md border bg-white px-4 py-2 text-sm placeholder:text-gray-400 h-24 resize-none",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
        invalid ? "border-red-500 ring-red-500" : "border-gray-300",
        className
      )}
      {...props}
    />
  );
});

export default Textarea;


