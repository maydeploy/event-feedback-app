import PropTypes from 'prop-types'

// Predefined tag colors
const TAG_COLORS = {
  venue: 'bg-pastel-blue text-text-primary',
  food: 'bg-pastel-sage text-text-primary',
  'topic ideas': 'bg-pastel-yellow text-text-primary',
  'speaker requests': 'bg-pastel-pink text-text-primary',
  format: 'bg-pastel-lavender text-text-primary',
  timing: 'bg-pastel-blue text-text-primary',
  accessibility: 'bg-pastel-sage text-text-primary',
  other: 'bg-grid-gray text-text-primary',
}

// Get color for a tag
function getTagColor(tag) {
  const lowerTag = tag.toLowerCase()
  return TAG_COLORS[lowerTag] || TAG_COLORS.other
}

function Tag({ label, onClick, selected = false, className = '' }) {
  const colorClass = getTagColor(label)
  const selectedClass = selected ? 'ring-2 ring-burnt-orange' : ''
  const clickableClass = onClick ? 'cursor-pointer hover:brightness-95' : ''

  const tagClasses = `
    tag-chip
    ${colorClass}
    ${selectedClass}
    ${clickableClass}
    ${className}
  `.trim()

  return (
    <span
      className={tagClasses}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick(e)
        }
      } : undefined}
    >
      {label}
    </span>
  )
}

Tag.propTypes = {
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  selected: PropTypes.bool,
  className: PropTypes.string,
}

export default Tag
