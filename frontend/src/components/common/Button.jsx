import PropTypes from 'prop-types'

function Button({
  children,
  variant = 'primary',
  type = 'button',
  onClick,
  disabled = false,
  className = '',
  fullWidth = false,
}) {
  const baseClasses = fullWidth ? 'w-full' : ''

  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    text: 'text-burnt-orange hover:underline transition-all duration-200',
  }

  const disabledClasses = disabled
    ? 'opacity-50 cursor-not-allowed pointer-events-none'
    : ''

  const buttonClasses = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${disabledClasses}
    ${className}
  `.trim()

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={buttonClasses}
    >
      {children}
    </button>
  )
}

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['primary', 'secondary', 'text']),
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  fullWidth: PropTypes.bool,
}

export default Button
