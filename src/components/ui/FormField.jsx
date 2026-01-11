import { useState } from "react";
import Input from "./Input";
import Label from "./Label";
import { Eye, EyeOff } from "lucide-react";

export default function FormField({ 
  name, 
  type = "text", 
  placeholder, 
  placeHolder, // Legacy prop support
  label, 
  value, 
  onChange, 
  onBlur,
  error, 
  touched,
  className = "",
  ...props 
}) {
  const [showPassword, setShowPassword] = useState(false);
  
  // Support both placeholder and placeHolder for backward compatibility
  const placeholderText = placeholder || placeHolder;
  
  // Determine the actual input type
  const inputType = type === "password" && showPassword ? "text" : type;
  
  return (
    <div className="space-y-2">
      {label && (
        <Label htmlFor={name} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          {label}
        </Label>
      )}
      <div className="relative">
        <Input
          id={name}
          name={name}
          type={inputType}
          placeholder={placeholderText}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          className={`${touched && error ? "border-red-500" : ""} ${type === "password" ? "pr-10" : ""} ${className}`}
          {...props}
        />
        {type === "password" && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        )}
      </div>
      {touched && error && (
        <div className="text-red-500 text-sm">{error}</div>
      )}
    </div>
  );
}
