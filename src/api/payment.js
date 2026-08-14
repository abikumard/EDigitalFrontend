import { apiClient, userAuthHeader } from './axiosClient'

export const createOrder = (contentId) =>
  apiClient.post('/api/payments/create-order', { contentId }, { headers: userAuthHeader() })

export const verifyPayment = (payload) =>
  apiClient.post('/api/payments/verify', payload, { headers: userAuthHeader() })

export const myPurchases = () =>
  apiClient.get('/api/user/purchases', { headers: userAuthHeader() })
