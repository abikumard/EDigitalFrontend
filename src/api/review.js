import { apiClient, userAuthHeader } from './axiosClient'

export const getBookReviews = (contentId) =>
  apiClient.get(`/api/reviews/book/${contentId}`)

export const addReview = (payload) =>
  apiClient.post('/api/reviews', payload, { headers: userAuthHeader() })
