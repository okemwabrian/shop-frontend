import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { errorMessage } from '../api/client.js'
import { useAuth } from '../context/AuthContext.jsx'

export default function Login() {
  const { user, login, register } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [isRegister, setIsRegister] = useState(false)
  const [form, setForm] = useState({ fullName: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (user) {
    const from = location.state?.from || '/'
    return <Navigate to={from} replace />
  }

  function handleChange(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
    setError('')
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      if (isRegister) {
        await register(form.fullName, form.email, form.password)
      } else {
        await login(form.email, form.password)
      }

      const from = location.state?.from || '/'
      navigate(from, { replace: true })
    } catch (err) {
      setError(errorMessage(err))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-orange-600">
          {isRegister ? 'Create account' : 'Welcome back'}
        </p>
        <h1 className="mt-2 text-3xl font-bold text-gray-900">
          {isRegister ? 'Register' : 'Login'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {isRegister && (
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-gray-700">
              Full name
            </span>
            <input
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none ring-0 transition focus:border-orange-500"
              placeholder="Jane Doe"
              required
            />
          </label>
        )}

        <label className="block">
          <span className="mb-1 block text-sm font-medium text-gray-700">Email</span>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none ring-0 transition focus:border-orange-500"
            placeholder="you@example.com"
            required
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-medium text-gray-700">Password</span>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none ring-0 transition focus:border-orange-500"
            placeholder="••••••••"
            required
          />
        </label>

        {error && (
          <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:bg-orange-400"
        >
          {isSubmitting ? 'Please wait...' : isRegister ? 'Create account' : 'Login'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600">
        {isRegister ? 'Already have an account?' : 'Need an account?'}{' '}
        <button
          type="button"
          onClick={() => {
            setIsRegister((current) => !current)
            setError('')
          }}
          className="font-semibold text-orange-600 underline-offset-2 hover:underline"
        >
          {isRegister ? 'Login' : 'Register'}
        </button>
      </p>
    </div>
  )
}
