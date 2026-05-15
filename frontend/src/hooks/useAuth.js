import { useEffect, useState } from 'react'
import { authService, getStoredUser } from '../services/auth.service'
import { STORAGE_KEYS } from '../api/config'

export const getAuthState = () => ({
  token: localStorage.getItem(STORAGE_KEYS.accessToken),
  user: getStoredUser(),
})

export const isAdminUser = (user) => ['admin', 'employee'].includes(user?.role) || Boolean(user?.employeeId)

export const isCandidateUser = (user) => user?.role === 'candidate' || Boolean(user?.registeredMobile)

export const useAuth = () => {
  const [state, setState] = useState(() => ({
    ...getAuthState(),
    isLoading: Boolean(localStorage.getItem(STORAGE_KEYS.accessToken)) && !getStoredUser(),
  }))

  useEffect(() => {
    let active = true
    const token = localStorage.getItem(STORAGE_KEYS.accessToken)
    if (!token) {
      setState((prev) => ({ ...prev, isLoading: false }))
      return undefined
    }

    authService.me()
      .then((user) => {
        if (active) setState({ token: localStorage.getItem(STORAGE_KEYS.accessToken), user, isLoading: false })
      })
      .catch(() => {
        if (active) setState({ token: null, user: null, isLoading: false })
      })

    return () => {
      active = false
    }
  }, [])

  return state
}
