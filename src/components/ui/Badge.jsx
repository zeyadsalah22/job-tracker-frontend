import clsx from "clsx";

export function Badge({ className, variant = "default", children, ...props }) {
  const variantClasses = {
    default: "bg-primary text-primary-foreground",
    secondary: "bg-secondary text-secondary-foreground",
    destructive: "bg-destructive text-destructive-foreground",
    outline: "border border-input bg-background",
  };

  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset",
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
