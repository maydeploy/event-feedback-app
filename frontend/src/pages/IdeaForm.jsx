import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import TextArea from '../components/common/TextArea'
import TextInput from '../components/common/TextInput'
import TagSelector from '../components/common/TagSelector'
import Checkbox from '../components/common/Checkbox'
import Button from '../components/common/Button'
import SuccessMessage from '../components/common/SuccessMessage'
import { isValidEmail, isValidText, ERROR_MESSAGES } from '../utils/validation'
import { canSubmit, recordSubmission, formatTimeRemaining, getTimeUntilNextSubmission } from '../utils/rateLimit'
import { submissionsApi } from '../services/api'

function IdeaForm() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    text: '',
    tags: [],
    submitterName: '',
    submitterEmail: '',
    emailOptin: false,
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
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

    const newErrors = validate()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    if (!canSubmit('submission')) {
      const timeRemaining = getTimeUntilNextSubmission('submission')
      alert(`Please wait ${formatTimeRemaining(timeRemaining)} before submitting again.`)
      return
    }

    setIsSubmitting(true)

    try {
      await submissionsApi.create({
        type: 'idea',
        ...formData,
      })

      recordSubmission('submission')
      setShowSuccess(true)

      setFormData({
        text: '',
        tags: [],
        submitterName: '',
        submitterEmail: '',
        emailOptin: false,
      })

      setTimeout(() => {
        navigate('/')
      }, 3000)
    } catch (error) {
      console.error('Submission error:', error)
      alert(error.response?.data?.message || 'Failed to submit idea. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (showSuccess) {
    return (
      <div className="min-h-screen grid-background py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <SuccessMessage message="Got it! We'll consider this for upcoming events." />
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
          <h1 className="text-h2 font-serif mb-2">Suggest Ideas</h1>
          <p className="text-text-secondary mb-8">
            Topic ideas, dream speakers, format suggestions—anything goes.
          </p>

          <form onSubmit={handleSubmit}>
            <TextArea
              label="What should we explore next?"
              name="text"
              value={formData.text}
              onChange={(e) => handleChange('text', e.target.value)}
              placeholder="Tell us about your idea... topics, speakers, formats, or anything else you'd like to see."
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
                label="Keep me updated on this idea"
                name="emailOptin"
                checked={formData.emailOptin}
                onChange={(e) => handleChange('emailOptin', e.target.checked)}
              />
            </div>

            <div className="mt-8">
              <Button type="submit" fullWidth disabled={isSubmitting}>
                {isSubmitting ? 'Sending...' : 'Share this idea'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default IdeaForm
