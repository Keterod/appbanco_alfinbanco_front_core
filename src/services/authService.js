import api, { TOKEN_KEY, USER_KEY } from './api.js'

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === 'true'

function normalizarUser(raw) {
  return {
    id: raw.id,
    codigo_empleado: raw.codigo_empleado,
    codigo: raw.codigo ?? raw.codigo_empleado,
    nombres: raw.nombres ?? '',
    apellidos: raw.apellidos ?? '',
    nombre: `${raw.nombres ?? ''} ${raw.apellidos ?? ''}`.trim() || raw.codigo_empleado,
    nombre_completo: `${raw.nombres ?? ''} ${raw.apellidos ?? ''}`.trim(),
    perfil: raw.perfil ?? 'operador',
    agencia_id: raw.agencia_id ?? null,
  }
}

const asesorMock = normalizarUser({
  id: 'asesor-001',
  codigo_empleado: 'OFI001',
  nombres: 'Carlos',
  apellidos: 'Quispe Huamán',
  perfil: 'asesor',
  agencia_id: 'ag-001',
})

export async function login(codigoEmpleado, password) {
  if (USE_MOCKS) {
    if (codigoEmpleado === 'OFI001' && password === 'alfin123') {
      return { token: 'mock-token-alfin-001', user: { ...asesorMock } }
    }
    const error = new Error('Credenciales inválidas')
    error.response = { status: 401, data: { detail: 'Código de empleado o contraseña incorrectos.' } }
    throw error
  }

  const { data } = await api.post('/auth/login', {
    codigo_empleado: codigoEmpleado,
    password,
  })
  const token = data.access_token
  const a = data.asesor || {}
  const user = normalizarUser({
    id: a.id,
    codigo_empleado: a.codigo_empleado ?? codigoEmpleado,
    nombres: a.nombres,
    apellidos: a.apellidos,
    perfil: a.perfil,
    agencia_id: a.agencia_id,
  })
  return { token, user }
}

export async function obtenerPerfil() {
  if (USE_MOCKS) {
    return {
      id: asesorMock.id,
      codigo: asesorMock.codigo_empleado,
      nombres: asesorMock.nombres,
      apellidos: asesorMock.apellidos,
      email: 'cquispe@bancoalfin.pe',
      agencia_id: asesorMock.agencia_id,
      rol: 'asesor',
    }
  }
  const { data } = await api.get('/auth/me')
  return data
}

export function saveSession(token, user) {
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

export function getStoredToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function getStoredUser() {
  try {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}
