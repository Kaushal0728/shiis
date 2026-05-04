export default function FormInput({
  label,
  name,
  type = "text",
  value,
  onChange,
  error,
  required = false,
  placeholder = "",
  ...props
}) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-surface-600"
        >
          {label}
          {required && <span className="text-red-400 ml-0.5">*</span>}
        </label>
      )}
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`
          w-full px-3.5 py-2.5 rounded-[var(--radius-input)] text-sm
          bg-white border text-surface-800
          placeholder-surface-400
          focus:outline-none focus:ring-2 transition-all duration-200
          ${
            error
              ? "border-red-400/60 focus:ring-red-500/20 focus:border-red-500/60"
              : "border-surface-300/70 focus:ring-primary-500/20 focus:border-primary-500/60"
          }
        `}
        {...props}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
