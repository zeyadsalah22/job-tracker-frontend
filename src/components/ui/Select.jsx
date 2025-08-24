import { forwardRef, useState, createContext, useContext } from "react";
import clsx from "clsx";
import { ChevronDown, Check } from "lucide-react";

const SelectContext = createContext();

export const Select = ({ value, onValueChange, children, disabled }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <SelectContext.Provider value={{ isOpen, setIsOpen, value, onValueChange, disabled }}>
      <div className="relative">
        {children}
      </div>
    </SelectContext.Provider>
  );
};

export const SelectTrigger = forwardRef(({ className, children, ...props }, ref) => {
  const { isOpen, setIsOpen, disabled } = useContext(SelectContext);

  return (
    <button
      ref={ref}
      type="button"
      disabled={disabled}
      onClick={() => !disabled && setIsOpen(!isOpen)}
      className={clsx(
        "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      {children}
      <ChevronDown className={clsx("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
    </button>
  );
});

export const SelectValue = ({ placeholder, children }) => {
  const { value } = useContext(SelectContext);
  
  if (value && children) {
    return children;
  }
  return placeholder;
};

export const SelectContent = forwardRef(({ className, children, side = "bottom", ...props }, ref) => {
  const { isOpen } = useContext(SelectContext);
  
  if (!isOpen) return null;

  const positionClasses = side === "top" 
    ? "bottom-full left-0 right-0 mb-1" 
    : "top-full left-0 right-0 mt-1";

  return (
    <div
      ref={ref}
      className={clsx(
        "absolute z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md",
        positionClasses,
        className
      )}
      {...props}
    >
      <div className="p-1">
        {children}
      </div>
    </div>
  );
});

export const SelectItem = forwardRef(({ className, value, children, ...props }, ref) => {
  const { onValueChange, setIsOpen } = useContext(SelectContext);

  const handleClick = () => {
    onValueChange?.(value);
    setIsOpen?.(false);
  };

  return (
    <button
      ref={ref}
      type="button"
      onClick={handleClick}
      className={clsx(
        "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:bg-accent",
        className
      )}
      {...props}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        <Check className="h-4 w-4 opacity-0" />
      </span>
      {children}
    </button>
  );
});
