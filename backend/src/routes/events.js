import express from 'express'
import pool from '../db/connection.js'

const router = express.Router()

// Get all events
router.get('/', async (req, res) => {
  try {
    const { topic, eventType, speaker, sponsor, year } = req.query

    let whereConditions = []
    let params = []
    let paramCount = 0

    if (topic) {
      paramCount++
      whereConditions.push(`$${paramCount} = ANY(topic_tags)`)
      params.push(topic)
    }

    if (eventType) {
      paramCount++
      whereConditions.push(`event_type = $${paramCount}`)
      params.push(eventType)
    }

    if (year) {
      paramCount++
      whereConditions.push(`EXTRACT(YEAR FROM date) = $${paramCount}`)
      params.push(parseInt(year))
    }

    // For speaker and sponsor, we need to search in JSONB arrays
    if (speaker) {
      paramCount++
      whereConditions.push(`speakers @> $${paramCount}::jsonb`)
      params.push(JSON.stringify([{ name: speaker }]))
    }

    if (sponsor) {
      paramCount++
      whereConditions.push(`sponsors @> $${paramCount}::jsonb`)
      params.push(JSON.stringify([{ name: sponsor }]))
    }

    const whereClause = whereConditions.length > 0
      ? 'WHERE ' + whereConditions.join(' AND ')
      : ''

    const query = `
      SELECT *
      FROM events
      ${whereClause}
      ORDER BY date DESC
    `

    const result = await pool.query(query, params)

    res.json({
      success: true,
      data: result.rows,
    })
  } catch (error) {
    console.error('Get events error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch events',
    })
  }
})

// Get a single event
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params

    const query = 'SELECT * FROM events WHERE id = $1'
    const result = await pool.query(query, [id])

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      })
    }

    res.json({
      success: true,
      data: result.rows[0],
    })
  } catch (error) {
    console.error('Get event error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch event',
    })
  }
})

export default router
