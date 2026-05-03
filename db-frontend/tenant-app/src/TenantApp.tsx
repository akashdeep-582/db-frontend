import { Routes, Route, Navigate } from 'react-router-dom'
import Browse from './pages/Browse'
import PropertyDetail from './pages/PropertyDetail'
import Wishlist from './pages/Wishlist'
import MyVisits from './pages/MyVisits'

export default function TenantApp() {
  return (
    <Routes>
      <Route path="browse" element={<Browse />} />
      <Route path="browse/:id" element={<PropertyDetail />} />
      <Route path="wishlist" element={<Wishlist />} />
      <Route path="visits" element={<MyVisits />} />
      <Route path="*" element={<Navigate to="browse" replace />} />
    </Routes>
  )
}
