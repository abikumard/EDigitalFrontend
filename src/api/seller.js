import { apiClient, userAuthHeader } from './axiosClient'

export const getSellerStatus = () =>
  apiClient.get('/api/user/seller/status', { headers: userAuthHeader() })

export const applySeller = (payload) =>
  apiClient.post('/api/user/seller/apply', payload, { headers: userAuthHeader() })

export const getBookshelf = () =>
  apiClient.get('/api/seller/books/bookshelf', { headers: userAuthHeader() })

export const publishBook = (formData) =>
  apiClient.post('/api/seller/books/publish', formData, {
    headers: { ...userAuthHeader(), 'Content-Type': 'multipart/form-data' }
  })

export const getPublisherProfile = () =>
  apiClient.get('/api/publisher/profile', { headers: userAuthHeader() })

export const updatePublisherProfile = (payload) =>
  apiClient.post('/api/publisher/profile', payload, { headers: userAuthHeader() })

export const getPublisherAnalytics = () =>
  apiClient.get('/api/publisher/analytics', { headers: userAuthHeader() })

export const requestPayout = (payload) =>
  apiClient.post('/api/publisher/payout/request', payload, { headers: userAuthHeader() })

export const getPayoutHistory = () =>
  apiClient.get('/api/publisher/payout/history', { headers: userAuthHeader() })
