import axios from 'axios'
import demoAdapter from './demoAdapter.js'

export const isDemoMode = import.meta.env.VITE_DEMO_MODE === 'true'
const apiBaseUrl =
  import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL

const api = axios.create({
  baseURL: apiBaseUrl,
  ...(isDemoMode ? { adapter: demoAdapter } : {}),
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && localStorage.getItem('token')) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  },
)

export function errorMessage(error) {
  const data = error?.response?.data
  if (data?.fieldErrors) return Object.values(data.fieldErrors)[0]
  return data?.message || 'Something went wrong. Is the backend running?'
}

export default api
