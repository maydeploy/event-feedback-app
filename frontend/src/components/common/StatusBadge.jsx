import PropTypes from 'prop-types'

const STATUS_CONFIG = {
  pending: {
    label: 'Pending Review',
    color: 'bg-grid-gray text-text-primary',
  },
  exploring: {
    label: "We're exploring this",
    color: 'bg-pastel-yellow text-text-primary',
  },
  'lets-do-this': {
    label: "Let's make this happen!",
    color: 'bg-pastel-pink text-text-primary',
  },
  done: {
    label: 'We did it!',
    color: 'bg-pastel-sage text-text-primary',
  },
  'maybe-later': {
    label: 'Maybe later',
    color: 'bg-pastel-lavender text-text-primary',
  },
}

function StatusBadge({ status, className = '' }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.pending

  return (
    <span className={`status-badge ${config.color} ${className}`}>
      {config.label}
    </span>
  )
}

StatusBadge.propTypes = {
  status: PropTypes.oneOf([
    'pending',
    'exploring',
    'lets-do-this',
    'done',
    'maybe-later',
  ]).isRequired,
  className: PropTypes.string,
}

export default StatusBadge
