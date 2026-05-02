import { ReactNode } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import AppNavbar from './components/AppNavbar'
import useAuthStore from './store/authStore'
import type { Role } from './store/authStore'

interface AuthLayoutProps {
  children: ReactNode
  allowedRoles?: Role[]
}

function AuthLayout({ children, allowedRoles }: AuthLayoutProps) {
  const { token, role } = useAuthStore()

  if (!token) return <Navigate to="/" replace />
  if (allowedRoles && role && !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />
  }

  return (
    <>
      <AppNavbar />
      <main>{children}</main>
    </>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      {/* Tenant routes */}
      <Route path="/browse" element={
        <AuthLayout allowedRoles={['tenant']}>
          <div>Tenant — Browse (coming soon)</div>
        </AuthLayout>
      } />
      <Route path="/wishlist" element={
        <AuthLayout allowedRoles={['tenant']}>
          <div>Tenant — Wishlist (coming soon)</div>
        </AuthLayout>
      } />
      <Route path="/visits" element={
        <AuthLayout allowedRoles={['tenant']}>
          <div>Tenant — My Visits (coming soon)</div>
        </AuthLayout>
      } />

      {/* Owner routes */}
      <Route path="/owner/dashboard" element={
        <AuthLayout allowedRoles={['owner']}>
          <div>Owner — Dashboard (coming soon)</div>
        </AuthLayout>
      } />
      <Route path="/owner/post" element={
        <AuthLayout allowedRoles={['owner']}>
          <div>Owner — Post Property (coming soon)</div>
        </AuthLayout>
      } />
      <Route path="/owner/listings" element={
        <AuthLayout allowedRoles={['owner']}>
          <div>Owner — My Listings (coming soon)</div>
        </AuthLayout>
      } />

      {/* Admin routes */}
      <Route path="/admin/dashboard" element={
        <AuthLayout allowedRoles={['admin']}>
          <div>Admin — Dashboard (coming soon)</div>
        </AuthLayout>
      } />
      <Route path="/admin/listings" element={
        <AuthLayout allowedRoles={['admin']}>
          <div>Admin — Listings (coming soon)</div>
        </AuthLayout>
      } />
      <Route path="/admin/users" element={
        <AuthLayout allowedRoles={['admin']}>
          <div>Admin — Users (coming soon)</div>
        </AuthLayout>
      } />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
