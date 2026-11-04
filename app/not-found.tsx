import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="route-page">
      <div className="route-inner" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
        <p className="eyebrow">404 NOT FOUND</p>
        <h1>Page not found</h1>
        <p className="route-lead">
          The page you are looking for does not exist or may have been moved.
        </p>
        <div style={{ marginTop: '2rem' }}>
          <Link href="/" className="button primary">
            ← Return to home
          </Link>
        </div>
      </div>
    </main>
  )
}
