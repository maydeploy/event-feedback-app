import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import TextArea from '../components/common/TextArea'
import TextInput from '../components/common/TextInput'
import TagSelector from '../components/common/TagSelector'
import Select from '../components/common/Select'
import Checkbox from '../components/common/Checkbox'
import Button from '../components/common/Button'
import SuccessMessage from '../components/common/SuccessMessage'
import { isValidEmail, isValidText, ERROR_MESSAGES } from '../utils/validation'
import { canSubmit, recordSubmission, formatTimeRemaining, getTimeUntilNextSubmission } from '../utils/rateLimit'
import { submissionsApi } from '../services/api'

function FeedbackForm() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    text: '',
    tags: [],
    relatedEventId: '',
    submitterName: '',
    submitterEmail: '',
    emailOptin: false,
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  // Mock past events - will be replaced with API call
  const pastEvents = [
    { value: '1', label: 'React Workshop - March 2024' },
    { value: '2', label: 'Design Systems Panel - February 2024' },
    { value: '3', label: 'Networking Social - January 2024' },
  ]

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }))
    }
  }

  const validate = () => {
    const newErrors = {}

    if (!isValidText(formData.text, 10)) {
      newErrors.text = ERROR_MESSAGES.textTooShort
    }

    if (formData.submitterEmail && !isValidEmail(formData.submitterEmail)) {
      newErrors.email = ERROR_MESSAGES.invalidEmail
    }

    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validate
    const newErrors = validate()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    // Check rate limit
    if (!canSubmit('submission')) {
      const timeRemaining = getTimeUntilNextSubmission('submission')
      alert(`Please wait ${formatTimeRemaining(timeRemaining)} before submitting again.`)
      return
    }

    setIsSubmitting(true)

    try {
      await submissionsApi.create({
        type: 'feedback',
        ...formData,
      })

      recordSubmission('submission')
      setShowSuccess(true)

      // Reset form
      setFormData({
        text: '',
        tags: [],
        relatedEventId: '',
        submitterName: '',
        submitterEmail: '',
        emailOptin: false,
      })

      // Redirect after 3 seconds
      setTimeout(() => {
        navigate('/')
      }, 3000)
    } catch (error) {
      console.error('Submission error:', error)
      alert(error.response?.data?.message || 'Failed to submit feedback. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (showSuccess) {
    return (
      <div className="min-h-screen grid-background py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <SuccessMessage message="Thanks! We'll review your feedback soon." />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen grid-background py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => navigate('/')}
          className="text-burnt-orange hover:underline mb-6 flex items-center"
        >
          ← Back to home
        </button>

        <div className="bg-white rounded-card shadow-card p-8">
          <h1 className="text-h2 font-serif mb-2">Give Feedback</h1>
          <p className="text-text-secondary mb-8">
            Share your thoughts about past events—the good, the bad, and ideas for next time.
          </p>

          <form onSubmit={handleSubmit}>
            <Select
              label="Which event is this about? (optional)"
              name="relatedEventId"
              value={formData.relatedEventId}
              onChange={(e) => handleChange('relatedEventId', e.target.value)}
              options={pastEvents}
              placeholder="Select an event or leave blank"
              handwritten
            />

            <TextArea
              label="What could we improve?"
              name="text"
              value={formData.text}
              onChange={(e) => handleChange('text', e.target.value)}
              placeholder="Tell us what you think... the good, the bad, the ideas for next time."
              required
              error={errors.text}
              handwritten
            />

            <TagSelector
              label="Tags (select any that apply)"
              selectedTags={formData.tags}
              onChange={(tags) => handleChange('tags', tags)}
              handwritten
            />

            <div className="border-t border-grid-gray pt-6 mt-6">
              <p className="text-sm text-text-secondary mb-4">
                Optional: Leave your contact info if you'd like updates
              </p>

              <TextInput
                label="Your name"
                name="submitterName"
                value={formData.submitterName}
                onChange={(e) => handleChange('submitterName', e.target.value)}
                placeholder="Anonymous"
              />

              <TextInput
                label="Email"
                name="submitterEmail"
                type="email"
                value={formData.submitterEmail}
                onChange={(e) => handleChange('submitterEmail', e.target.value)}
                placeholder="your@email.com"
                error={errors.email}
              />

              <Checkbox
                label="Keep me updated on this feedback"
                name="emailOptin"
                checked={formData.emailOptin}
                onChange={(e) => handleChange('emailOptin', e.target.checked)}
              />
            </div>

            <div className="mt-8">
              <Button type="submit" fullWidth disabled={isSubmitting}>
                {isSubmitting ? 'Sending...' : 'Send feedback'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default FeedbackForm
