import PropTypes from 'prop-types'

function Select({
  label,
  name,
  value,
  onChange,
  options = [],
  placeholder = 'Select an option',
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
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className={`form-input ${error ? 'border-burnt-orange' : ''}`}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${name}-error` : undefined}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p id={`${name}-error`} className="text-burnt-orange text-sm mt-1">
          {error}
        </p>
      )}
    </div>
  )
}

Select.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ),
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  error: PropTypes.string,
  className: PropTypes.string,
  handwritten: PropTypes.bool,
}

export default Select
