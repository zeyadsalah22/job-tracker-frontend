import { forwardRef } from "react";
import { Check } from "lucide-react";
import clsx from "clsx";

const Checkbox = forwardRef(function Checkbox(
  { className, checked, onCheckedChange, disabled, ...props },
  ref
) {
  const handleChange = (e) => {
    if (onCheckedChange) {
      onCheckedChange(e.target.checked);
    }
  };

  return (
    <input
      ref={ref}
      type="checkbox"
      className={clsx(
        "peer h-4 w-4 shrink-0 rounded-sm border border-primary shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 sr-only",
        className
      )}
      checked={checked}
      onChange={handleChange}
      disabled={disabled}
      {...props}
    />
  );
});

// Custom checkbox with visual styling
export const CheckboxWithLabel = forwardRef(function CheckboxWithLabel(
  { className, checked, onCheckedChange, disabled, children, id, ...props },
  ref
) {
  return (
    <div className="flex items-center space-x-2">
      <div className="relative">
        <input
          ref={ref}
          type="checkbox"
          id={id}
          className="sr-only"
          checked={checked}
          onChange={(e) => onCheckedChange?.(e.target.checked)}
          disabled={disabled}
          {...props}
        />
        <div
          className={clsx(
            "h-4 w-4 rounded-sm border border-input bg-background transition-colors",
            "flex items-center justify-center",
            checked && "bg-primary border-primary text-primary-foreground",
            disabled && "cursor-not-allowed opacity-50",
            !disabled && "cursor-pointer hover:border-primary/60",
            className
          )}
          onClick={() => !disabled && onCheckedChange?.(!checked)}
        >
          {checked && <Check className="h-3 w-3" />}
        </div>
      </div>
      {children && (
        <label
          htmlFor={id}
          className={clsx(
            "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
            !disabled && "cursor-pointer"
          )}
        >
          {children}
        </label>
      )}
    </div>
  );
});

export default Checkbox;
