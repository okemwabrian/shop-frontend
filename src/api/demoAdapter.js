const storageKey = 'sokochap-demo-state'
const legacyStorageKey = 'myshop-demo-state'

const categories = [
  {
    id: 1,
    name: 'Phones and Tablets',
    children: [
      { id: 2, name: 'Smartphones' },
      { id: 3, name: 'Tablets' },
      { id: 4, name: 'Phone Accessories' },
    ],
  },
  {
    id: 5,
    name: 'TVs and Radios',
    children: [
      { id: 6, name: 'Televisions' },
      { id: 7, name: 'Home Theatre' },
      { id: 8, name: 'Radios' },
    ],
  },
  {
    id: 9,
    name: 'Appliances',
    children: [
      { id: 10, name: 'Kitchen Appliances' },
      { id: 11, name: 'Refrigerators and Freezers' },
      { id: 12, name: 'Washing Machines' },
    ],
  },
  {
    id: 13,
    name: 'Health and Beauty',
    children: [{ id: 14, name: 'Skincare' }, { id: 15, name: 'Hair Care' }],
  },
  {
    id: 16,
    name: 'Home and Office',
    children: [{ id: 17, name: 'Furniture' }, { id: 18, name: 'Office Supplies' }],
  },
  {
    id: 19,
    name: 'Fashion',
    children: [{ id: 20, name: 'Mens Fashion' }, { id: 21, name: 'Womens Fashion' }],
  },
  {
    id: 22,
    name: 'Computing',
    children: [{ id: 23, name: 'Laptops' }, { id: 24, name: 'Computer Accessories' }],
  },
  {
    id: 25,
    name: 'Gaming',
    children: [{ id: 26, name: 'Consoles' }, { id: 27, name: 'Video Games' }],
  },
  {
    id: 28,
    name: 'Baby Products',
    children: [{ id: 29, name: 'Diapers and Wipes' }, { id: 30, name: 'Baby Toys' }],
  },
]

const products = [
  { id: 1, name: 'Galaxy Phone 128GB', brand: 'Samsung', categoryId: 2, categoryName: 'Smartphones', price: 24999, stock: 18, imageUrl: 'https://placehold.co/600x400?text=Galaxy+Phone', description: '6.5 inch AMOLED, 50MP camera' },
  { id: 2, name: 'Budget Smartphone 64GB', brand: 'Tecno', categoryId: 2, categoryName: 'Smartphones', price: 11999, stock: 25, imageUrl: 'https://placehold.co/600x400?text=Smartphone', description: 'A reliable everyday smartphone' },
  { id: 3, name: '10 inch Tablet', brand: 'Lenovo', categoryId: 3, categoryName: 'Tablets', price: 18500, stock: 12, imageUrl: 'https://placehold.co/600x400?text=Tablet', description: '10 inch display tablet' },
  { id: 4, name: '43 inch Smart TV', brand: 'Hisense', categoryId: 6, categoryName: 'Televisions', price: 32999, stock: 8, imageUrl: 'https://placehold.co/600x400?text=Smart+TV', description: 'Full HD smart television' },
  { id: 5, name: 'Gaming Laptop 16GB', brand: 'HP', categoryId: 23, categoryName: 'Laptops', price: 89999, stock: 5, imageUrl: 'https://placehold.co/600x400?text=Gaming+Laptop', description: 'Powerful laptop for work and gaming' },
  { id: 6, name: 'Wireless Mouse', brand: 'Logitech', categoryId: 24, categoryName: 'Computer Accessories', price: 1500, stock: 40, imageUrl: 'https://placehold.co/600x400?text=Wireless+Mouse', description: 'Wireless optical mouse' },
  { id: 7, name: 'Baby Diapers Pack', brand: 'Pampers', categoryId: 29, categoryName: 'Diapers and Wipes', price: 1800, stock: 30, imageUrl: 'https://placehold.co/600x400?text=Baby+Diapers', description: 'Comfortable baby diapers' },
  { id: 8, name: 'Running Shoes', brand: 'Nike', categoryId: 21, categoryName: 'Womens Fashion', price: 6500, stock: 14, imageUrl: 'https://placehold.co/600x400?text=Running+Shoes', description: 'Lightweight everyday running shoes' },
]

const faqs = [
  { id: 1, category: 'Orders', question: 'How do I track my order?', answer: 'Open My Orders and select the order. The status shows where it is.' },
  { id: 2, category: 'Orders', question: 'Can I cancel an order?', answer: 'You can cancel an order while its status is Pending or Confirmed.' },
  { id: 3, category: 'Payments', question: 'Which payment methods do you accept?', answer: 'Pay on delivery is available in this demo.' },
  { id: 4, category: 'Delivery', question: 'How much is delivery?', answer: 'Delivery is KES 300, or free for orders of KES 5,000 or more.' },
  { id: 5, category: 'Returns', question: 'How do I return an item?', answer: 'Contact support with your order number to discuss a return.' },
]

function initialState() {
  return {
    user: null,
    cart: [],
    wishlist: [],
    orders: [],
    tickets: [],
    recentlyViewed: [],
    orderId: 1,
    ticketId: 1,
  }
}

function readState() {
  try {
    const storedState = localStorage.getItem(storageKey) ?? localStorage.getItem(legacyStorageKey)
    return { ...initialState(), ...JSON.parse(storedState || '{}') }
  } catch {
    return initialState()
  }
}

let state = readState()

function save() {
  localStorage.setItem(storageKey, JSON.stringify(state))
}

function response(config, data, status = 200) {
  return Promise.resolve({
    data,
    status,
    statusText: status === 201 ? 'Created' : 'OK',
    headers: {},
    config,
    request: {},
  })
}

function rejected(config, status, message, fieldErrors) {
  const error = new Error(message)
  error.config = config
  error.response = {
    data: { message, ...(fieldErrors ? { fieldErrors } : {}) },
    status,
    statusText: status === 404 ? 'Not Found' : 'Bad Request',
    headers: {},
    config,
  }
  return Promise.reject(error)
}

function cartResult() {
  const items = state.cart
    .map(({ productId, quantity }) => {
      const product = products.find((entry) => entry.id === productId)
      if (!product) return null
      return {
        productId,
        name: product.name,
        imageUrl: product.imageUrl,
        quantity,
        unitPrice: product.price,
        lineTotal: product.price * quantity,
      }
    })
    .filter(Boolean)
  const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0)
  const shippingFee = subtotal === 0 || subtotal >= 5000 ? 0 : 300
  return {
    items,
    totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
    subtotal,
    shippingFee,
    total: subtotal + shippingFee,
  }
}

function orderFromCart(body) {
  const cart = cartResult()
  const id = state.orderId++
  return {
    id,
    orderNumber: `DEMO-${String(id).padStart(6, '0')}`,
    status: 'PENDING',
    createdAt: new Date().toISOString(),
    items: cart.items.map((item) => ({
      ...item,
      productName: item.name,
    })),
    subtotal: cart.subtotal,
    shippingFee: cart.shippingFee,
    total: cart.total,
    shippingName: body.shippingName,
    shippingPhone: body.shippingPhone,
    shippingAddress: body.shippingAddress,
    shippingCity: body.shippingCity,
    paymentMethod: body.paymentMethod,
  }
}

function matchCategory(product, requestedId) {
  if (!requestedId) return true
  const id = Number(requestedId)
  const category = categories.find((entry) => entry.id === id)
  return category
    ? [category.id, ...category.children.map((child) => child.id)].includes(product.categoryId)
    : product.categoryId === id
}

function sortProducts(list, sort) {
  if (!sort) return list
  const [key, direction] = sort.split(',')
  return [...list].sort((a, b) => {
    const comparison =
      typeof a[key] === 'string'
        ? a[key].localeCompare(b[key])
        : Number(a[key]) - Number(b[key])
    return direction === 'desc' ? -comparison : comparison
  })
}

