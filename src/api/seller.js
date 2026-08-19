import { apiClient, userAuthHeader } from './axiosClient'

export const applySeller = (payload) =>
  apiClient.post('/api/user/seller/apply', payload, { headers: userAuthHeader() })

export const getSellerStatus = () =>
  apiClient.get('/api/user/seller/status', { headers: userAuthHeader() })