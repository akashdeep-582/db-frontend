import { Link } from 'react-router-dom'

export default function Dashboard() {
  return (
    <div style={{ padding: 40 }}>
      <h1>Owner Dashboard</h1>
      <Link to="/owner/post">Post a Property</Link>
    </div>
  )
}
