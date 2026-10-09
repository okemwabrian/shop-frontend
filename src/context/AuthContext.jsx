import { createContext, useContext, useState } from 'react'
import * as shop from '../api/shop.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user')
    return saved ? JSON.parse(saved) : null
  })

  function save(data) {
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))
    setUser(data.user)
  }

  async function login(email, password) {
    save(await shop.login({ email, password }))
  }

  async function register(fullName, email, password) {
    save(await shop.register({ fullName, email, password }))
  }

  async function logout() {
    try {
      await shop.logoutApi()
    } catch {
      // The token may already be invalid, we log out locally anyway.
    }

    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext)
}
