import { useState, useEffect } from 'react'
import SubmissionCard from '../components/submissions/SubmissionCard'
import Tag from '../components/common/Tag'
import Loading from '../components/common/Loading'
import { submissionsApi } from '../services/api'
import { AVAILABLE_TAGS } from '../components/common/TagSelector'

function BrowseIdeas() {
  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState('recent')
  const [filterTag, setFilterTag] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  useEffect(() => {
    fetchSubmissions()
  }, [sortBy, filterTag, filterStatus])

  const fetchSubmissions = async () => {
    try {
      setLoading(true)
      const params = {
        sort: sortBy,
      }
      if (filterTag) params.tag = filterTag
      if (filterStatus !== 'all') params.status = filterStatus

      const response = await submissionsApi.getAll(params)
      setSubmissions(response.data.data)
    } catch (error) {
      console.error('Failed to fetch submissions:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleVote = async (id, voteType) => {
    try {
      await submissionsApi.vote(id, voteType)
      // Refresh to get updated counts
      await fetchSubmissions()
    } catch (error) {
      console.error('Failed to vote:', error)
      throw error
    }
  }

  const sortOptions = [
    { value: 'recent', label: 'Most Recent' },
    { value: 'loved', label: 'Most Loved' },
    { value: 'status', label: 'By Status' },
  ]

  const statusOptions = [
    { value: 'all', label: 'All' },
    { value: 'exploring', label: 'Exploring' },
    { value: 'lets-do-this', label: "Let's Do This!" },
    { value: 'done', label: 'Done' },
    { value: 'maybe-later', label: 'Maybe Later' },
  ]

  return (
    <div className="min-h-screen grid-background py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-h1 font-serif mb-2">Browse Ideas</h1>
          <p className="text-text-secondary">
            Vote on community feedback and ideas to help shape future events
          </p>
        </div>

        {/* Filters & Sort */}
        <div className="bg-white rounded-card shadow-card p-6 mb-8">
          {/* Sort Options */}
          <div className="mb-6">
            <label className="block text-sm font-serif mb-2">Sort by</label>
            <div className="flex gap-2 flex-wrap">
              {sortOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setSortBy(option.value)}
                  className={`px-4 py-2 rounded-button transition-all ${
                    sortBy === option.value
                      ? 'bg-burnt-orange text-white'
                      : 'bg-cream text-text-primary hover:bg-grid-gray'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Status Filter */}
          <div className="mb-6">
            <label className="block text-sm font-serif mb-2">Filter by status</label>
            <div className="flex gap-2 flex-wrap">
              {statusOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setFilterStatus(option.value)}
                  className={`px-4 py-2 rounded-button transition-all ${
                    filterStatus === option.value
                      ? 'bg-burnt-orange text-white'
                      : 'bg-cream text-text-primary hover:bg-grid-gray'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tag Filter */}
          <div>
            <label className="block text-sm font-serif mb-2">Filter by tag</label>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setFilterTag('')}
                className={`px-4 py-2 rounded-button transition-all ${
                  !filterTag
                    ? 'bg-burnt-orange text-white'
                    : 'bg-cream text-text-primary hover:bg-grid-gray'
                }`}
              >
                All Tags
              </button>
              {AVAILABLE_TAGS.map((tag) => (
                <Tag
                  key={tag}
                  label={tag}
                  selected={filterTag === tag}
                  onClick={() => setFilterTag(tag === filterTag ? '' : tag)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Submissions Grid */}
        {loading ? (
          <Loading message="Loading submissions..." />
        ) : submissions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-text-secondary font-handwritten text-xl">
              No submissions yet. Be the first to share an idea!
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {submissions.map((submission) => (
              <SubmissionCard
                key={submission.id}
                submission={submission}
                onVote={handleVote}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default BrowseIdeas
