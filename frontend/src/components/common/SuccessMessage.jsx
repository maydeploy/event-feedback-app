import PropTypes from 'prop-types'
import Card from './Card'

function SuccessMessage({ message, onClose }) {
  return (
    <Card className="bg-pastel-sage border-2 border-pastel-sage" rotation={0}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center mb-2">
            <span className="text-2xl mr-2">✓</span>
            <h3 className="font-serif font-semibold">Success!</h3>
          </div>
          <p className="text-text-primary">{message}</p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-text-secondary hover:text-burnt-orange ml-4 text-xl"
            aria-label="Close message"
          >
            ×
          </button>
        )}
      </div>
    </Card>
  )
}

SuccessMessage.propTypes = {
  message: PropTypes.string.isRequired,
  onClose: PropTypes.func,
}

export default SuccessMessage
