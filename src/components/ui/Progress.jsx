import clsx from "clsx";

export function Progress({ className, value = 0, max = 100, ...props }) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div
      className={clsx("relative h-2 w-full overflow-hidden rounded-full bg-secondary", className)}
      {...props}
    >
      <div
        className="h-full w-full flex-1 bg-primary transition-all"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}
