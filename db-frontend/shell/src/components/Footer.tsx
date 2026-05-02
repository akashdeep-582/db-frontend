import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <span className={styles.logo}>DropBroker</span>
        <nav className={styles.links}>
          <a href="#">About</a>
          <a href="#">Contact</a>
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
        </nav>
        <p className={styles.copy}>© {new Date().getFullYear()} DropBroker. All rights reserved.</p>
      </div>
    </footer>
  )
}
