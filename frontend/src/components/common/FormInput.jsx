export default function FormInput({
  label,
  name,
  type = 'text',
  value,
  onChange,
  error,
  required = false,
  placeholder = '',
  ...props
}) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-surface-300"
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
          bg-surface-800/60 border text-surface-200
          placeholder-surface-500
          focus:outline-none focus:ring-2 transition-all duration-200
          ${error
            ? 'border-red-500/50 focus:ring-red-500/20 focus:border-red-500/60'
            : 'border-surface-700/40 focus:ring-primary-500/20 focus:border-primary-500/50'
          }
        `}
        {...props}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
