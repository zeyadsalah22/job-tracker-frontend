import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../../lib/utils.ts";

const Calendar = ({ 
  mode = "single", 
  selected, 
  onSelect, 
  initialFocus = false,
  className,
  ...props 
}) => {
  const [currentDate, setCurrentDate] = React.useState(new Date());
  
  const today = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
  const firstDayOfWeek = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();
  
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  
  const dayNames = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  
  const days = [];
  
  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDayOfWeek; i++) {
    days.push(null);
  }
  
  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day);
  }
  
  const handleDateClick = (day) => {
    if (day && onSelect) {
      const newDate = new Date(currentYear, currentMonth, day);
      onSelect(newDate);
    }
  };
  
  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };
  
  const isSelected = (day) => {
    if (!day || !selected) return false;
    const dayDate = new Date(currentYear, currentMonth, day);
    return selected.toDateString() === dayDate.toDateString();
  };
  
  const isToday = (day) => {
    if (!day) return false;
    const dayDate = new Date(currentYear, currentMonth, day);
    return today.toDateString() === dayDate.toDateString();
  };
  
  return (
    <div className={cn("p-3", className)} {...props}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={() => navigateMonth(-1)}
          className="p-1 hover:bg-accent rounded-sm"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div className="font-semibold">
          {monthNames[currentMonth]} {currentYear}
        </div>
        <button
          type="button"
          onClick={() => navigateMonth(1)}
          className="p-1 hover:bg-accent rounded-sm"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
      
      {/* Day names */}
      <div className="grid grid-cols-7 mb-2">
        {dayNames.map((dayName) => (
          <div key={dayName} className="text-center text-sm font-medium text-muted-foreground p-2">
            {dayName}
          </div>
        ))}
      </div>
      
      {/* Days grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => (
          <button
            key={index}
            type="button"
            onClick={() => handleDateClick(day)}
            disabled={!day}
            className={cn(
              "h-9 w-9 text-center text-sm rounded-sm hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
              !day && "cursor-default",
              isSelected(day) && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
              isToday(day) && !isSelected(day) && "bg-accent text-accent-foreground",
              day && "cursor-pointer"
            )}
          >
            {day}
          </button>
        ))}
      </div>
    </div>
  );
};

export { Calendar };
