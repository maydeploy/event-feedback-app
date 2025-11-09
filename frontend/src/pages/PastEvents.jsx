import { useState, useEffect } from 'react'
import Card from '../components/common/Card'
import Tag from '../components/common/Tag'
import Loading from '../components/common/Loading'
import { eventsApi } from '../services/api'

function PastEvents() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      const response = await eventsApi.getAll()
      setEvents(response.data.data)
    } catch (error) {
      console.error('Failed to fetch events:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <div className="min-h-screen grid-background py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-h1 font-serif mb-2">Past Events</h1>
          <p className="text-text-secondary">
            Explore our event archive and see what we've done together
          </p>
        </div>

        {loading ? (
          <Loading message="Loading events..." />
        ) : events.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-text-secondary font-handwritten text-xl">
              We're just getting started—check back soon for our event archive.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {events.map((event) => (
              <Card key={event.id} rotation="random">
                <div className="text-sm text-burnt-orange mb-2">{event.event_type}</div>
                <h3 className="text-h3 font-serif mb-2">{event.title}</h3>
                <p className="text-sm text-text-secondary mb-3">
                  {formatDate(event.date)}
                </p>

                {event.topic_tags && JSON.parse(event.topic_tags || '[]').length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {JSON.parse(event.topic_tags).map((tag, idx) => (
                      <Tag key={idx} label={tag} />
                    ))}
                  </div>
                )}

                {event.description && (
                  <p className="text-sm text-text-primary mb-3">{event.description}</p>
                )}

                {event.food_drinks && (
                  <div className="text-sm text-text-secondary mb-2">
                    🍕 {event.food_drinks}
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default PastEvents
