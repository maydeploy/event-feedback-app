import PropTypes from 'prop-types'
import { getCharCountColorClass } from '../../utils/validation'

function TextArea({
  label,
  name,
  value,
  onChange,
  placeholder = '',
  required = false,
  error = '',
  maxLength = 500,
  minLength = 10,
  showCharCount = true,
  className = '',
  handwritten = false,
  rows = 6,
}) {
  const labelClass = handwritten ? 'font-handwritten' : 'font-serif'
  const charCountColor = getCharCountColorClass(value.length, maxLength)

  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label htmlFor={name} className={`block mb-2 ${labelClass}`}>
          {label}
          {required && <span className="text-burnt-orange ml-1">*</span>}
        </label>
      )}
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        maxLength={maxLength}
        rows={rows}
        className={`form-textarea ${error ? 'border-burnt-orange' : ''}`}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={
          error ? `${name}-error` : showCharCount ? `${name}-count` : undefined
        }
      />
      <div className="flex justify-between items-center mt-1">
        {error ? (
          <p id={`${name}-error`} className="text-burnt-orange text-sm">
            {error}
          </p>
        ) : (
          <div className="text-sm text-text-secondary">
            {minLength && value.length < minLength && (
              <span>At least {minLength} characters needed</span>
            )}
          </div>
        )}
        {showCharCount && (
          <p id={`${name}-count`} className={`text-sm ${charCountColor}`}>
            {value.length} / {maxLength}
          </p>
        )}
      </div>
    </div>
  )
}

TextArea.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  error: PropTypes.string,
  maxLength: PropTypes.number,
  minLength: PropTypes.number,
  showCharCount: PropTypes.bool,
  className: PropTypes.string,
  handwritten: PropTypes.bool,
  rows: PropTypes.number,
}

export default TextArea
