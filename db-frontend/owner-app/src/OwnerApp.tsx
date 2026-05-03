import { Routes, Route, Navigate } from 'react-router-dom'
import PostProperty from './pages/PostProperty'
import Dashboard from './pages/Dashboard'
import MyListings from './pages/MyListings'

export default function OwnerApp() {
  return (
    <Routes>
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="post" element={<PostProperty />} />
      <Route path="listings" element={<MyListings />} />
      <Route path="*" element={<Navigate to="/owner/dashboard" replace />} />
    </Routes>
  )
}
