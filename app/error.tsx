'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Page error captured:', error)
  }, [error])

  return (
    <main className="route-page">
      <div className="route-inner" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
        <p className="eyebrow">SOMETHING HAPPENED</p>
        <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>We encountered an issue</h1>
        <p className="route-lead" style={{ maxWidth: '500px', margin: '0 auto 2rem' }}>
          An unexpected error occurred while loading this page. You can try refreshing or return to the storefront.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button
            type="button"
            onClick={() => reset()}
            className="button primary"
            style={{ cursor: 'pointer' }}
          >
            Try again
          </button>
          <Link href="/" className="button secondary">
            ← Return to home
          </Link>
        </div>
      </div>
    </main>
  )
}
