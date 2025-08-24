import React from "react";
import { cn } from "../../lib/utils.ts";

const PopoverContext = React.createContext();

const Popover = ({ children }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  
  return (
    <PopoverContext.Provider value={{ isOpen, setIsOpen }}>
      <div className="relative">
        {children}
      </div>
    </PopoverContext.Provider>
  );
};

const PopoverTrigger = React.forwardRef(({ className, children, asChild, ...props }, ref) => {
  const { setIsOpen } = React.useContext(PopoverContext);
  
  const handleClick = () => {
    setIsOpen(prev => !prev);
  };
  
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      ...props,
      ref,
      onClick: handleClick,
    });
  }
  
  return (
    <button
      ref={ref}
      className={className}
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  );
});
PopoverTrigger.displayName = "PopoverTrigger";

const PopoverContent = React.forwardRef(({ 
  className, 
  align = "center", 
  sideOffset = 4, 
  children, 
  ...props 
}, ref) => {
  const { isOpen, setIsOpen } = React.useContext(PopoverContext);
  const contentRef = React.useRef(null);
  
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (contentRef.current && !contentRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen, setIsOpen]);
  
  if (!isOpen) return null;
  
  const alignmentClasses = {
    start: "left-0",
    center: "left-1/2 transform -translate-x-1/2",
    end: "right-0"
  };
  
  return (
    <div
      ref={contentRef}
      className={cn(
        "absolute z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
        "top-full mt-1",
        alignmentClasses[align],
        className
      )}
      style={{ marginTop: sideOffset }}
      {...props}
    >
      {children}
    </div>
  );
});
PopoverContent.displayName = "PopoverContent";

export { Popover, PopoverTrigger, PopoverContent };
