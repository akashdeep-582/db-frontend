import { Button } from '@dropbroker/ui'
import styles from './Hero.module.css'

interface HeroProps {
  onRegister: () => void
  onLogin: () => void
}

export default function Hero({ onRegister, onLogin }: HeroProps) {
  return (
    <section className={styles.hero}>
      <div className={styles.inner}>
        <p className={styles.eyebrow}>Australia's property platform</p>
        <h1 className={styles.title}>Find your perfect<br />place to call home</h1>
        <p className={styles.sub}>
          Browse thousands of verified listings, connect with owners,
          and book visits — all in one place.
        </p>
        <div className={styles.ctas}>
          <Button variant="primary" size="lg" onClick={onRegister}>
            Get started free
          </Button>
          <Button variant="outline" size="lg" onClick={onLogin}>
            Sign in
          </Button>
        </div>
      </div>

      <div className={styles.visual}>
        <div className={styles.card}>
          <div className={styles.cardImg} />
          <div className={styles.cardBody}>
            <span className={styles.cardTag}>For Rent</span>
            <p className={styles.cardTitle}>Modern 2BR in Sydney CBD</p>
            <p className={styles.cardPrice}>$2,400 / month</p>
          </div>
        </div>
        <div className={`${styles.card} ${styles.cardOffset}`}>
          <div className={`${styles.cardImg} ${styles.cardImgAlt}`} />
          <div className={styles.cardBody}>
            <span className={styles.cardTag}>For Rent</span>
            <p className={styles.cardTitle}>Sunny Studio in Melbourne</p>
            <p className={styles.cardPrice}>$1,650 / month</p>
          </div>
        </div>
      </div>
    </section>
  )
}
