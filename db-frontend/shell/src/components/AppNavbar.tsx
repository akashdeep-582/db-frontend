import { NavLink, useNavigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'
import type { Role } from '../types/auth'
import styles from './AppNavbar.module.css'

interface NavItem {
  label: string
  to: string
}

const NAV_LINKS: Record<Role, NavItem[]> = {
  tenant: [
    { label: 'Browse', to: '/browse' },
    { label: 'Wishlist', to: '/wishlist' },
    { label: 'My Visits', to: '/visits' },
  ],
  owner: [
    { label: 'Dashboard', to: '/owner/dashboard' },
    { label: 'Post Property', to: '/owner/post' },
    { label: 'My Listings', to: '/owner/listings' },
  ],
  admin: [
    { label: 'Dashboard', to: '/admin/dashboard' },
    { label: 'Listings', to: '/admin/listings' },
    { label: 'Users', to: '/admin/users' },
  ],
}

export default function AppNavbar() {
  const navigate = useNavigate()
  const { user, role, logout } = useAuthStore()

  function handleLogout() {
    logout()
    navigate('/')
  }

  const links = role ? NAV_LINKS[role] : []

  return (
    <nav className={styles.nav}>
      <NavLink to="/" className={styles.logo}>DropBroker</NavLink>

      <div className={styles.links}>
        {links.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `${styles.link} ${isActive ? styles.linkActive : ''}`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </div>

      <div className={styles.right}>
        <div className={styles.userInfo}>
          <span className={styles.userName}>{user?.name}</span>
          {role && <span className={styles.roleBadge}>{role}</span>}
        </div>
        <button className={styles.logoutBtn} onClick={handleLogout}>
          Log out
        </button>
      </div>
    </nav>
  )
}
