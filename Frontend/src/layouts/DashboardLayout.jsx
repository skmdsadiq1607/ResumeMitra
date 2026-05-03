import { Outlet } from 'react-router-dom'
import DashboardNavbar from '../components/layout/DashboardNavbar'
import Sidebar from '../components/layout/Sidebar'

const DashboardLayout = () => {
  return (
    <div className="flex min-h-screen bg-dark-950">
      {/* Sidebar */}
      <Sidebar />
      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 ml-0 md:ml-64">
        <DashboardNavbar />
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout
