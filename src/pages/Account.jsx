import { useState } from 'react'
import { errorMessage } from '../api/client.js'
import {
  changePassword,
  deactivateAccount,
  updateMe,
} from '../api/shop.js'
import { useAuth } from '../context/AuthContext.jsx'

const inputClass =
  'w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none'
const card = 'space-y-3 rounded-lg border border-gray-200 bg-white p-5'
const none = { type: '', text: '' }

function Message({ msg }) {
  if (!msg.text) return null

  const style =
    msg.type === 'ok' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-700'
  return <p className={`rounded-md p-2 text-sm ${style}`}>{msg.text}</p>
}

export default function Account() {
  const { user, updateUser, logout } = useAuth()

  const [profile, setProfile] = useState({
    fullName: user.fullName || '',
    phone: user.phone || '',
    whatsappNumber: user.whatsappNumber || '',
    marketingConsent: Boolean(user.marketingConsent),
  })
  const [profileMsg, setProfileMsg] = useState(none)
  const [profileBusy, setProfileBusy] = useState(false)

  async function saveProfile(event) {
    event.preventDefault()
    setProfileMsg(none)
    setProfileBusy(true)
    try {
      const updated = await updateMe({
        fullName: profile.fullName.trim(),
        phone: profile.phone.trim() || null,
        whatsappNumber: profile.whatsappNumber.trim() || null,
        marketingConsent: profile.marketingConsent,
      })
      updateUser(updated)
      setProfileMsg({ type: 'ok', text: 'Profile saved.' })
    } catch (err) {
      setProfileMsg({ type: 'error', text: errorMessage(err) })
    } finally {
      setProfileBusy(false)
    }
  }

  const [pw, setPw] = useState({
    currentPassword: '',
    newPassword: '',
    confirm: '',
  })
  const [pwMsg, setPwMsg] = useState(none)
  const [passwordBusy, setPasswordBusy] = useState(false)

  async function savePassword(event) {
    event.preventDefault()
    setPwMsg(none)

    if (pw.newPassword.length < 8) {
      setPwMsg({
        type: 'error',
        text: 'The new password must have at least 8 characters.',
      })
      return
    }
    if (pw.newPassword !== pw.confirm) {
      setPwMsg({
        type: 'error',
        text: 'The two new passwords do not match.',
      })
      return
    }

    setPasswordBusy(true)
    try {
      await changePassword({
        currentPassword: pw.currentPassword,
        newPassword: pw.newPassword,
      })
      setPw({ currentPassword: '', newPassword: '', confirm: '' })
      setPwMsg({ type: 'ok', text: 'Password changed.' })
    } catch (err) {
      setPwMsg({ type: 'error', text: errorMessage(err) })
    } finally {
      setPasswordBusy(false)
    }
  }

  const [deactPassword, setDeactPassword] = useState('')
  const [deactMsg, setDeactMsg] = useState(none)
  const [deactivateBusy, setDeactivateBusy] = useState(false)

  async function deactivate(event) {
    event.preventDefault()
    setDeactMsg(none)
    if (
      !window.confirm(
        'Deactivate your account? You will not be able to log in again.',
      )
    ) {
      return
    }

    setDeactivateBusy(true)
    try {
      await deactivateAccount({ password: deactPassword })
      await logout()
    } catch (err) {
      setDeactMsg({ type: 'error', text: errorMessage(err) })
    } finally {
      setDeactivateBusy(false)
    }
  }

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <h1 className="text-2xl font-bold">My account</h1>

      <form onSubmit={saveProfile} className={card}>
        <h2 className="text-lg font-semibold">Profile</h2>
        <input
          type="email"
          value={user.email}
          disabled
          aria-label="Email"
          className={`${inputClass} bg-gray-100 text-gray-500`}
        />
        <input
          value={profile.fullName}
          onChange={(event) =>
            setProfile((current) => ({
              ...current,
              fullName: event.target.value,
            }))
          }
          placeholder="Full name"
          autoComplete="name"
          required
          className={inputClass}
        />
        <input
          type="tel"
          value={profile.phone}
          onChange={(event) =>
            setProfile((current) => ({ ...current, phone: event.target.value }))
          }
          placeholder="Phone number"
          autoComplete="tel"
          className={inputClass}
        />
        <input
          type="tel"
          value={profile.whatsappNumber}
          onChange={(event) =>
            setProfile((current) => ({
              ...current,
              whatsappNumber: event.target.value,
            }))
          }
          placeholder="WhatsApp number, digits only, e.g. 254712345678"
          autoComplete="tel"
          className={inputClass}
        />
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={profile.marketingConsent}
            onChange={(event) =>
              setProfile((current) => ({
                ...current,
                marketingConsent: event.target.checked,
              }))
            }
          />
          Send me offers and news
        </label>
        <Message msg={profileMsg} />
        <button
          type="submit"
          disabled={profileBusy}
          className="rounded-md bg-orange-600 px-5 py-2 text-sm font-semibold text-white disabled:opacity-60"
        >
          {profileBusy ? 'Saving...' : 'Save profile'}
        </button>
      </form>

      <form onSubmit={savePassword} className={card}>
        <h2 className="text-lg font-semibold">Change password</h2>
        <input
          type="password"
          value={pw.currentPassword}
          onChange={(event) =>
            setPw((current) => ({
              ...current,
              currentPassword: event.target.value,
            }))
          }
          placeholder="Current password"
          autoComplete="current-password"
          required
          className={inputClass}
        />
        <input
          type="password"
          value={pw.newPassword}
          onChange={(event) =>
            setPw((current) => ({
              ...current,
              newPassword: event.target.value,
            }))
          }
          placeholder="New password (at least 8 characters)"
          autoComplete="new-password"
          required
          className={inputClass}
        />
        <input
          type="password"
          value={pw.confirm}
          onChange={(event) =>
            setPw((current) => ({ ...current, confirm: event.target.value }))
          }
          placeholder="Repeat the new password"
          autoComplete="new-password"
          required
          className={inputClass}
        />
        <Message msg={pwMsg} />
        <button
          type="submit"
          disabled={passwordBusy}
          className="rounded-md bg-gray-900 px-5 py-2 text-sm font-semibold text-white disabled:opacity-60"
        >
          {passwordBusy ? 'Changing...' : 'Change password'}
        </button>
      </form>

      <form onSubmit={deactivate} className={`${card} border-red-200`}>
        <h2 className="text-lg font-semibold text-red-700">
          Deactivate account
        </h2>
        <p className="text-sm text-gray-600">
          Your order history is kept, but you will not be able to log in again.
        </p>
        <input
          type="password"
          value={deactPassword}
          onChange={(event) => setDeactPassword(event.target.value)}
          placeholder="Your password"
          autoComplete="current-password"
          required
          className={inputClass}
        />
        <Message msg={deactMsg} />
        <button
          type="submit"
          disabled={deactivateBusy}
          className="rounded-md bg-red-600 px-5 py-2 text-sm font-semibold text-white disabled:opacity-60"
        >
          {deactivateBusy ? 'Deactivating...' : 'Deactivate my account'}
        </button>
      </form>
    </div>
  )
}
