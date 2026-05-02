import { Routes, Route, Navigate } from 'react-router-dom'
import PostProperty from './pages/PostProperty'
import Dashboard from './pages/Dashboard'

export default function OwnerApp() {
  return (
    <Routes>
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="post" element={<PostProperty />} />
      <Route path="*" element={<Navigate to="/owner/dashboard" replace />} />
    </Routes>
  )
}
