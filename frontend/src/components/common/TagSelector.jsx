import PropTypes from 'prop-types'
import Tag from './Tag'

// Available tags for submissions
export const AVAILABLE_TAGS = [
  'venue',
  'food',
  'topic ideas',
  'speaker requests',
  'format',
  'timing',
  'accessibility',
  'other',
]

function TagSelector({
  label = 'Tags',
  selectedTags = [],
  onChange,
  availableTags = AVAILABLE_TAGS,
  className = '',
  handwritten = false,
}) {
  const labelClass = handwritten ? 'font-handwritten' : 'font-serif'

  const handleTagClick = (tag) => {
    if (selectedTags.includes(tag)) {
      // Remove tag
      onChange(selectedTags.filter((t) => t !== tag))
    } else {
      // Add tag
      onChange([...selectedTags, tag])
    }
  }

  return (
    <div className={`mb-4 ${className}`}>
      {label && <label className={`block mb-2 ${labelClass}`}>{label}</label>}
      <div className="flex flex-wrap gap-2">
        {availableTags.map((tag) => (
          <Tag
            key={tag}
            label={tag}
            selected={selectedTags.includes(tag)}
            onClick={() => handleTagClick(tag)}
          />
        ))}
      </div>
    </div>
  )
}

TagSelector.propTypes = {
  label: PropTypes.string,
  selectedTags: PropTypes.arrayOf(PropTypes.string),
  onChange: PropTypes.func.isRequired,
  availableTags: PropTypes.arrayOf(PropTypes.string),
  className: PropTypes.string,
  handwritten: PropTypes.bool,
}

export default TagSelector
