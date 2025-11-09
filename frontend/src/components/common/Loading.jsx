import PropTypes from 'prop-types'

function Loading({ message = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-burnt-orange mb-4"></div>
      <p className="text-text-secondary">{message}</p>
    </div>
  )
}

Loading.propTypes = {
  message: PropTypes.string,
}

export default Loading
