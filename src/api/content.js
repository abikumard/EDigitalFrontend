import { apiClient, userAuthHeader } from './axiosClient'

export const listContent = () =>
  apiClient.get('/api/content', { headers: userAuthHeader() })

export const getContent = (id) =>
  apiClient.get(`/api/content/${id}`, { headers: userAuthHeader() })
