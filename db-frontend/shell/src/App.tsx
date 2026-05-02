import { lazy, Suspense, ReactNode } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import AppNavbar from './components/AppNavbar'
import useAuthStore from './store/authStore'
import type { Role } from './types/auth'

const OwnerApp = lazy(() => import('ownerApp/OwnerApp'))

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

      {/* Owner routes — served by owner-app remote */}
      <Route path="/owner/*" element={
        <AuthLayout allowedRoles={['owner']}>
          <Suspense fallback={<div>Loading…</div>}>
            <OwnerApp />
          </Suspense>
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
