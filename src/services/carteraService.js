import api from './api.js'
import { carteraEjemplo, resumenDashboard } from '../mocks/mockDashboard.js'

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === 'true'

function delay(ms = 300) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

let carteraMock = [...carteraEjemplo]

export async function listarCartera(fecha) {
  if (USE_MOCKS) {
    await delay()
    return [...carteraMock]
  }
  const params = fecha ? { fecha } : {}
  const { data } = await api.get('/cartera', { params })
  return data
}

export async function marcarVisita(carteraId, payload) {
  if (USE_MOCKS) {
    await delay()
    const idx = carteraMock.findIndex((c) => c.id === carteraId)
    if (idx !== -1) {
      carteraMock[idx] = { ...carteraMock[idx], estado_visita: payload.resultado || 'visitado' }
      return { ...carteraMock[idx] }
    }
    throw new Error('Item de cartera no encontrado')
  }
  const { data } = await api.post(`/cartera/${carteraId}/visita`, payload)
  return data
}

export async function obtenerResumenDashboard() {
  if (USE_MOCKS) {
    await delay()
    const r = { ...resumenDashboard }
    return {
      solicitudes_total: r.solicitudes_total,
      solicitudes_enviadas: r.solicitudes_enviadas,
      solicitudes_aprobadas: r.solicitudes_aprobadas,
      solicitudes_condicionadas: r.solicitudes_condicionadas,
      solicitudes_rechazadas: r.solicitudes_rechazadas,
      solicitudes_desembolsadas: r.solicitudes_desembolsadas,
      solicitudes_libres: r.solicitudes_libres,
      mis_expedientes: r.mis_expedientes,
      monto_desembolsado_total: r.monto_desembolsado_total,
      monto_desembolsado_mes: r.monto_desembolsado_mes,
      creditos_activos: r.creditos_activos,
      clientes_atendidos: r.clientes_atendidos,
      cartera_pendientes: r.cartera_pendientes,
      cartera_completadas: r.cartera_completadas,
      total_cartera: r.total_cartera,
      monto_cartera: r.monto_cartera,
    }
  }
  const { data } = await api.get('/dashboard/resumen')
  return data
}
