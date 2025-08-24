import clsx from "clsx";
import { forwardRef } from "react";

const Input = forwardRef(function Input({ className, invalid, ...props }, ref) {
  return (
    <input
      ref={ref}
      className={clsx(
        "flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 focus:scale-[1.02] focus:border-primary",
        invalid && "border-red-500 ring-red-500",
        className
      )}
      {...props}
    />
  );
});

export default Input;


