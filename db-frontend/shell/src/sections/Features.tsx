import styles from './Features.module.css'

interface Feature {
  icon: string
  title: string
  description: string
}

const FEATURES: Feature[] = [
  {
    icon: '🏠',
    title: 'Browse Listings',
    description: 'Filter by city, price, type and furnishing. Find exactly what you need.',
  },
  {
    icon: '📋',
    title: 'List Your Property',
    description: 'Reach thousands of verified tenants. Post in minutes with photo uploads.',
  },
  {
    icon: '📅',
    title: 'Book Visits',
    description: 'Request a visit directly from the listing. Owners confirm in real time.',
  },
]

export default function Features() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        {FEATURES.map((f) => (
          <div key={f.title} className={styles.card}>
            <div className={styles.icon}>{f.icon}</div>
            <h3>{f.title}</h3>
            <p>{f.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
