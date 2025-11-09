import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import TextInput from '../components/common/TextInput'
import TextArea from '../components/common/TextArea'
import Select from '../components/common/Select'
import Checkbox from '../components/common/Checkbox'
import Button from '../components/common/Button'
import SuccessMessage from '../components/common/SuccessMessage'
import { isValidEmail, ERROR_MESSAGES } from '../utils/validation'
import { canSubmit, recordSubmission, formatTimeRemaining, getTimeUntilNextSubmission } from '../utils/rateLimit'
import { collaborationsApi } from '../services/api'

function CollaborationForm() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    contactName: '',
    email: '',
    organization: '',
    offerings: [],
    otherOffering: '',
    budgetRange: '',
    venueCapacity: '',
    location: '',
    preferredEventTypes: [],
    availability: '',
    collaborationType: 'one-time',
    additionalDetails: '',
    emailOptin: true,
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const budgetOptions = [
    { value: '$0-500', label: '$0-500' },
    { value: '$500-1000', label: '$500-1000' },
    { value: '$1000-2500', label: '$1000-2500' },
    { value: '$2500+', label: '$2500+' },
    { value: 'discuss', label: "Let's discuss" },
  ]

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }))
    }
  }

  const handleOfferingChange = (offering) => {
    const newOfferings = formData.offerings.includes(offering)
      ? formData.offerings.filter((o) => o !== offering)
      : [...formData.offerings, offering]
    handleChange('offerings', newOfferings)
  }

  const handleEventTypeChange = (type) => {
    const newTypes = formData.preferredEventTypes.includes(type)
      ? formData.preferredEventTypes.filter((t) => t !== type)
      : [...formData.preferredEventTypes, type]
    handleChange('preferredEventTypes', newTypes)
  }

  const validate = () => {
    const newErrors = {}

    if (!formData.contactName.trim()) {
      newErrors.contactName = ERROR_MESSAGES.requiredField
    }

    if (!formData.email.trim()) {
      newErrors.email = ERROR_MESSAGES.requiredField
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = ERROR_MESSAGES.invalidEmail
    }

    if (formData.offerings.length === 0) {
      newErrors.offerings = ERROR_MESSAGES.atLeastOneOption
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

    if (!canSubmit('collaboration')) {
      const timeRemaining = getTimeUntilNextSubmission('collaboration')
      alert(`Please wait ${formatTimeRemaining(timeRemaining)} before submitting again.`)
      return
    }

    setIsSubmitting(true)

    try {
      await collaborationsApi.create(formData)

      recordSubmission('collaboration')
      setShowSuccess(true)

      setTimeout(() => {
        navigate('/')
      }, 3000)
    } catch (error) {
      console.error('Submission error:', error)
      alert(error.response?.data?.message || 'Failed to submit collaboration offer. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (showSuccess) {
    return (
      <div className="min-h-screen grid-background py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <SuccessMessage message="Thank you! We'll be in touch within a few days." />
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
          <h1 className="text-h2 font-serif mb-2">Want to collaborate with us?</h1>
          <p className="text-text-secondary mb-2">
            We'd love to partner with folks who can provide speakers, spaces, or support.
          </p>
          <p className="text-sm text-pastel-lavender mb-8">
            This offer is private and only visible to event organizers.
          </p>

          <form onSubmit={handleSubmit}>
            <TextInput
              label="Contact name"
              name="contactName"
              value={formData.contactName}
              onChange={(e) => handleChange('contactName', e.target.value)}
              required
              error={errors.contactName}
              handwritten
            />

            <TextInput
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              required
              error={errors.email}
              handwritten
            />

            <TextInput
              label="Organization (optional)"
              name="organization"
              value={formData.organization}
              onChange={(e) => handleChange('organization', e.target.value)}
              handwritten
            />

            <div className="mb-4">
              <label className="block mb-2 font-handwritten">
                What can you offer? <span className="text-burnt-orange">*</span>
              </label>
              <div className="space-y-2">
                <Checkbox
                  label="Speaker / Presenter"
                  name="offering-speaker"
                  checked={formData.offerings.includes('speaker')}
                  onChange={() => handleOfferingChange('speaker')}
                />
                <Checkbox
                  label="Venue / Space"
                  name="offering-venue"
                  checked={formData.offerings.includes('venue')}
                  onChange={() => handleOfferingChange('venue')}
                />
                <Checkbox
                  label="Food & Beverage Budget"
                  name="offering-food"
                  checked={formData.offerings.includes('food_beverage')}
                  onChange={() => handleOfferingChange('food_beverage')}
                />
                <Checkbox
                  label="Other (specify below)"
                  name="offering-other"
                  checked={formData.offerings.includes('other')}
                  onChange={() => handleOfferingChange('other')}
                />
              </div>
              {errors.offerings && (
                <p className="text-burnt-orange text-sm mt-1">{errors.offerings}</p>
              )}
            </div>

            {formData.offerings.includes('other') && (
              <TextInput
                label="What else can you offer?"
                name="otherOffering"
                value={formData.otherOffering}
                onChange={(e) => handleChange('otherOffering', e.target.value)}
                placeholder="Tell us more..."
              />
            )}

            {formData.offerings.includes('venue') && (
              <>
                <TextInput
                  label="Venue capacity"
                  name="venueCapacity"
                  type="number"
                  value={formData.venueCapacity}
                  onChange={(e) => handleChange('venueCapacity', e.target.value)}
                  placeholder="Approximately how many people?"
                  handwritten
                />
                <TextInput
                  label="Location / Region"
                  name="location"
                  value={formData.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                  placeholder="City, state"
                  handwritten
                />
              </>
            )}

            {formData.offerings.includes('food_beverage') && (
              <Select
                label="Budget range"
                name="budgetRange"
                value={formData.budgetRange}
                onChange={(e) => handleChange('budgetRange', e.target.value)}
                options={budgetOptions}
                placeholder="Select a range"
                handwritten
              />
            )}

            <div className="mb-4">
              <label className="block mb-2 font-handwritten">
                Preferred event types (select all that apply)
              </label>
              <div className="space-y-2">
                {['Workshop', 'Panel Discussion', 'Lightning Talks', 'Social / Networking', 'Conference', 'Other'].map((type) => (
                  <Checkbox
                    key={type}
                    label={type}
                    name={`event-type-${type}`}
                    checked={formData.preferredEventTypes.includes(type)}
                    onChange={() => handleEventTypeChange(type)}
                  />
                ))}
              </div>
            </div>

            <TextInput
              label="Availability"
              name="availability"
              value={formData.availability}
              onChange={(e) => handleChange('availability', e.target.value)}
              placeholder="When are you typically available?"
              handwritten
            />

            <div className="mb-4">
              <label className="block mb-2 font-handwritten">Collaboration type</label>
              <div className="space-y-2">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="collaborationType"
                    value="one-time"
                    checked={formData.collaborationType === 'one-time'}
                    onChange={(e) => handleChange('collaborationType', e.target.value)}
                    className="mr-2"
                  />
                  <span className="text-sm">One-time collaboration</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="collaborationType"
                    value="ongoing"
                    checked={formData.collaborationType === 'ongoing'}
                    onChange={(e) => handleChange('collaborationType', e.target.value)}
                    className="mr-2"
                  />
                  <span className="text-sm">Open to ongoing partnership</span>
                </label>
              </div>
            </div>

            <TextArea
              label="Additional details"
              name="additionalDetails"
              value={formData.additionalDetails}
              onChange={(e) => handleChange('additionalDetails', e.target.value)}
              placeholder="Any other information you'd like to share..."
              maxLength={500}
              showCharCount
              rows={4}
              handwritten
            />

            <Checkbox
              label="Keep me updated on collaboration opportunities"
              name="emailOptin"
              checked={formData.emailOptin}
              onChange={(e) => handleChange('emailOptin', e.target.checked)}
              className="mb-6"
            />

            <Button type="submit" fullWidth disabled={isSubmitting}>
              {isSubmitting ? 'Sending...' : 'Send collaboration offer'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CollaborationForm
