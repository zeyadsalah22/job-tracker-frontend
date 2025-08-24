import clsx from "clsx";

export default function Avatar({ className, src, alt, fallback, size = "md" }) {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
    xl: "h-16 w-16",
  };

  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        className={clsx("rounded-full object-cover", sizeClasses[size], className)}
      />
    );
  }

  return (
    <div
      className={clsx(
        "rounded-full bg-primary/10 text-primary flex items-center justify-center font-medium",
        sizeClasses[size],
        className
      )}
    >
      {fallback || "U"}
    </div>
  );
}
