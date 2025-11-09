import validator from 'validator'

// Sanitize text to prevent XSS
export function sanitizeText(text) {
  if (!text) return ''
  return validator.escape(text.trim())
}

// Validate email
export function validateEmail(email) {
  if (!email) return true // Email is optional
  return validator.isEmail(email)
}

// Validate submission data
export function validateSubmission(req, res, next) {
  const { type, text, tags, submitterEmail } = req.body

  const errors = []

  // Type validation
  if (!type || !['feedback', 'idea'].includes(type)) {
    errors.push('Invalid submission type')
  }

  // Text validation
  if (!text || text.trim().length < 10) {
    errors.push('Text must be at least 10 characters')
  }

  if (text && text.length > 500) {
    errors.push('Text must not exceed 500 characters')
  }

  // Tags validation
  if (tags && !Array.isArray(tags)) {
    errors.push('Tags must be an array')
  }

  // Email validation
  if (submitterEmail && !validateEmail(submitterEmail)) {
    errors.push('Invalid email address')
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors,
    })
  }

  // Sanitize text fields
  req.body.text = sanitizeText(text)
  if (req.body.submitterName) {
    req.body.submitterName = sanitizeText(req.body.submitterName)
  }

  next()
}

// Validate collaboration data
export function validateCollaboration(req, res, next) {
  const { contactName, email, offerings } = req.body

  const errors = []

  // Required fields
  if (!contactName || contactName.trim().length === 0) {
    errors.push('Contact name is required')
  }

  if (!email || !validateEmail(email)) {
    errors.push('Valid email is required')
  }

  // Offerings validation
  if (!offerings || !Array.isArray(offerings) || offerings.length === 0) {
    errors.push('At least one offering must be selected')
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors,
    })
  }

  // Sanitize text fields
  req.body.contactName = sanitizeText(contactName)
  if (req.body.organization) {
    req.body.organization = sanitizeText(req.body.organization)
  }
  if (req.body.additionalDetails) {
    req.body.additionalDetails = sanitizeText(req.body.additionalDetails)
  }

  next()
}

// Validate event data
export function validateEvent(req, res, next) {
  const { title, date, event_type, description } = req.body

  const errors = []

  if (!title || title.trim().length === 0) {
    errors.push('Title is required')
  }

  if (!date || !validator.isDate(date)) {
    errors.push('Valid date is required')
  }

  if (!event_type || event_type.trim().length === 0) {
    errors.push('Event type is required')
  }

  if (description && description.length > 500) {
    errors.push('Description must not exceed 500 characters')
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors,
    })
  }

  next()
}
