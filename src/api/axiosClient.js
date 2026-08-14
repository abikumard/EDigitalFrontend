import axios from 'axios'
 
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://edigitalbackend.onrender.com'
 
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
})
 
export function getUserToken() {
  return localStorage.getItem('mv_user_token')
}
 
export function getAdminToken() {
  return localStorage.getItem('mv_admin_token')
}
 
export function userAuthHeader() {
  const token = getUserToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}
 
export function adminAuthHeader() {
  const token = getAdminToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}
 
// For <video>/<img>/<iframe> tags that can't attach an Authorization header,
// the backend also accepts the JWT as a ?token= query param on file routes.
export function protectedFileUrl(contentId) {
  const token = getUserToken() || getAdminToken()
  const q = token ? `?token=${encodeURIComponent(token)}` : ''
  return `${API_BASE_URL}/api/content/${contentId}/file${q}`
}
 
export function thumbnailUrl(relativeOrAbsolute) {
  if (!relativeOrAbsolute) return ''
  if (relativeOrAbsolute.startsWith('http')) return relativeOrAbsolute
  return `${API_BASE_URL}${relativeOrAbsolute}`
}
 
// A plain <a href=... download> is ignored by Chrome for cross-origin URLs
// (frontend is :5173, this API is :8080), so we fetch the bytes ourselves and
// save them as a blob instead — that works regardless of origin.
export async function downloadFile(contentId, fallbackName = 'download') {
  const response = await fetch(protectedFileUrl(contentId))
  if (!response.ok) {
    throw new Error('Download failed')
  }
 
  let filename = fallbackName
  const disposition = response.headers.get('Content-Disposition')
  if (disposition) {
    const match = disposition.match(/filename="([^"]+)"/)
    if (match && match[1]) {
      filename = match[1]
    }
  }
 
  const blob = await response.blob()
  const blobUrl = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = blobUrl
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.URL.revokeObjectURL(blobUrl)
}
 
// Friendly error message extraction
export function errorMessage(err, fallback = 'Something went wrong. Please try again.') {
  return err?.response?.data?.message || fallback
}