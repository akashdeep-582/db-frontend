import { lazy, Suspense, ReactNode } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import AppNavbar from './components/AppNavbar'
import useAuthStore from './store/authStore'
import type { Role } from './types/auth'

const OwnerApp = lazy(() => import('ownerApp/OwnerApp'))
const AdminApp = lazy(() => import('adminApp/AdminApp'))
const TenantApp = lazy(() => import('tenantApp/TenantApp'))

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

      {/* Tenant routes — served by tenant-app remote */}
      <Route path="/tenant/*" element={
        <AuthLayout allowedRoles={['tenant']}>
          <Suspense fallback={<div>Loading…</div>}>
            <TenantApp />
          </Suspense>
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

      {/* Admin routes — served by admin-app remote */}
      <Route path="/admin/*" element={
        <AuthLayout allowedRoles={['admin']}>
          <Suspense fallback={<div>Loading…</div>}>
            <AdminApp />
          </Suspense>
        </AuthLayout>
      } />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
