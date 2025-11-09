import express from 'express'
import pool from '../db/connection.js'
import { rateLimitMiddleware, recordAction } from '../middleware/rateLimit.js'
import { validateCollaboration } from '../middleware/validation.js'

const router = express.Router()

// Create a new collaboration offer
router.post(
  '/',
  rateLimitMiddleware('collaboration'),
  validateCollaboration,
  async (req, res) => {
    try {
      const {
        contactName,
        email,
        organization,
        offerings,
        otherOffering,
        budgetRange,
        venueCapacity,
        location,
        preferredEventTypes = [],
        availability,
        collaborationType,
        additionalDetails,
        emailOptin = true,
      } = req.body

      const query = `
        INSERT INTO collaborations (
          contact_name, email, organization, offerings, other_offering,
          budget_range, venue_capacity, location, preferred_event_types,
          availability, collaboration_type, additional_details, email_optin
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `

      const values = [
        contactName,
        email,
        organization || null,
        JSON.stringify(offerings), // SQLite stores arrays as JSON strings
        otherOffering || null,
        budgetRange || null,
        venueCapacity || null,
        location || null,
        JSON.stringify(preferredEventTypes), // SQLite stores arrays as JSON strings
        availability || null,
        collaborationType || 'one-time',
        additionalDetails || null,
        emailOptin ? 1 : 0, // SQLite uses 0/1 for boolean
      ]

      const result = await pool.query(query, values)

      // Record the action for rate limiting
      await recordAction(req.sessionId, 'collaboration')

      res.status(201).json({
        success: true,
        message: 'Collaboration offer submitted successfully',
        data: { id: result.rows[0].id },
      })
    } catch (error) {
      console.error('Create collaboration error:', error)
      res.status(500).json({
        success: false,
        message: 'Failed to submit collaboration offer',
      })
    }
  }
)

export default router
