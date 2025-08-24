import Input from "./Input";
import Label from "./Label";

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
  // Support both placeholder and placeHolder for backward compatibility
  const placeholderText = placeholder || placeHolder;
  
  return (
    <div className="space-y-2">
      {label && (
        <Label htmlFor={name} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          {label}
        </Label>
      )}
      <Input
        id={name}
        name={name}
        type={type}
        placeholder={placeholderText}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className={`${touched && error ? "border-red-500" : ""} ${className}`}
        {...props}
      />
      {touched && error && (
        <div className="text-red-500 text-sm">{error}</div>
      )}
    </div>
  );
}
