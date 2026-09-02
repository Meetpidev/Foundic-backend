import axios from 'axios'
import { useAuthStore } from '@/store/auth'

const api = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
})

export function getApiErrorMessage(error: any, fallback = 'Something went wrong. Please try again.') {
  const payload = error?.response?.data

  if (payload?.details?.fieldErrors) {
    const firstField = Object.values(payload.details.fieldErrors)[0]
    const firstMessage = Array.isArray(firstField) ? firstField[0] : firstField
    if (firstMessage) return String(firstMessage)
  }

  if (Array.isArray(payload?.details?.formErrors) && payload.details.formErrors.length > 0) {
    return String(payload.details.formErrors[0])
  }

  return payload?.message || fallback
}

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout()
    }
    return Promise.reject(error)
  }
)

export default api
