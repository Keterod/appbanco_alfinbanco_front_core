import api from './api.js'
import { solicitudesData } from '../mocks/mockSolicitudes.js'

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === 'true'

function delay(ms = 300) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function listarSolicitudes(filters = {}) {
  if (USE_MOCKS) {
    await delay()
    return [...solicitudesData]
  }
  const params = {}
  if (filters.fecha_inicio) params.fecha_inicio = filters.fecha_inicio
  if (filters.fecha_fin) params.fecha_fin = filters.fecha_fin
  const { data } = await api.get('/solicitudes', { params })
  return data
}

export async function obtenerSolicitud(id) {
  if (USE_MOCKS) {
    await delay()
    const sol = solicitudesData.find((s) => s.id === id)
    if (!sol) {
      const error = new Error('Solicitud no encontrada')
      error.response = { status: 404, data: { detail: 'Solicitud no encontrada.' } }
      throw error
    }
    return { ...sol }
  }
  const { data } = await api.get(`/solicitudes/${id}`)
  return data
}

export async function crearSolicitud(payload) {
  if (USE_MOCKS) {
    await delay()
    const nueva = {
      id: `sol-${Date.now()}`,
      numero_expediente: `EXP-${new Date().getFullYear()}-${String(solicitudesData.length + 1).padStart(3, '0')}`,
      asesor_id: null,
      solicitante_documento: payload.numero_documento,
      solicitante_nombre: `${payload.nombres} ${payload.apellidos}`.trim(),
      solicitante_telefono: payload.telefono || '',
      monto_solicitado: payload.monto_solicitado,
      monto_aprobado: null,
      plazo_meses: payload.plazo_meses,
      cuota_estimada: payload.cuota_estimada || 0,
      tea_referencial: payload.tea_referencial || 36,
      ingresos_estimados: payload.ingresos_estimados || 0,
      gastos_mensuales: payload.gastos_mensuales || 0,
      score_pre_evaluacion: 0,
      elegibilidad: 'APTO',
      ratio_capacidad_pago: 0,
      riesgo_asignado: 'Bajo',
      motivo_pre_evaluacion: '',
      condicion_adicional: null,
      motivo_rechazo: null,
      estado: 'enviada',
      destino_credito: payload.destino_credito || '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    solicitudesData.unshift(nueva)
    return { ...nueva }
  }
  const { data } = await api.post('/solicitudes', payload)
  return data
}

export async function reclamarSolicitud(id, asesorId) {
  if (USE_MOCKS) {
    await delay()
    const sol = solicitudesData.find((s) => s.id === id)
    if (!sol) throw new Error('Solicitud no encontrada')
    sol.asesor_id = asesorId
    sol.updated_at = new Date().toISOString()
    return { ...sol }
  }
  const { data } = await api.post(`/solicitudes/${id}/reclamar`, { asesor_id: asesorId })
  return data
}

export async function aprobarSolicitud(id) {
  if (USE_MOCKS) {
    await delay()
    const sol = solicitudesData.find((s) => s.id === id)
    if (!sol) throw new Error('Solicitud no encontrada')
    sol.estado = 'aprobada'
    sol.monto_aprobado = sol.monto_solicitado
    sol.updated_at = new Date().toISOString()
    return { ...sol }
  }
  const { data } = await api.post(`/solicitudes/${id}/aprobar`)
  return data
}

export async function condicionarSolicitud(id, payload) {
  if (USE_MOCKS) {
    await delay()
    const sol = solicitudesData.find((s) => s.id === id)
    if (!sol) throw new Error('Solicitud no encontrada')
    sol.estado = 'condicionada'
    sol.monto_aprobado = payload.monto_aprobado
    sol.condicion_adicional = payload.condicion || payload.observacion || ''
    sol.updated_at = new Date().toISOString()
    return { ...sol }
  }
  const { data } = await api.post(`/solicitudes/${id}/condicionar`, {
    monto_aprobado: payload.monto_aprobado,
    condicion: payload.condicion || payload.observacion || '',
  })
  return data
}

export async function rechazarSolicitud(id, payload) {
  if (USE_MOCKS) {
    await delay()
    const sol = solicitudesData.find((s) => s.id === id)
    if (!sol) throw new Error('Solicitud no encontrada')
    sol.estado = 'rechazada'
    sol.motivo_rechazo = payload.motivo || payload.motivo_rechazo || ''
    sol.updated_at = new Date().toISOString()
    return { ...sol }
  }
  const { data } = await api.post(`/solicitudes/${id}/rechazar`, {
    motivo: payload.motivo || payload.motivo_rechazo || '',
  })
  return data
}

export async function desembolsarSolicitud(id) {
  if (USE_MOCKS) {
    await delay()
    const sol = solicitudesData.find((s) => s.id === id)
    if (!sol) throw new Error('Solicitud no encontrada')
    sol.estado = 'desembolsada'
    sol.updated_at = new Date().toISOString()
    return { ...sol }
  }
  const { data } = await api.post(`/solicitudes/${id}/desembolsar`)
  return data
}

export async function listarNotas(solicitudId) {
  if (USE_MOCKS) {
    await delay()
    return []
  }
  const { data } = await api.get(`/solicitudes/${solicitudId}/notas`)
  return data
}

export async function agregarNota(solicitudId, contenido) {
  if (USE_MOCKS) {
    await delay()
    return { id: `nota-${Date.now()}`, solicitud_id: solicitudId, contenido, created_at: new Date().toISOString() }
  }
  const { data } = await api.post(`/solicitudes/${solicitudId}/notas`, { contenido })
  return data
}
