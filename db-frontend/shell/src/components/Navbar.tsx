import { Button } from '@dropbroker/ui'
import styles from './Navbar.module.css'

interface NavbarProps {
  onLogin: () => void
  onRegister: () => void
}

export default function Navbar({ onLogin, onRegister }: NavbarProps) {
  return (
    <nav className={styles.nav}>
      <span className={styles.logo}>DropBroker</span>
      <div className={styles.actions}>
        <Button variant="ghost" onClick={onLogin}>Sign in</Button>
        <Button variant="primary" onClick={onRegister}>Get started</Button>
      </div>
    </nav>
  )
}
