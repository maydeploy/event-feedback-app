// Email validation
export function isValidEmail(email) {
  if (!email) return true // Email is optional
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Text validation (min length)
export function isValidText(text, minLength = 10) {
  return text && text.trim().length >= minLength
}

// Character count validation
export function isWithinCharLimit(text, maxLength = 500) {
  return !text || text.length <= maxLength
}

// Get character count color class
export function getCharCountColorClass(count, maxLength = 500) {
  const remaining = maxLength - count
  if (remaining <= 50) return 'text-burnt-orange'
  return 'text-text-secondary'
}

// Sanitize text (basic XSS prevention on client)
export function sanitizeText(text) {
  if (!text) return ''
  return text
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .trim()
}

// Validation errors
export const ERROR_MESSAGES = {
  textTooShort: 'Please enter at least 10 characters',
  textTooLong: 'Maximum 500 characters allowed',
  invalidEmail: 'Please enter a valid email address',
  requiredField: 'This field is required',
  atLeastOneOption: 'Please select at least one option',
}
