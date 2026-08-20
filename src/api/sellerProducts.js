import { apiClient, userAuthHeader } from './axiosClient'

export const sellerListProducts = () =>
  apiClient.get('/api/user/seller/products', { headers: userAuthHeader() })

export const sellerCreateProduct = (formData) =>
  apiClient.post('/api/user/seller/products', formData, {
    headers: { ...userAuthHeader(), 'Content-Type': 'multipart/form-data' },
  })

export const sellerUpdateProduct = (id, formData) =>
  apiClient.put(`/api/user/seller/products/${id}`, formData, {
    headers: { ...userAuthHeader(), 'Content-Type': 'multipart/form-data' },
  })

export const sellerDeleteProduct = (id) =>
  apiClient.delete(`/api/user/seller/products/${id}`, { headers: userAuthHeader() })

export const sellerAddProductFile = (id, formData) =>
  apiClient.post(`/api/user/seller/products/${id}/files`, formData, {
    headers: { ...userAuthHeader(), 'Content-Type': 'multipart/form-data' },
  })

export const sellerRemoveProductFile = (id, fileId) =>
  apiClient.delete(`/api/user/seller/products/${id}/files/${fileId}`, { headers: userAuthHeader() })