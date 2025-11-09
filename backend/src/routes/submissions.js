import express from 'express'
import pool from '../db/connection.js'
import { rateLimitMiddleware, recordAction } from '../middleware/rateLimit.js'
import { validateSubmission } from '../middleware/validation.js'

const router = express.Router()

// Create a new submission (feedback or idea)
router.post(
  '/',
  rateLimitMiddleware('submission'),
  validateSubmission,
  async (req, res) => {
    try {
      const {
        type,
        text,
        tags = [],
        relatedEventId,
        submitterName,
        submitterEmail,
        emailOptin = false,
      } = req.body

      const query = `
        INSERT INTO submissions (
          type, text, tags, related_event_id, submitter_name, submitter_email, email_optin
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `

      const values = [
        type,
        text,
        JSON.stringify(tags), // SQLite stores arrays as JSON strings
        relatedEventId || null,
        submitterName || null,
        submitterEmail || null,
        emailOptin ? 1 : 0, // SQLite uses 0/1 for boolean
      ]

      const result = await pool.query(query, values)

      // Record the action for rate limiting
      await recordAction(req.sessionId, 'submission')

      res.status(201).json({
        success: true,
        message: 'Submission created successfully',
        data: { id: result.rows[0].id },
      })
    } catch (error) {
      console.error('Create submission error:', error)
      res.status(500).json({
        success: false,
        message: 'Failed to create submission',
      })
    }
  }
)

// Get all approved submissions (for browse feed)
router.get('/', async (req, res) => {
  try {
    const { sort = 'recent', tag, status } = req.query

    let orderBy = 'created_at DESC'
    if (sort === 'loved') {
      orderBy = '(upvotes - downvotes) DESC, created_at DESC'
    } else if (sort === 'status') {
      orderBy = 'status, created_at DESC'
    }

    let whereConditions = ["status != 'pending'", "status != 'rejected'"]
    let params = []

    if (tag) {
      whereConditions.push(`tags LIKE ?`)
      params.push(`%"${tag}"%`)
    }

    if (status && status !== 'all') {
      whereConditions.push(`status = ?`)
      params.push(status)
    }

    const whereClause = whereConditions.length > 0
      ? 'WHERE ' + whereConditions.join(' AND ')
      : ''

    const query = `
      SELECT
        id,
        type,
        text,
        tags,
        submitter_name,
        status,
        upvotes,
        downvotes,
        created_at,
        approved_at
      FROM submissions
      ${whereClause}
      ORDER BY ${orderBy}
      LIMIT 100
    `

    const result = await pool.query(query, params)

    // Parse JSON strings back to arrays
    const data = result.rows.map(row => ({
      ...row,
      tags: JSON.parse(row.tags || '[]')
    }))

    res.json({
      success: true,
      data,
    })
  } catch (error) {
    console.error('Get submissions error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch submissions',
    })
  }
})

// Get a single submission with responses
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params

    // Get submission
    const submissionQuery = `
      SELECT
        id, type, text, tags, submitter_name, status,
        upvotes, downvotes, created_at, approved_at
      FROM submissions
      WHERE id = ? AND status != 'pending' AND status != 'rejected'
    `
    const submissionResult = await pool.query(submissionQuery, [id])

    if (submissionResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found',
      })
    }

    // Get admin responses
    const responsesQuery = `
      SELECT id, response_text, admin_name, created_at
      FROM admin_responses
      WHERE submission_id = ?
      ORDER BY created_at ASC
    `
    const responsesResult = await pool.query(responsesQuery, [id])

    // Parse tags from JSON
    const submission = {
      ...submissionResult.rows[0],
      tags: JSON.parse(submissionResult.rows[0].tags || '[]'),
      responses: responsesResult.rows,
    }

    res.json({
      success: true,
      data: submission,
    })
  } catch (error) {
    console.error('Get submission error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch submission',
    })
  }
})

// Vote on a submission
router.post('/:id/vote', async (req, res) => {
  try {
    const { id } = req.params
    const { voteType } = req.body // 'upvote', 'downvote', or null (remove vote)

    if (voteType && !['upvote', 'downvote'].includes(voteType)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid vote type',
      })
    }

    // For simplicity, we just increment/decrement the counts
    // In a production app, you'd track individual votes to prevent duplicates
    let query
    if (voteType === 'upvote') {
      query = 'UPDATE submissions SET upvotes = upvotes + 1 WHERE id = ?'
    } else if (voteType === 'downvote') {
      query = 'UPDATE submissions SET downvotes = downvotes + 1 WHERE id = ?'
    }

    if (voteType) {
      await pool.query(query, [id])
    }

    // Get updated counts
    const result = await pool.query('SELECT upvotes, downvotes FROM submissions WHERE id = ?', [id])

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found',
      })
    }

    res.json({
      success: true,
      data: result.rows[0],
    })
  } catch (error) {
    console.error('Vote error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to record vote',
    })
  }
})

export default router
