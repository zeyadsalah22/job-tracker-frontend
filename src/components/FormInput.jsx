export default function FormInput({
  required,
  placeHolder,
  name,
  type,
  onChange,
  td = null,
  value,
  error,
  touched,
  textArea,
  disabled,
}) {
  return (
    <div className="flex flex-col gap-2 w-full">
      <label className="text-sm flex items-center text-gray-600">
        <p>{placeHolder}</p>
        <p className="text-red-500">{required && "*"}</p>
      </label>
      {textArea ? (
        <textarea
          name={name}
          onChange={onChange}
          value={value}
          placeholder={placeHolder}
          className={`${
            touched && error && "border-red-500 ring-red-500"
          } w-full h-[100px] resize-none rounded-md border px-4 py-2`}
        />
      ) : (
        <input
          name={name}
          type={type || "text"}
          onChange={onChange}
          value={value}
          placeholder={placeHolder}
          disabled={disabled}
          {...(type === "date" && td != null? { max: td } : {})}
          className={`${
            touched && error && "border-red-500 ring-red-500"
          } w-full rounded-md border px-4 py-2`}
        />
      )}
      {touched && error && (
        <span className="text-xs text-red-500">{error}</span>
      )}
    </div>
  );
}
