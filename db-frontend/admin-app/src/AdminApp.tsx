import { Routes, Route, Navigate } from 'react-router-dom'
import Listings from './pages/Listings'
import Users from './pages/Users'

export default function AdminApp() {
  return (
    <Routes>
      <Route path="listings" element={<Listings />} />
      <Route path="users" element={<Users />} />
      <Route path="*" element={<Navigate to="listings" replace />} />
    </Routes>
  )
}
