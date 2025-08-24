import { forwardRef } from "react";
import clsx from "clsx";

const baseStyles =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0";

const variantStyles = {
  primary:
    "bg-primary text-white hover:bg-primary/90 focus-visible:ring-primary",
  secondary:
    "bg-gray-100 text-gray-900 hover:bg-gray-200 focus-visible:ring-gray-300",
  outline:
    "border border-gray-300 bg-transparent text-gray-900 hover:bg-gray-50 focus-visible:ring-gray-300",
  ghost: "bg-transparent text-gray-900 hover:bg-gray-100",
  hero: "bg-gradient-to-r from-primary to-primary-dark text-primary-foreground font-semibold shadow-lg hover:shadow-glow hover:scale-105 hover:from-primary-dark hover:to-primary",
  "outline-hero": "border-2 border-primary text-primary bg-transparent font-semibold hover:bg-primary hover:text-primary-foreground hover:scale-105",
};

const sizeStyles = {
  default: "h-10 px-4 py-2",
  sm: "h-9 rounded-md px-3",
  md: "h-10 px-4 py-2",
  lg: "h-12 rounded-xl px-8 text-base",
  xl: "h-14 rounded-xl px-10 text-lg",
  icon: "h-10 w-10",
};

const Button = forwardRef(function Button(
  { className, variant = "primary", size = "default", ...props },
  ref
) {
  return (
    <button
      ref={ref}
      className={clsx(baseStyles, variantStyles[variant], sizeStyles[size], className)}
      {...props}
    />
  );
});

export default Button;


