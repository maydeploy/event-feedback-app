// Check if user can submit based on rate limits
// Feedback/Ideas: 3 per hour
// Collaborations: 2 per day

const RATE_LIMITS = {
  submission: { limit: 3, window: 60 * 60 * 1000 }, // 3 per hour
  collaboration: { limit: 2, window: 24 * 60 * 60 * 1000 }, // 2 per day
}

// Get submissions from localStorage
function getSubmissions(type) {
  const key = `${type}_submissions`
  const data = localStorage.getItem(key)
  return data ? JSON.parse(data) : []
}

// Add a new submission timestamp
function addSubmission(type) {
  const submissions = getSubmissions(type)
  submissions.push(Date.now())
  localStorage.setItem(`${type}_submissions`, JSON.stringify(submissions))
}

// Clean old submissions outside the time window
function cleanOldSubmissions(type) {
  const config = RATE_LIMITS[type]
  const submissions = getSubmissions(type)
  const now = Date.now()
  const validSubmissions = submissions.filter(
    (timestamp) => now - timestamp < config.window
  )
  localStorage.setItem(`${type}_submissions`, JSON.stringify(validSubmissions))
  return validSubmissions
}

// Check if user can submit
export function canSubmit(type) {
  const config = RATE_LIMITS[type]
  const validSubmissions = cleanOldSubmissions(type)
  return validSubmissions.length < config.limit
}

// Record a submission
export function recordSubmission(type) {
  addSubmission(type)
}

// Get remaining submissions count
export function getRemainingSubmissions(type) {
  const config = RATE_LIMITS[type]
  const validSubmissions = cleanOldSubmissions(type)
  return Math.max(0, config.limit - validSubmissions.length)
}

// Get time until next submission is available
export function getTimeUntilNextSubmission(type) {
  const config = RATE_LIMITS[type]
  const submissions = cleanOldSubmissions(type)

  if (submissions.length < config.limit) {
    return 0 // Can submit now
  }

  const oldestSubmission = Math.min(...submissions)
  const timeUntilExpiry = config.window - (Date.now() - oldestSubmission)
  return Math.max(0, timeUntilExpiry)
}

// Format time in human-readable format
export function formatTimeRemaining(milliseconds) {
  const minutes = Math.ceil(milliseconds / (60 * 1000))
  const hours = Math.floor(minutes / 60)

  if (hours > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''}`
  }
  return `${minutes} minute${minutes > 1 ? 's' : ''}`
}
