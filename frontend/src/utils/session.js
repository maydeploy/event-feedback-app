// Generate or retrieve session ID
export function getSessionId() {
  let sessionId = localStorage.getItem('sessionId')

  if (!sessionId) {
    sessionId = generateSessionId()
    localStorage.setItem('sessionId', sessionId)
  }

  return sessionId
}

// Generate a unique session ID
function generateSessionId() {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

// Store vote in session storage
export function storeVote(submissionId, voteType) {
  const votes = getVotes()
  votes[submissionId] = voteType
  sessionStorage.setItem('votes', JSON.stringify(votes))
}

// Get all votes from session storage
export function getVotes() {
  const votesJson = sessionStorage.getItem('votes')
  return votesJson ? JSON.parse(votesJson) : {}
}

// Get vote for a specific submission
export function getVote(submissionId) {
  const votes = getVotes()
  return votes[submissionId] || null
}

// Remove vote for a specific submission
export function removeVote(submissionId) {
  const votes = getVotes()
  delete votes[submissionId]
  sessionStorage.setItem('votes', JSON.stringify(votes))
}
