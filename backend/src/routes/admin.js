import express from 'express'
import pool from '../db/connection.js'
import { requireAdmin, verifyAdminPassword } from '../middleware/auth.js'
import { validateEvent } from '../middleware/validation.js'

const router = express.Router()

// Admin login
router.post('/login', async (req, res) => {
  try {
    const { password } = req.body

    if (!password) {
      return res.status(400).json({
        success: false,
        message: 'Password is required',
      })
    }

    const isValid = await verifyAdminPassword(password)

    if (!isValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid password',
      })
    }

    // Set session
    req.session.isAdmin = true

    res.json({
      success: true,
      message: 'Login successful',
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({
      success: false,
      message: 'Login failed',
    })
  }
})

// Admin logout
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Logout failed',
      })
    }

    res.json({
      success: true,
      message: 'Logout successful',
    })
  })
})

// All routes below require admin authentication
router.use(requireAdmin)

// Get pending submissions
router.get('/pending', async (req, res) => {
  try {
    const query = `
      SELECT *
      FROM submissions
      WHERE status = 'pending'
      ORDER BY created_at ASC
    `

    const result = await pool.query(query)

    res.json({
      success: true,
      data: result.rows,
    })
  } catch (error) {
    console.error('Get pending submissions error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch pending submissions',
    })
  }
})

// Approve a submission
router.put('/submissions/:id/approve', async (req, res) => {
  try {
    const { id } = req.params
    const { tags } = req.body

    const query = `
      UPDATE submissions
      SET status = 'exploring', approved_at = NOW(), tags = $2
      WHERE id = $1
      RETURNING *
    `

    const result = await pool.query(query, [id, tags || []])

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found',
      })
    }

    res.json({
      success: true,
      message: 'Submission approved',
      data: result.rows[0],
    })
  } catch (error) {
    console.error('Approve submission error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to approve submission',
    })
  }
})

// Reject a submission
router.delete('/submissions/:id/reject', async (req, res) => {
  try {
    const { id } = req.params

    const query = 'DELETE FROM submissions WHERE id = $1'
    await pool.query(query, [id])

    res.json({
      success: true,
      message: 'Submission rejected and deleted',
    })
  } catch (error) {
    console.error('Reject submission error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to reject submission',
    })
  }
})

// Get all published submissions
router.get('/published', async (req, res) => {
  try {
    const query = `
      SELECT *
      FROM submissions
      WHERE status != 'pending' AND status != 'rejected'
      ORDER BY created_at DESC
    `

    const result = await pool.query(query)

    res.json({
      success: true,
      data: result.rows,
    })
  } catch (error) {
    console.error('Get published submissions error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch published submissions',
    })
  }
})

// Update submission status
router.put('/submissions/:id/status', async (req, res) => {
  try {
    const { id } = req.params
    const { status } = req.body

    const validStatuses = ['exploring', 'lets-do-this', 'done', 'maybe-later']
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status',
      })
    }

    const query = `
      UPDATE submissions
      SET status = $2
      WHERE id = $1
      RETURNING *
    `

    const result = await pool.query(query, [id, status])

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found',
      })
    }

    res.json({
      success: true,
      message: 'Status updated',
      data: result.rows[0],
    })
  } catch (error) {
    console.error('Update status error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to update status',
    })
  }
})

// Add admin response to submission
router.post('/submissions/:id/response', async (req, res) => {
  try {
    const { id } = req.params
    const { responseText } = req.body

    if (!responseText || responseText.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Response text is required',
      })
    }

    const query = `
      INSERT INTO admin_responses (submission_id, response_text)
      VALUES ($1, $2)
      RETURNING *
    `

    const result = await pool.query(query, [id, responseText])

    res.status(201).json({
      success: true,
      message: 'Response added',
      data: result.rows[0],
    })
  } catch (error) {
    console.error('Add response error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to add response',
    })
  }
})

// Delete a submission
router.delete('/submissions/:id', async (req, res) => {
  try {
    const { id } = req.params

    const query = 'DELETE FROM submissions WHERE id = $1'
    await pool.query(query, [id])

    res.json({
      success: true,
      message: 'Submission deleted',
    })
  } catch (error) {
    console.error('Delete submission error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to delete submission',
    })
  }
})

// Get all collaboration offers
router.get('/collaborations', async (req, res) => {
  try {
    const query = `
      SELECT *
      FROM collaborations
      ORDER BY created_at DESC
    `

    const result = await pool.query(query)

    res.json({
      success: true,
      data: result.rows,
    })
  } catch (error) {
    console.error('Get collaborations error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch collaborations',
    })
  }
})

// Update collaboration offer
router.put('/collaborations/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { status, notes } = req.body

    const query = `
      UPDATE collaborations
      SET status = $2, admin_notes = $3
      WHERE id = $1
      RETURNING *
    `

    const result = await pool.query(query, [id, status, notes || null])

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Collaboration offer not found',
      })
    }

    res.json({
      success: true,
      message: 'Collaboration updated',
      data: result.rows[0],
    })
  } catch (error) {
    console.error('Update collaboration error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to update collaboration',
    })
  }
})

// Create event
router.post('/events', validateEvent, async (req, res) => {
  try {
    const {
      title,
      date,
      event_type,
      topic_tags = [],
      food_drinks,
      description,
      links = [],
      speakers = [],
      sponsors = [],
    } = req.body

    const query = `
      INSERT INTO events (
        title, date, event_type, topic_tags, food_drinks, description, links, speakers, sponsors
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `

    const values = [
      title,
      date,
      event_type,
      topic_tags,
      food_drinks || null,
      description || null,
      JSON.stringify(links),
      JSON.stringify(speakers),
      JSON.stringify(sponsors),
    ]

    const result = await pool.query(query, values)

    res.status(201).json({
      success: true,
      message: 'Event created',
      data: result.rows[0],
    })
  } catch (error) {
    console.error('Create event error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to create event',
    })
  }
})

// Update event
router.put('/events/:id', validateEvent, async (req, res) => {
  try {
    const { id } = req.params
    const {
      title,
      date,
      event_type,
      topic_tags,
      food_drinks,
      description,
      links,
      speakers,
      sponsors,
    } = req.body

    const query = `
      UPDATE events
      SET title = $2, date = $3, event_type = $4, topic_tags = $5,
          food_drinks = $6, description = $7, links = $8, speakers = $9, sponsors = $10
      WHERE id = $1
      RETURNING *
    `

    const values = [
      id,
      title,
      date,
      event_type,
      topic_tags || [],
      food_drinks || null,
      description || null,
      JSON.stringify(links || []),
      JSON.stringify(speakers || []),
      JSON.stringify(sponsors || []),
    ]

    const result = await pool.query(query, values)

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      })
    }

    res.json({
      success: true,
      message: 'Event updated',
      data: result.rows[0],
    })
  } catch (error) {
    console.error('Update event error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to update event',
    })
  }
})

// Delete event
router.delete('/events/:id', async (req, res) => {
  try {
    const { id } = req.params

    const query = 'DELETE FROM events WHERE id = $1'
    await pool.query(query, [id])

    res.json({
      success: true,
      message: 'Event deleted',
    })
  } catch (error) {
    console.error('Delete event error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to delete event',
    })
  }
})

export default router
