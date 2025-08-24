import { useState, createContext, useContext } from "react";
import { ChevronDown } from "lucide-react";
import clsx from "clsx";

const AccordionContext = createContext();

export const Accordion = ({ type = "single", collapsible = false, className, children, ...props }) => {
  const [openItems, setOpenItems] = useState(new Set());

  const toggleItem = (value) => {
    if (type === "single") {
      if (openItems.has(value)) {
        setOpenItems(collapsible ? new Set() : openItems);
      } else {
        setOpenItems(new Set([value]));
      }
    } else {
      const newOpenItems = new Set(openItems);
      if (newOpenItems.has(value)) {
        newOpenItems.delete(value);
      } else {
        newOpenItems.add(value);
      }
      setOpenItems(newOpenItems);
    }
  };

  return (
    <AccordionContext.Provider value={{ openItems, toggleItem }}>
      <div className={clsx("space-y-2", className)} {...props}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
};

export const AccordionItem = ({ value, className, children, ...props }) => {
  const { openItems } = useContext(AccordionContext);
  const isOpen = openItems.has(value);

  return (
    <div 
      className={clsx("border rounded-lg overflow-hidden", className)} 
      data-state={isOpen ? "open" : "closed"}
      {...props}
    >
      {children}
    </div>
  );
};

export const AccordionTrigger = ({ className, children, ...props }) => {
  return (
    <button
      className={clsx(
        "flex flex-1 items-center justify-between py-4 px-6 w-full text-left font-medium transition-all hover:underline",
        className
      )}
      {...props}
    >
      {children}
      <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
    </button>
  );
};

export const AccordionContent = ({ className, children, ...props }) => {
  const { openItems } = useContext(AccordionContext);
  
  return (
    <div
      className={clsx(
        "overflow-hidden text-sm transition-all",
        className
      )}
      {...props}
    >
      <div className="px-6 pb-4 pt-0">
        {children}
      </div>
    </div>
  );
};
