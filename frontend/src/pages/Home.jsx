import { useNavigate } from 'react-router-dom'
import Card from '../components/common/Card'

function Home() {
  const navigate = useNavigate()

  const entryCards = [
    {
      title: 'Give Feedback',
      description: 'Share your thoughts about past events',
      icon: '💬',
      path: '/feedback',
      rotation: -1,
    },
    {
      title: 'Suggest Ideas',
      description: 'Propose topics, speakers, or formats for future events',
      icon: '💡',
      path: '/ideas',
      rotation: 1,
    },
    {
      title: 'Want to Collaborate?',
      description: 'Offer speakers, venues, or support for our community',
      icon: '🤝',
      path: '/collaborate',
      rotation: -2,
    },
  ]

  return (
    <div className="min-h-screen grid-background py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="text-center mb-16">
          <h1 className="text-h1 md:text-5xl font-serif mb-4">
            Help shape our next event
          </h1>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Your ideas, feedback, and collaboration make our community stronger.
          </p>
        </header>

        {/* Handwritten instruction */}
        <div className="text-center mb-8">
          <p className="font-handwritten text-xl text-text-secondary">
            Tap any card to start →
          </p>
        </div>

        {/* Entry Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {entryCards.map((card) => (
            <Card
              key={card.path}
              onClick={() => navigate(card.path)}
              rotation={card.rotation}
              className="text-center"
            >
              <div className="text-6xl mb-4">{card.icon}</div>
              <h2 className="text-h3 font-serif mb-2">{card.title}</h2>
              <p className="text-text-secondary text-sm">{card.description}</p>
            </Card>
          ))}
        </div>

        {/* Browse existing ideas CTA */}
        <div className="text-center mt-16">
          <p className="text-text-secondary mb-4">
            Want to see what others are suggesting?
          </p>
          <button
            onClick={() => navigate('/browse')}
            className="text-burnt-orange hover:underline font-serif"
          >
            Browse community ideas →
          </button>
        </div>
      </div>
    </div>
  )
}

export default Home
