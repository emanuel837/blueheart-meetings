import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/admin/ProtectedRoute'
import AdminLayout from './components/admin/AdminLayout'
import BookingPage from './pages/BookingPage'
import AdminLogin from './pages/admin/AdminLogin'
import AdminSetup from './pages/admin/AdminSetup'
import Dashboard from './pages/admin/Dashboard'
import AdminMeetings from './pages/admin/AdminMeetings'
import AdminExperts from './pages/admin/AdminExperts'
import AdminBranches from './pages/admin/AdminBranches'
import SeedPage from './pages/admin/SeedPage'
import SuccessPage from './pages/SuccessPage'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<BookingPage />} />
          <Route path="/admin/setup" element={<AdminSetup />} />
          <Route path="/admin/seed" element={<SeedPage />} />
          <Route
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/meetings" element={<AdminMeetings />} />
            <Route path="/admin/experts" element={<AdminExperts />} />
            <Route path="/admin/branches" element={<AdminBranches />} />
          </Route>
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/success" element={<SuccessPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
