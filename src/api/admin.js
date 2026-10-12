import api from './client.js'

const data = (response) => response.data

export const getAdminSummary = () => api.get('/api/admin/summary').then(data)
export const getAdminProducts = (params) =>
  api.get('/api/admin/products', { params }).then(data)
export const getAdminCategories = () => api.get('/api/admin/categories').then(data)
export const getAdminOrders = (params) =>
  api.get('/api/admin/orders', { params }).then(data)
export const getAdminTickets = (params) =>
  api.get('/api/admin/tickets', { params }).then(data)
export const getAdminChat = () => api.get('/api/admin/chat').then(data)
