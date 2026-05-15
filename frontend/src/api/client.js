import axios from 'axios'
import toast from 'react-hot-toast'
import { API_BASE_URL, STORAGE_KEYS } from './config'

const getStoredToken = () => localStorage.getItem(STORAGE_KEYS.accessToken)

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use((config) => {
  const token = getStoredToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

apiClient.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config
    const status = error.response?.status
    const isAuthEndpoint = originalRequest?.url?.startsWith('/auth/')
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      (error.code === 'ECONNABORTED' ? 'Request timed out. Please confirm backend services are running.' : null) ||
      'Something went wrong. Please try again.'

    if (status === 401 && !originalRequest?._retry && !isAuthEndpoint) {
      originalRequest._retry = true
      try {
        const refreshResponse = await axios.post(
          `${API_BASE_URL}/auth/refresh-token`,
          {},
          { withCredentials: true },
        )
        const accessToken = refreshResponse.data?.data?.accessToken
        if (accessToken) {
          localStorage.setItem(STORAGE_KEYS.accessToken, accessToken)
          originalRequest.headers.Authorization = `Bearer ${accessToken}`
          return apiClient(originalRequest)
        }
      } catch {
        localStorage.removeItem(STORAGE_KEYS.accessToken)
        localStorage.removeItem(STORAGE_KEYS.user)
        if (!window.location.pathname.startsWith('/auth')) {
          window.location.href = '/auth/candidate-login'
        }
      }
    }

    if (status !== 401 && status !== 404) {
      toast.error(message)
    }

    return Promise.reject({
      status,
      message,
      errors: error.response?.data?.errors || [],
      raw: error,
    })
  },
)

export const unwrapData = (response) => response?.data ?? response
