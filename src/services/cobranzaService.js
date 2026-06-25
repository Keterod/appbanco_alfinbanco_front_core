import api from './api.js'
import { moraEjemplo } from '../mocks/mockDashboard.js'

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === 'true'

function delay(ms = 300) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

let moraMock = [...moraEjemplo]

export async function listarMora() {
  if (USE_MOCKS) {
    await delay()
    return [...moraMock]
  }
  const { data } = await api.get('/cobranza/mora')
  return data
}

export async function registrarAccion(payload) {
  if (USE_MOCKS) {
    await delay()
    return { id: `acc-${Date.now()}`, ...payload, created_at: new Date().toISOString() }
  }
  const { data } = await api.post('/cobranza/accion', payload)
  return data
}
