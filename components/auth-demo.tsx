'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCommerce } from '@/components/commerce-provider'

export default function AuthDemo({ admin = false }: { admin?: boolean }) {
  const router = useRouter()
  const { user, login, signInWithGoogle, register, resetPassword, logout } = useCommerce()
  const [googleLoading, setGoogleLoading] = useState(false)

  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  if (user && !admin) {
    return (
      <main className="auth-page">
        <div className="auth-card">
          <p className="eyebrow">TECHIESMART · ACCOUNT</p>
          <h1>Signed in as {user.name}</h1>
          <p>{user.email} · {user.phone}</p>
          <div className="auth-success">
            <Link className="button primary" href="/account">
              Go to My Account
            </Link>
            <button
              type="button"
              onClick={logout}
              className="button secondary"
              style={{ marginTop: '0.5rem' }}
            >
              Sign Out
            </button>
          </div>
        </div>
      </main>
    )
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setNotice('')

    if (mode === 'login') {
      const res = login(email, password)
      if (!res.ok) {
        setError(res.error || 'Login failed.')
        return
      }
      router.push(admin ? '/admin/dashboard' : '/account')
      return
    }

    if (mode === 'register') {
      if (password !== confirmPassword) {
        setError('Passwords do not match.')
        return
      }
      const res = register({ name, email, phone, password })
      if (!res.ok) {
        setError(res.error || 'Registration failed.')
        return
      }
      router.push('/account')
      return
    }

    if (mode === 'forgot') {
      const res = resetPassword(email, password)
      if (!res.ok) {
        setError(res.error || 'Unable to reset password.')
        return
      }
      setNotice('Password updated! You can now sign in with your new password.')
      setMode('login')
      setPassword('')
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-card">
        <p className="eyebrow">TECHIESMART · {admin ? 'ADMIN CONSOLE' : 'ACCOUNT'}</p>
        <h1>
          {admin
            ? 'Admin login'
            : mode === 'register'
            ? 'Create your account'
            : mode === 'forgot'
            ? 'Reset password'
            : 'Welcome back'}
        </h1>
        <p>
          {admin
            ? 'Sign in for catalog, orders, services and community operations.'
            : mode === 'register'
            ? 'Register to track orders, save delivery addresses and manage your wishlist.'
            : mode === 'forgot'
            ? 'Enter your registered email and choose a new password.'
            : 'Sign in to manage orders, saved products, addresses and community benefits.'}
        </p>

        {error && (
          <div className="mb-3 p-3 rounded-lg bg-[#fbeeed] border border-[#f3c2c0] text-xs text-[#9c2b26]">
            {error}
          </div>
        )}
        {notice && (
          <div className="mb-3 p-3 rounded-lg bg-[#edf4e9] border border-[#c4dcbe] text-xs text-[#205234]">
            {notice}
          </div>
        )}

        {!admin && (
          <div className="mb-4">
            <button
              type="button"
              disabled={googleLoading}
              onClick={async () => {
                setError('')
                setGoogleLoading(true)
                const res = await signInWithGoogle()
                setGoogleLoading(false)
                if (!res.ok) {
                  setError(res.error || 'Google Sign-In failed.')
                  return
                }
                router.push('/account?tab=profile')
              }}
              className="button primary w-full"
            >
              {googleLoading ? 'Signing in with Google...' : 'Continue with Google'}
            </button>
            <div className="text-center text-[11px] text-[#65766e] my-3">or</div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {mode === 'register' && (
            <>
              <label>
                Full Name
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                />
              </label>
              <label>
                Mobile Number
                <input
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="10-digit mobile number"
                />
              </label>
            </>
          )}

          <label>
            {mode === 'login' ? 'Email or mobile' : 'Email address'}
            <input
              required
              type={mode === 'login' ? 'text' : 'email'}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </label>

          <label>
            {mode === 'forgot' ? 'New password (min 6 characters)' : 'Password'}
            <input
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
            />
          </label>

          {mode === 'register' && (
            <label>
              Confirm Password
              <input
                required
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
              />
            </label>
          )}

          <button className="button primary" type="submit">
            {admin
              ? 'Login to admin'
              : mode === 'register'
              ? 'Create Account'
              : mode === 'forgot'
              ? 'Update Password'
              : 'Login'}
          </button>

          {!admin && (
            <div className="auth-links">
              {mode === 'login' && (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setError('')
                      setNotice('')
                      setMode('forgot')
                    }}
                  >
                    Forgot password?
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setError('')
                      setNotice('')
                      setMode('register')
                    }}
                  >
                    Create account
                  </button>
                </>
              )}
              {mode !== 'login' && (
                <button
                  type="button"
                  onClick={() => {
                    setError('')
                    setNotice('')
                    setMode('login')
                  }}
                >
                  Back to Login
                </button>
              )}
            </div>
          )}
        </form>
      </div>
    </main>
  )
}
