import { apiClient, userAuthHeader } from './axiosClient'

export const listContent = (category = '', search = '') => {
  const params = new URLSearchParams()
  if (category) params.append('category', category)
  if (search) params.append('search', search)
  const qs = params.toString() ? `?${params.toString()}` : ''
  return apiClient.get(`/api/content${qs}`, { headers: userAuthHeader() })
}

export const getContent = (id) =>
  apiClient.get(`/api/content/${id}`, { headers: userAuthHeader() })

export const getSample = (id) =>
  apiClient.get(`/api/content/${id}/sample`)

export const getMyLibrary = () =>
  apiClient.get('/api/content/my-library', { headers: userAuthHeader() })
