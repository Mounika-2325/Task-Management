import axios from 'axios'

const configuredApiUrl = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:5000/api'
const apiBaseUrl = configuredApiUrl.replace(/\/+$/, '').endsWith('/api') ? configuredApiUrl.replace(/\/+$/, '') : `${configuredApiUrl.replace(/\/+$/, '')}/api`

const api = axios.create({
  baseURL: apiBaseUrl,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('northstar_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use((response) => response, (error) => {
  if (error.response?.status === 401) {
    localStorage.removeItem('northstar_token')
    window.dispatchEvent(new Event('northstar:unauthorized'))
  }
  return Promise.reject(error)
})

export const apiMessage = (error, fallback = 'Something went wrong. Please try again.') => error.response?.data?.message || (error.request ? 'Unable to connect to the API. Check that the backend is running.' : fallback)
export default api