import { apiClient, adminAuthHeader } from './axiosClient'

export const adminLogin = (email, password) =>
  apiClient.post('/api/admin/auth/login', { email, password })

export const adminListContent = () =>
  apiClient.get('/api/admin/content', { headers: adminAuthHeader() })

export const adminGetContent = (id) =>
  apiClient.get(`/api/admin/content/${id}`, { headers: adminAuthHeader() })

export const adminCreateContent = (formData) =>
  apiClient.post('/api/admin/content', formData, {
    headers: { ...adminAuthHeader(), 'Content-Type': 'multipart/form-data' },
  })

export const adminUpdateContent = (id, formData) =>
  apiClient.put(`/api/admin/content/${id}`, formData, {
    headers: { ...adminAuthHeader(), 'Content-Type': 'multipart/form-data' },
  })

export const adminDeleteContent = (id) =>
  apiClient.delete(`/api/admin/content/${id}`, { headers: adminAuthHeader() })

export const adminAddContentFile = (id, formData) =>
  apiClient.post(`/api/admin/content/${id}/files`, formData, {
    headers: { ...adminAuthHeader(), 'Content-Type': 'multipart/form-data' },
  })

export const adminRemoveContentFile = (id, fileId) =>
  apiClient.delete(`/api/admin/content/${id}/files/${fileId}`, { headers: adminAuthHeader() })

export const adminStats = () =>
  apiClient.get('/api/admin/dashboard/stats', { headers: adminAuthHeader() })

export const adminUsers = () =>
  apiClient.get('/api/admin/users', { headers: adminAuthHeader() })

export const adminUserDetail = (id) =>
  apiClient.get(`/api/admin/users/${id}`, { headers: adminAuthHeader() })

export const adminPurchases = () =>
  apiClient.get('/api/admin/purchases', { headers: adminAuthHeader() })