import PropTypes from 'prop-types'

function Checkbox({ label, name, checked, onChange, className = '' }) {
  return (
    <div className={`flex items-start ${className}`}>
      <input
        type="checkbox"
        id={name}
        name={name}
        checked={checked}
        onChange={onChange}
        className="mt-1 mr-2 h-4 w-4 text-burnt-orange border-grid-gray rounded
                   focus:ring-2 focus:ring-burnt-orange focus:ring-offset-0
                   cursor-pointer"
      />
      <label htmlFor={name} className="text-sm cursor-pointer select-none">
        {label}
      </label>
    </div>
  )
}

Checkbox.propTypes = {
  label: PropTypes.node.isRequired,
  name: PropTypes.string.isRequired,
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  className: PropTypes.string,
}

export default Checkbox
