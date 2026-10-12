import api from './client.js'

const data = (response) => response.data

export const createProduct = (body) =>
  api.post('/api/products', body).then(data)
export const updateProduct = (id, body) =>
  api.put(`/api/products/${id}`, body).then(data)
export const deleteProduct = (id) => api.delete(`/api/products/${id}`).then(data)

export const createCategory = (body) =>
  api.post('/api/categories', body).then(data)
export const updateCategory = (id, body) =>
  api.put(`/api/categories/${id}`, body).then(data)
export const deleteCategory = (id) =>
  api.delete(`/api/categories/${id}`).then(data)

export const adminOrders = (params) =>
  api.get('/api/admin/orders', { params }).then(data)
export const updateOrderStatus = (id, status) =>
  api.patch(`/api/admin/orders/${id}/status`, { status }).then(data)
export const customerWhatsapp = (id) =>
  api.get(`/api/admin/orders/${id}/customer-whatsapp`).then(data)

export const adminTickets = (params) =>
  api.get('/api/admin/support/tickets', { params }).then(data)
export const updateTicket = (id, body) =>
  api.patch(`/api/admin/support/tickets/${id}`, body).then(data)
export const getConversations = () =>
  api.get('/api/admin/chat/conversations').then(data)
export const getConversation = (customerId) =>
  api.get(`/api/admin/chat/${customerId}`).then(data)
