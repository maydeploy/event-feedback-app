import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/common/Button'
import TextInput from '../components/common/TextInput'
import Card from '../components/common/Card'
import Tag from '../components/common/Tag'
import StatusBadge from '../components/common/StatusBadge'
import Loading from '../components/common/Loading'
import { adminApi } from '../services/api'

function Admin() {
  const navigate = useNavigate()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [loading, setLoading] = useState(false)

  // Admin data
  const [pendingSubmissions, setPendingSubmissions] = useState([])
  const [publishedSubmissions, setPublishedSubmissions] = useState([])
  const [collaborations, setCollaborations] = useState([])
  const [activeTab, setActiveTab] = useState('pending')

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoginError('')
    setLoading(true)

    try {
      await adminApi.login(password)
      setIsAuthenticated(true)
      fetchAdminData()
    } catch (error) {
      setLoginError(error.response?.data?.message || 'Invalid password')
    } finally {
      setLoading(false)
    }
  }

  const fetchAdminData = async () => {
    try {
      const [pending, published, collabs] = await Promise.all([
        adminApi.getPending(),
        adminApi.getPublished(),
        adminApi.getCollaborations(),
      ])

      setPendingSubmissions(pending.data.data)
      setPublishedSubmissions(published.data.data)
      setCollaborations(collabs.data.data)
    } catch (error) {
      console.error('Failed to fetch admin data:', error)
    }
  }

  const handleApprove = async (id, tags) => {
    try {
      await adminApi.approve(id, tags)
      fetchAdminData()
    } catch (error) {
      console.error('Failed to approve:', error)
      alert('Failed to approve submission')
    }
  }

  const handleReject = async (id) => {
    if (!confirm('Are you sure you want to reject and delete this submission?')) return

    try {
      await adminApi.reject(id)
      fetchAdminData()
    } catch (error) {
      console.error('Failed to reject:', error)
      alert('Failed to reject submission')
    }
  }

  const handleStatusChange = async (id, newStatus) => {
    try {
      await adminApi.updateStatus(id, newStatus)
      fetchAdminData()
    } catch (error) {
      console.error('Failed to update status:', error)
      alert('Failed to update status')
    }
  }

  const handleLogout = async () => {
    try {
      await adminApi.logout()
      setIsAuthenticated(false)
      navigate('/')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  // Login screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-cream py-12 px-4 flex items-center justify-center">
        <div className="w-full max-w-md">
          <Card rotation={0}>
            <h1 className="text-h2 font-serif mb-2">Admin Login</h1>
            <p className="text-text-secondary mb-6">
              Enter the admin password to access the dashboard
            </p>

            <form onSubmit={handleLogin}>
              <TextInput
                label="Password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                error={loginError}
                placeholder="Enter admin password"
              />

              <Button type="submit" fullWidth disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => navigate('/')}
                className="text-burnt-orange hover:underline text-sm"
              >
                ← Back to home
              </button>
            </div>
          </Card>
        </div>
      </div>
    )
  }

  // Admin dashboard
  return (
    <div className="min-h-screen bg-cream py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-h1 font-serif">Admin Dashboard</h1>
          <Button onClick={handleLogout} variant="secondary">
            Logout
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto">
          {[
            { key: 'pending', label: `Pending (${pendingSubmissions.length})` },
            { key: 'published', label: `Published (${publishedSubmissions.length})` },
            { key: 'collaborations', label: `Collaborations (${collaborations.length})` },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-6 py-3 rounded-button transition-all whitespace-nowrap ${
                activeTab === tab.key
                  ? 'bg-burnt-orange text-white'
                  : 'bg-white text-text-primary hover:bg-grid-gray'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Pending Submissions */}
        {activeTab === 'pending' && (
          <div className="space-y-4">
            <h2 className="text-h2 font-serif mb-4">Pending Approvals</h2>
            {pendingSubmissions.length === 0 ? (
              <p className="text-text-secondary">No pending submissions</p>
            ) : (
              pendingSubmissions.map((submission) => (
                <Card key={submission.id} rotation={0}>
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <span className="text-xs text-burnt-orange uppercase">{submission.type}</span>
                      <p className="text-text-primary mt-2">{submission.text}</p>
                      {submission.tags && JSON.parse(submission.tags || '[]').length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {JSON.parse(submission.tags).map((tag, idx) => (
                            <Tag key={idx} label={tag} />
                          ))}
                        </div>
                      )}
                      {submission.submitter_email && (
                        <p className="text-sm text-text-secondary mt-2">
                          From: {submission.submitter_name || 'Anonymous'} ({submission.submitter_email})
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button
                      onClick={() => handleApprove(submission.id, JSON.parse(submission.tags || '[]'))}
                      variant="primary"
                    >
                      Approve
                    </Button>
                    <Button onClick={() => handleReject(submission.id)} variant="secondary">
                      Reject
                    </Button>
                  </div>
                </Card>
              ))
            )}
          </div>
        )}

        {/* Published Submissions */}
        {activeTab === 'published' && (
          <div className="space-y-4">
            <h2 className="text-h2 font-serif mb-4">Published Submissions</h2>
            {publishedSubmissions.length === 0 ? (
              <p className="text-text-secondary">No published submissions</p>
            ) : (
              publishedSubmissions.map((submission) => (
                <Card key={submission.id} rotation={0}>
                  <div className="mb-3">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs text-burnt-orange uppercase">{submission.type}</span>
                      <StatusBadge status={submission.status} />
                      <span className="text-sm text-text-secondary ml-auto">
                        Votes: +{submission.upvotes} / -{submission.downvotes}
                      </span>
                    </div>
                    <p className="text-text-primary">{submission.text}</p>
                    {submission.tags && JSON.parse(submission.tags || '[]').length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {JSON.parse(submission.tags).map((tag, idx) => (
                          <Tag key={idx} label={tag} />
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 items-center">
                    <label className="text-sm">Status:</label>
                    <select
                      value={submission.status}
                      onChange={(e) => handleStatusChange(submission.id, e.target.value)}
                      className="form-input py-1 px-2 text-sm"
                    >
                      <option value="exploring">Exploring</option>
                      <option value="lets-do-this">Let's Do This!</option>
                      <option value="done">Done!</option>
                      <option value="maybe-later">Maybe Later</option>
                    </select>
                  </div>
                </Card>
              ))
            )}
          </div>
        )}

        {/* Collaborations */}
        {activeTab === 'collaborations' && (
          <div className="space-y-4">
            <h2 className="text-h2 font-serif mb-4">Collaboration Offers</h2>
            {collaborations.length === 0 ? (
              <p className="text-text-secondary">No collaboration offers yet</p>
            ) : (
              collaborations.map((collab) => (
                <Card key={collab.id} rotation={0}>
                  <h3 className="font-serif font-semibold mb-2">{collab.contact_name}</h3>
                  <p className="text-sm text-text-secondary mb-2">{collab.email}</p>
                  {collab.organization && (
                    <p className="text-sm mb-2">{collab.organization}</p>
                  )}
                  <div className="mb-2">
                    <strong className="text-sm">Offerings:</strong>{' '}
                    {JSON.parse(collab.offerings || '[]').join(', ')}
                  </div>
                  {collab.budget_range && (
                    <div className="text-sm">Budget: {collab.budget_range}</div>
                  )}
                  {collab.venue_capacity && (
                    <div className="text-sm">Capacity: {collab.venue_capacity} people</div>
                  )}
                  {collab.preferred_event_types && (
                    <div className="text-sm mt-2">
                      Interested in: {JSON.parse(collab.preferred_event_types || '[]').join(', ')}
                    </div>
                  )}
                  <div className="mt-3 pt-3 border-t border-grid-gray">
                    <a
                      href={`mailto:${collab.email}`}
                      className="text-burnt-orange hover:underline"
                    >
                      Email {collab.contact_name} →
                    </a>
                  </div>
                </Card>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Admin
