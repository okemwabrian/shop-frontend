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
