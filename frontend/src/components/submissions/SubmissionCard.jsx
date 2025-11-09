import { useState } from 'react'
import PropTypes from 'prop-types'
import Card from '../common/Card'
import Tag from '../common/Tag'
import StatusBadge from '../common/StatusBadge'
import { getVote, storeVote, removeVote } from '../../utils/session'

function SubmissionCard({ submission, onVote, onExpand }) {
  const [currentVote, setCurrentVote] = useState(getVote(submission.id))

  const handleVote = async (voteType) => {
    const previousVote = currentVote

    // Toggle logic
    let newVote = null
    if (currentVote === voteType) {
      // Remove vote
      newVote = null
      removeVote(submission.id)
    } else {
      // Add or change vote
      newVote = voteType
      storeVote(submission.id, voteType)
    }

    setCurrentVote(newVote)

    // Call parent to update server
    try {
      await onVote(submission.id, newVote)
    } catch (error) {
      // Revert on error
      setCurrentVote(previousVote)
      if (previousVote) {
        storeVote(submission.id, previousVote)
      } else {
        removeVote(submission.id)
      }
    }
  }

  const truncateText = (text, maxLength = 200) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
  }

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now - date
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
    return date.toLocaleDateString()
  }

  const netVotes = submission.upvotes - submission.downvotes

  return (
    <Card className="relative" onClick={() => onExpand && onExpand(submission)}>
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs text-text-secondary uppercase tracking-wide">
              {submission.type}
            </span>
            <StatusBadge status={submission.status} />
          </div>
        </div>

        {/* Vote buttons */}
        <div className="flex items-center gap-2 ml-4" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => handleVote('upvote')}
            className={`transition-all duration-150 ${
              currentVote === 'upvote'
                ? 'text-burnt-orange scale-110'
                : 'text-text-secondary hover:text-burnt-orange'
            }`}
            aria-label="Upvote"
          >
            <span className="text-xl">⬆</span>
          </button>
          <span className={`text-sm font-semibold ${netVotes > 0 ? 'text-pastel-sage' : netVotes < 0 ? 'text-text-secondary' : ''}`}>
            {netVotes > 0 ? `+${netVotes}` : netVotes}
          </span>
          <button
            onClick={() => handleVote('downvote')}
            className={`transition-all duration-150 ${
              currentVote === 'downvote'
                ? 'text-text-secondary scale-110'
                : 'text-text-secondary hover:text-burnt-orange'
            }`}
            aria-label="Downvote"
          >
            <span className="text-xl">⬇</span>
          </button>
        </div>
      </div>

      <p className="text-text-primary mb-3">
        {truncateText(submission.text)}
        {submission.text.length > 200 && (
          <button className="text-burnt-orange hover:underline ml-1">
            read more
          </button>
        )}
      </p>

      {submission.tags && submission.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {submission.tags.map((tag, index) => (
            <Tag key={index} label={tag} />
          ))}
        </div>
      )}

      <div className="flex justify-between items-center text-sm text-text-secondary">
        <span>{submission.submitter_name || 'Anonymous'}</span>
        <span>{formatTimestamp(submission.created_at)}</span>
      </div>

      {submission.hasResponse && (
        <div className="mt-3 pt-3 border-t border-grid-gray">
          <span className="text-sm text-burnt-orange">
            Organizer responded ↓
          </span>
        </div>
      )}
    </Card>
  )
}

SubmissionCard.propTypes = {
  submission: PropTypes.object.isRequired,
  onVote: PropTypes.func.isRequired,
  onExpand: PropTypes.func,
}

export default SubmissionCard
