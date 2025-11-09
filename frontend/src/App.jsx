import { Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Home from './pages/Home'
import BrowseIdeas from './pages/BrowseIdeas'
import PastEvents from './pages/PastEvents'
import Admin from './pages/Admin'
import FeedbackForm from './pages/FeedbackForm'
import IdeaForm from './pages/IdeaForm'
import CollaborationForm from './pages/CollaborationForm'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="feedback" element={<FeedbackForm />} />
        <Route path="ideas" element={<IdeaForm />} />
        <Route path="collaborate" element={<CollaborationForm />} />
        <Route path="browse" element={<BrowseIdeas />} />
        <Route path="events" element={<PastEvents />} />
        <Route path="admin" element={<Admin />} />
      </Route>
    </Routes>
  )
}

export default App
