import PropTypes from 'prop-types'
import { useMemo } from 'react'

function Card({ children, className = '', hover = true, rotation = 'random', onClick }) {
  // Generate random rotation for stamp effect
  const rotationDeg = useMemo(() => {
    if (rotation === 'random') {
      const rotations = [-2, -1, 0, 1, 2]
      return rotations[Math.floor(Math.random() * rotations.length)]
    }
    return rotation
  }, [rotation])

  const cardClasses = `
    card-stamp
    ${hover ? 'cursor-pointer' : ''}
    ${className}
  `.trim()

  const style = {
    '--rotation': `${rotationDeg}deg`,
  }

  return (
    <div
      className={cardClasses}
      style={style}
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
      {children}
    </div>
  )
}

Card.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  hover: PropTypes.bool,
  rotation: PropTypes.oneOfType([PropTypes.number, PropTypes.oneOf(['random'])]),
  onClick: PropTypes.func,
}

export default Card
