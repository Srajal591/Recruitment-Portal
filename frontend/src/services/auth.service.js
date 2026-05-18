import { apiClient, unwrapData } from '../api/client'
import { STORAGE_KEYS } from '../api/config'

// Normalise the user object so it always has a `role` field.
// The Employee model has no role field — we infer it from employeeId / officialEmail.
const normaliseUser = (user) => {
  if (!user) return user
  if (user.role) return user
  if (user.employeeId || user.officialEmail) return { ...user, role: 'employee' }
  return user
}

const saveSession = ({ user, accessToken }) => {
  if (accessToken) localStorage.setItem(STORAGE_KEYS.accessToken, accessToken)
  const normalisedUser = normaliseUser(user)
  if (normalisedUser) localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(normalisedUser))
  return { user: normalisedUser, accessToken }
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
    const user = normaliseUser(data?.user)
    if (user) localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user))
    return user
  },

  async logout() {
    try {
      await apiClient.post('/auth/logout')
    } finally {
      localStorage.removeItem(STORAGE_KEYS.accessToken)
      localStorage.removeItem(STORAGE_KEYS.user)
    }
  },

  async forgotPassword(email) {
    const response = await apiClient.post('/auth/forgot-password', { email })
    return unwrapData(response)
  },
}
