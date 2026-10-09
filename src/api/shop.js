import api from './client.js'

const data = (response) => response.data

export const getCategories = () => api.get('/api/categories').then(data)
export const getProducts = (params) =>
  api.get('/api/products', { params }).then(data)
export const getProduct = (id) =>
  api.get(`/api/products/${id}`).then(data)

export const login = (body) => api.post('/api/auth/login', body).then(data)
export const register = (body) =>
  api.post('/api/auth/register', body).then(data)
export const logoutApi = () => api.post('/api/auth/logout').then(data)

export const getCart = () => api.get('/api/cart').then(data)
export const addToCart = (productId, quantity) =>
  api.post('/api/cart/items', { productId, quantity }).then(data)
export const setCartQuantity = (productId, quantity) =>
  api.put(`/api/cart/items/${productId}`, { quantity }).then(data)
export const removeCartItem = (productId) =>
  api.delete(`/api/cart/items/${productId}`).then(data)

export const checkout = (body) => api.post('/api/orders', body).then(data)
export const getOrders = (params) => api.get('/api/orders', { params }).then(data)
export const getOrder = (id) => api.get(`/api/orders/${id}`).then(data)
export const cancelOrder = (id) => api.post(`/api/orders/${id}/cancel`).then(data)
export const getOrderWhatsapp = (id) =>
  api.get(`/api/orders/${id}/whatsapp-link`).then(data)

export const getWishlist = () => api.get('/api/wishlist').then(data)
export const addWish = (productId) => api.post(`/api/wishlist/${productId}`).then(data)
export const removeWish = (productId) =>
  api.delete(`/api/wishlist/${productId}`).then(data)
export const moveWishToCart = (productId) =>
  api.post(`/api/wishlist/${productId}/move-to-cart`).then(data)
export const getRecentlyViewed = () => api.get('/api/recently-viewed').then(data)
export const clearRecentlyViewed = () => api.delete('/api/recently-viewed').then(data)

export const updateMe = (body) => api.put('/api/account/me', body).then(data)
export const changePassword = (body) =>
  api.post('/api/account/change-password', body).then(data)
export const deactivateAccount = (body) =>
  api.post('/api/account/deactivate', body).then(data)

export const getFaqs = () => api.get('/api/support/faqs').then(data)
export const getContact = () => api.get('/api/support/contact').then(data)
export const createTicket = (body) => api.post('/api/support/tickets', body).then(data)
export const getTickets = () => api.get('/api/support/tickets').then(data)

export const getLegal = (name) => api.get(`/api/legal/${name}`).then(data)
export const getSupportLink = (message) =>
  api.get('/api/whatsapp/support-link', { params: { message } }).then(data)
export const getShareLink = (productId) =>
  api.get(`/api/whatsapp/share-product/${productId}`).then(data)
export const getSuggestions = (q) =>
  api.get('/api/products/suggestions', { params: { q } }).then(data)
