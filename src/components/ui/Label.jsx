import clsx from "clsx";

export default function Label({ className, children, required }) {
  return (
    <label className={clsx("text-sm text-gray-600 flex items-center", className)}>
      <span>{children}</span>
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
  );
}


