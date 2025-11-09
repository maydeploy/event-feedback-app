import { NavLink } from 'react-router-dom'

function BottomTabBar() {
  const tabs = [
    { path: '/', label: 'Home', icon: '🏠' },
    { path: '/browse', label: 'Browse Ideas', icon: '💡' },
    { path: '/events', label: 'Past Events', icon: '📅' },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-cream border-t border-grid-gray shadow-lg md:hidden z-50">
      <div className="flex justify-around items-center h-16">
        {tabs.map((tab) => (
          <NavLink
            key={tab.path}
            to={tab.path}
            end={tab.path === '/'}
            className={({ isActive }) =>
              `bottom-tab ${isActive ? 'active' : ''} flex-1`
            }
          >
            <div className="text-2xl mb-1">{tab.icon}</div>
            <div className="text-xs font-sans">{tab.label}</div>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}

export default BottomTabBar
