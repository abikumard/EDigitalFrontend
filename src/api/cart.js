import { apiClient, userAuthHeader } from './axiosClient'
 
export const getCart = () =>
  apiClient.get('/api/user/cart', { headers: userAuthHeader() })
 
export const addToCart = (contentId) =>
  apiClient.post(`/api/user/cart/${contentId}`, {}, { headers: userAuthHeader() })
 
export const removeFromCart = (contentId) =>
  apiClient.delete(`/api/user/cart/${contentId}`, { headers: userAuthHeader() })
 
export const clearCart = () =>
  apiClient.delete('/api/user/cart', { headers: userAuthHeader() })
 
export const createCartOrder = () =>
  apiClient.post('/api/payments/create-cart-order', {}, { headers: userAuthHeader() })
 
export const verifyCartPayment = (payload) =>
  apiClient.post('/api/payments/verify-cart', payload, { headers: userAuthHeader() })
 