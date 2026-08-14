import { apiClient } from './axiosClient'

export const signup = (identifier, password, confirmPassword) =>
  apiClient.post('/api/auth/signup', { identifier, password, confirmPassword })

export const login = (identifier, password) =>
  apiClient.post('/api/auth/login', { identifier, password })
