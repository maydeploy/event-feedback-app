import PropTypes from 'prop-types'

function TextInput({
  label,
  name,
  value,
  onChange,
  type = 'text',
  placeholder = '',
  required = false,
  error = '',
  className = '',
  handwritten = false,
}) {
  const labelClass = handwritten ? 'font-handwritten' : 'font-serif'

  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label htmlFor={name} className={`block mb-2 ${labelClass}`}>
          {label}
          {required && <span className="text-burnt-orange ml-1">*</span>}
        </label>
      )}
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`form-input ${error ? 'border-burnt-orange' : ''}`}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${name}-error` : undefined}
      />
      {error && (
        <p id={`${name}-error`} className="text-burnt-orange text-sm mt-1">
          {error}
        </p>
      )}
    </div>
  )
}

TextInput.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  type: PropTypes.string,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  error: PropTypes.string,
  className: PropTypes.string,
  handwritten: PropTypes.bool,
}

export default TextInput
