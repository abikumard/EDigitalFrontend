import { apiClient, userAuthHeader } from './axiosClient'
 
export const getWishlist = () =>
  apiClient.get('/api/user/wishlist', { headers: userAuthHeader() })
 
export const getWishlistIds = () =>
  apiClient.get('/api/user/wishlist/ids', { headers: userAuthHeader() })
 
export const addToWishlist = (contentId) =>
  apiClient.post(`/api/user/wishlist/${contentId}`, {}, { headers: userAuthHeader() })
 
export const removeFromWishlist = (contentId) =>
  apiClient.delete(`/api/user/wishlist/${contentId}`, { headers: userAuthHeader() })
 