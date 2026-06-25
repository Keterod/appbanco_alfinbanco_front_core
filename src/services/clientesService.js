import api from './api.js'
import { obtenerFichaCompleta as mockFicha } from '../mocks/mockClientes.js'

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === 'true'

export async function obtenerFicha(clienteId) {
  if (USE_MOCKS) {
    const ficha = mockFicha(clienteId)
    if (!ficha) {
      const error = new Error('Cliente no encontrado')
      error.response = { status: 404, data: { detail: 'Cliente no encontrado.' } }
      throw error
    }
    return ficha
  }
  const { data } = await api.get(`/clientes/${clienteId}/ficha`)
  return data
}

export async function listarCreditos(clienteId) {
  if (USE_MOCKS) {
    const { creditosPorCliente } = await import('../mocks/mockCreditos.js')
    return creditosPorCliente(clienteId)
  }
  const { data } = await api.get(`/clientes/${clienteId}/creditos`)
  return data
}

export async function obtenerCronograma(creditoId) {
  if (USE_MOCKS) {
    const { cronogramaPorCredito } = await import('../mocks/mockCreditos.js')
    return cronogramaPorCredito(creditoId)
  }
  const { data } = await api.get(`/creditos/${creditoId}/cronograma`)
  return data
}
