import { Outlet, useLocation } from 'react-router-dom'
import DashboardNavbar from '../components/layout/DashboardNavbar'
import Sidebar from '../components/layout/Sidebar'
import { useAuthStore } from '../stores/authStore'

const DashboardLayout = () => {
  const { isAuthenticated } = useAuthStore()
  const location = useLocation()
  const isDemo = location.pathname.includes('/demo')

  // Hide sidebar for guest demo users or if explicitly requested
  const showSidebar = isAuthenticated || isDemo

  return (
    <div className="flex min-h-screen bg-transparent">
      <div className="mesh-gradient" />
      {/* Sidebar - only show if authenticated */}
      {isAuthenticated && <Sidebar />}
      
      {/* Main content */}
      <div className={`flex-1 flex flex-col min-w-0 ${isAuthenticated ? 'ml-0 md:ml-64' : 'ml-0'}`}>
        <DashboardNavbar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout
