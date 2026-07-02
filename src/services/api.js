import axios from 'axios'

export const TOKEN_KEY = 'cm_token'
export const USER_KEY = 'cm_user'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8003'

// Logs de depuración: muestran la URL exacta a la que apunta el frontend.
console.log('[api] import.meta.env.VITE_API_BASE_URL:', import.meta.env.VITE_API_BASE_URL)
console.log('[api] API_BASE_URL usado:', API_BASE_URL)
console.log('[api] VITE_USE_MOCKS:', import.meta.env.VITE_USE_MOCKS)

// Instancia central de axios para todo el portal de Fuerza de Ventas.
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 20000,
})

// --- Request: inyecta el Bearer token del asesor en cada petición ---
api.interceptors.request.use((config) => {
  const fullUrl = `${config.baseURL ?? ''}${config.url ?? ''}`
  console.log(`[api] request -> ${config.method?.toUpperCase()} ${fullUrl}`)
  const token = localStorage.getItem(TOKEN_KEY)
  if (token) {
    config.headers = config.headers || {}
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// --- Response: ante 401 limpia la sesión y redirige al login ---
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status
    if (status === 401) {
      const enLogin = window.location.pathname.startsWith('/login') ||
        window.location.pathname === '/'
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(USER_KEY)
      if (!enLogin) window.location.assign('/login')
    }
    return Promise.reject(error)
  },
)

export default api
