const DEFAULT_BASE_URL = 'http://localhost:5000/api/v1'

export const rawBaseUrl = import.meta.env.VITE_BASE_URL || DEFAULT_BASE_URL

export const API_BASE_URL = rawBaseUrl.replace(/\/$/, '').replace(/\/api\/v1$/, '/api')

export const STORAGE_KEYS = {
  accessToken: 'rp_access_token',
  user: 'rp_user',
}