export default function demoAdapter(config) {
  const method = (config.method || 'get').toLowerCase()
  const path = new URL(config.url, config.baseURL || window.location.origin).pathname
  const query = new URL(config.url, config.baseURL || window.location.origin).searchParams
  const body = typeof config.data === 'string' ? JSON.parse(config.data || '{}') : (config.data || {})
  let match

  if (method === 'get' && path === '/api/categories') return response(config, categories)
  if (method === 'get' && path === '/api/products') {
    let list = products.filter((product) => {
      const q = (query.get('q') || '').toLowerCase()
      return (!q || product.name.toLowerCase().includes(q)) &&
        matchCategory(product, query.get('categoryId'))
    })
    list = sortProducts(list, query.get('sort'))
    const page = Math.max(0, Number(query.get('page') || 0))
    const size = Math.max(1, Number(query.get('size') || 12))
    return response(config, {
      content: list.slice(page * size, (page + 1) * size),
      totalElements: list.length,
      totalPages: Math.ceil(list.length / size),
      number: page,
      size,
    })
  }
  if (method === 'get' && path === '/api/products/suggestions') {
    const q = (query.get('q') || '').toLowerCase()
    return response(config, {
      products: products.filter((product) => product.name.toLowerCase().includes(q)).map((product) => product.name).slice(0, 5),
      categories: categories.flatMap((category) => [category, ...category.children]).filter((category) => category.name.toLowerCase().includes(q)).map((category) => category.name).slice(0, 5),
    })
  }
  if ((match = path.match(/^\/api\/products\/(\d+)$/)) && method === 'get') {
    const product = products.find((entry) => entry.id === Number(match[1]))
    if (!product) return rejected(config, 404, 'Product not found')
    if (state.user) {
      state.recentlyViewed = [product.id, ...state.recentlyViewed.filter((id) => id !== product.id)].slice(0, 20)
      save()
    }
    return response(config, product)
  }

  if (method === 'post' && path === '/api/auth/login') {
    if (!body.email || !body.password) return rejected(config, 400, 'Email and password are required.')
    state.user = state.user || {
      id: 1,
      email: body.email,
      fullName: body.email.split('@')[0].replace(/[._-]/g, ' '),
      phone: '',
      whatsappNumber: '',
      marketingConsent: false,
    }
    save()
    return response(config, { token: 'demo-token', user: state.user })
  }
  if (method === 'post' && path === '/api/auth/register') {
    if (!body.fullName || !body.email || !body.password) return rejected(config, 400, 'Please complete all required fields.')
    state.user = {
      id: 1,
      email: body.email,
      fullName: body.fullName,
      phone: '',
      whatsappNumber: '',
      marketingConsent: false,
    }
    save()
    return response(config, { token: 'demo-token', user: state.user }, 201)
  }
  if (method === 'post' && path === '/api/auth/logout') {
    state.user = null
    save()
    return response(config, {})
  }

  if (path === '/api/cart' && method === 'get') return response(config, cartResult())
  if (path === '/api/cart/items' && method === 'post') {
    const product = products.find((entry) => entry.id === Number(body.productId))
    if (!product) return rejected(config, 404, 'Product not found')
    const current = state.cart.find((entry) => entry.productId === product.id)
    const quantity = Number(body.quantity) || 1
    if (quantity + (current?.quantity || 0) > product.stock) return rejected(config, 400, `Only ${product.stock} ${product.name} left in stock.`)
    if (current) current.quantity += quantity
    else state.cart.push({ productId: product.id, quantity })
    save()
    return response(config, cartResult())
  }
  if ((match = path.match(/^\/api\/cart\/items\/(\d+)$/))) {
    const productId = Number(match[1])
    if (method === 'delete' || (method === 'put' && Number(body.quantity) <= 0)) {
      state.cart = state.cart.filter((entry) => entry.productId !== productId)
      save()
      return response(config, cartResult())
    }
    if (method === 'put') {
      const product = products.find((entry) => entry.id === productId)
      if (!product || Number(body.quantity) > product.stock) return rejected(config, 400, 'Requested quantity exceeds available stock.')
      const item = state.cart.find((entry) => entry.productId === productId)
      if (item) item.quantity = Number(body.quantity)
      save()
      return response(config, cartResult())
    }
  }

  if (method === 'post' && path === '/api/orders') {
    if (!state.cart.length) return rejected(config, 400, 'Your cart is empty.')
    const order = orderFromCart(body)
    state.orders.unshift(order)
    state.cart = []
    save()
    return response(config, order, 201)
  }
  if (method === 'get' && path === '/api/orders') {
    const q = (query.get('q') || '').toLowerCase()
    const list = state.orders.filter((order) =>
      !q || order.orderNumber.toLowerCase().includes(q) ||
      order.items.some((item) => item.productName.toLowerCase().includes(q)),
    )
    const page = Math.max(0, Number(query.get('page') || 0))
    const size = Math.max(1, Number(query.get('size') || 10))
    return response(config, {
      content: list.slice(page * size, (page + 1) * size),
      totalElements: list.length,
      totalPages: Math.ceil(list.length / size),
    })
  }
  if ((match = path.match(/^\/api\/orders\/(\d+)$/)) && method === 'get') {
    const order = state.orders.find((entry) => entry.id === Number(match[1]))
    return order ? response(config, order) : rejected(config, 404, 'Order not found')
  }
  if ((match = path.match(/^\/api\/orders\/(\d+)\/cancel$/)) && method === 'post') {
    const order = state.orders.find((entry) => entry.id === Number(match[1]))
    if (!order) return rejected(config, 404, 'Order not found')
    order.status = 'CANCELLED'
    save()
    return response(config, order)
  }
  if ((match = path.match(/^\/api\/orders\/(\d+)\/whatsapp-link$/)) && method === 'get') {
    const order = state.orders.find((entry) => entry.id === Number(match[1]))
    if (!order) return rejected(config, 404, 'Order not found')
    return response(config, { url: `https://wa.me/254112549445?text=${encodeURIComponent(`Hello, I have a question about ${order.orderNumber}`)}` })
  }

  if (method === 'get' && path === '/api/wishlist') return response(config, state.wishlist.map((id) => products.find((product) => product.id === id)).filter(Boolean))
  if ((match = path.match(/^\/api\/wishlist\/(\d+)$/))) {
    const id = Number(match[1])
    if (method === 'post' && !state.wishlist.includes(id)) state.wishlist.unshift(id)
    if (method === 'delete') state.wishlist = state.wishlist.filter((entry) => entry !== id)
    save()
    return response(config, state.wishlist.map((entry) => products.find((product) => product.id === entry)).filter(Boolean))
  }
  if ((match = path.match(/^\/api\/wishlist\/(\d+)\/move-to-cart$/)) && method === 'post') {
    const productId = Number(match[1])
    if (!state.wishlist.includes(productId)) return rejected(config, 404, 'Wishlist item not found.')
    const item = state.cart.find((entry) => entry.productId === productId)
    if (item) item.quantity += 1
    else state.cart.push({ productId, quantity: 1 })
    state.wishlist = state.wishlist.filter((id) => id !== productId)
    save()
    return response(config, cartResult())
  }
  if (method === 'get' && path === '/api/recently-viewed') return response(config, state.recentlyViewed.map((id) => products.find((product) => product.id === id)).filter(Boolean))
  if (method === 'delete' && path === '/api/recently-viewed') {
    state.recentlyViewed = []
    save()
    return response(config, {})
  }

  if (method === 'put' && path === '/api/account/me') {
    state.user = { ...state.user, ...body }
    save()
    return response(config, state.user)
  }
  if (method === 'post' && path === '/api/account/change-password') return response(config, { message: 'Password changed.' })
  if (method === 'post' && path === '/api/account/deactivate') {
    state.user = null
    save()
    return response(config, {})
  }

  if (method === 'get' && path === '/api/support/faqs') return response(config, faqs)
  if (method === 'get' && path === '/api/support/contact') return response(config, {
    email: 'support@sokochap.com',
    phone: '+254112549445',
    hours: 'Mon-Sat, 8:00 to 18:00 (EAT)',
    whatsappLink: 'https://wa.me/254112549445?text=Hello%2C%20I%20need%20help',
  })
  if (method === 'post' && path === '/api/support/tickets') {
    if (!body.subject || !body.message) return rejected(config, 400, 'Subject and message are required.')
    const ticket = { id: state.ticketId++, subject: body.subject, message: body.message, status: 'OPEN', adminResponse: null, createdAt: new Date().toISOString() }
    state.tickets.unshift(ticket)
    save()
    return response(config, ticket, 201)
  }
  if (method === 'get' && path === '/api/support/tickets') return response(config, state.tickets)

  if ((match = path.match(/^\/api\/legal\/(privacy-policy|terms)$/)) && method === 'get') {
    const privacy = match[1] === 'privacy-policy'
    return response(config, {
      title: privacy ? 'Privacy Policy' : 'Terms and Conditions',
      version: 'Demo',
      lastUpdated: 'Demo preview',
      content: privacy
        ? 'Demo preview only. This sample policy explains that account and order information is used to demonstrate this interface. No information is submitted to a production store.'
        : 'Demo preview only. No real orders, payments, deliveries, or commercial terms apply in this preview.',
    })
  }
  if (method === 'get' && path === '/api/whatsapp/support-link') {
    return response(config, { url: `https://wa.me/254112549445?text=${encodeURIComponent(query.get('message') || 'Hello, I need help')}` })
  }
  if ((match = path.match(/^\/api\/whatsapp\/share-product\/(\d+)$/)) && method === 'get') {
    const product = products.find((entry) => entry.id === Number(match[1]))
    if (!product) return rejected(config, 404, 'Product not found')
    const url = `${window.location.origin}/products/${product.id}`
    return response(config, { url: `https://wa.me/?text=${encodeURIComponent(`Check out ${product.name}: ${url}`)}` })
  }

  return rejected(config, 501, `Demo API does not implement ${method.toUpperCase()} ${path}.`)
}
