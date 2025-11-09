import pool from '../db/connection.js'

const RATE_LIMITS = {
  submission: { limit: 3, window: 60 * 60 * 1000 }, // 3 per hour
  collaboration: { limit: 2, window: 24 * 60 * 60 * 1000 }, // 2 per day
}

// Clean old rate limit records
async function cleanOldRecords() {
  const query = `
    DELETE FROM rate_limits
    WHERE timestamp < NOW() - INTERVAL '24 hours'
  `
  await pool.query(query)
}

// Check if user has exceeded rate limit
async function checkRateLimit(sessionId, actionType) {
  const config = RATE_LIMITS[actionType]
  if (!config) return true

  const cutoffTime = new Date(Date.now() - config.window).toISOString()

  const query = `
    SELECT COUNT(*) as count
    FROM rate_limits
    WHERE session_id = ?
      AND action_type = ?
      AND timestamp > ?
  `

  const result = await pool.query(query, [sessionId, actionType, cutoffTime])
  const count = parseInt(result.rows[0].count)

  return count < config.limit
}

// Record a rate limit action
async function recordAction(sessionId, actionType) {
  const query = `
    INSERT INTO rate_limits (session_id, action_type)
    VALUES (?, ?)
  `
  await pool.query(query, [sessionId, actionType])
}

// Middleware factory for rate limiting
export function rateLimitMiddleware(actionType) {
  return async (req, res, next) => {
    try {
      const sessionId = req.headers['x-session-id']

      if (!sessionId) {
        return res.status(400).json({
          success: false,
          message: 'Session ID required',
        })
      }

      // Clean old records periodically
      if (Math.random() < 0.1) {
        cleanOldRecords().catch(console.error)
      }

      const allowed = await checkRateLimit(sessionId, actionType)

      if (!allowed) {
        const config = RATE_LIMITS[actionType]
        const windowHours = config.window / (60 * 60 * 1000)

        return res.status(429).json({
          success: false,
          message: `Rate limit exceeded. Maximum ${config.limit} ${actionType}s per ${windowHours} hour(s).`,
        })
      }

      // Store session ID for later use
      req.sessionId = sessionId

      next()
    } catch (error) {
      console.error('Rate limit error:', error)
      res.status(500).json({
        success: false,
        message: 'Error checking rate limit',
      })
    }
  }
}

export { recordAction }
