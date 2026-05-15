import { apiClient, unwrapData } from '../api/client'
import { STORAGE_KEYS } from '../api/config'

const saveSession = ({ user, accessToken }) => {
  if (accessToken) localStorage.setItem(STORAGE_KEYS.accessToken, accessToken)
  if (user) localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user))
  return { user, accessToken }
}

export const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.user) || 'null')
  } catch {
    return null
  }
}

export const authService = {
  async adminLogin(payload) {
    const response = await apiClient.post('/auth/admin/login', payload)
    return saveSession(unwrapData(response))
  },

  async candidateLogin(payload) {
    const response = await apiClient.post('/auth/login', payload)
    return saveSession(unwrapData(response))
  },

  async register(payload) {
    const response = await apiClient.post('/auth/register', payload)
    return unwrapData(response)
  },

  async verifyOtp(payload) {
    const response = await apiClient.post('/auth/verify-otp', payload)
    return saveSession(unwrapData(response))
  },

  async me() {
    const response = await apiClient.get('/auth/me')
    const data = unwrapData(response)
    if (data?.user) localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(data.user))
    return data?.user
  },

  async logout() {
    try {
      await apiClient.post('/auth/logout')
    } finally {
      localStorage.removeItem(STORAGE_KEYS.accessToken)
      localStorage.removeItem(STORAGE_KEYS.user)
    }
  },
}
