import { Outlet, useLocation } from 'react-router-dom'
import BottomTabBar from './BottomTabBar'

function Layout() {
  const location = useLocation()
  const hideNavPaths = ['/admin']
  const shouldShowNav = !hideNavPaths.includes(location.pathname)

  return (
    <div className="min-h-screen bg-cream">
      <main className={shouldShowNav ? 'pb-20 md:pb-0' : ''}>
        <Outlet />
      </main>
      {shouldShowNav && <BottomTabBar />}
    </div>
  )
}

export default Layout
