import api from './api.js'

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === 'true'

function delay(ms = 400) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function preEvaluar(payload) {
  if (USE_MOCKS) {
    await delay()
    const ingresos = payload.ingresos_estimados || 0
    const monto = payload.monto_solicitado || 0
    const ratio = ingresos > 0 ? (ingresos - (ingresos * 0.3)) / (monto / 12 + 100) : 0

    if (ratio >= 1.5) {
      return {
        calificacion: 'APTO',
        puntaje: Math.min(95, Math.round(60 + ratio * 15)),
        motivo: 'Cliente cuenta con capacidad de pago suficiente para el crédito solicitado.',
        ratio_capacidad_pago: Number(ratio.toFixed(2)),
      }
    }
    if (ratio >= 1.0) {
      return {
        calificacion: 'CONDICIONADO',
        puntaje: Math.min(70, Math.round(40 + ratio * 20)),
        motivo: 'Capacidad de pago ajustada. Se recomienda reducir el monto o ampliar el plazo.',
        ratio_capacidad_pago: Number(ratio.toFixed(2)),
      }
    }
    return {
      calificacion: 'NO APTO',
      puntaje: Math.max(20, Math.round(ratio * 30)),
      motivo: 'Capacidad de pago insuficiente para el monto y plazo solicitados.',
      ratio_capacidad_pago: Number(ratio.toFixed(2)),
    }
  }

  const { data } = await api.post('/pre-evaluar', payload)
  return data
}

export async function consultarBuro(payload) {
  if (USE_MOCKS) {
    await delay()
    return {
      dni: payload.dni,
      en_lista_negra: false,
      motivo_bloqueo: null,
      calificacion_sbs: 'Normal',
      interpretacion: 'El cliente no presenta problemas crediticios en el sistema financiero.',
      entidades_con_deuda: 2,
      deuda_total: 8500,
      mayor_deuda: 5000,
      dias_mayor_mora: 0,
    }
  }

  const { data } = await api.post('/buro/consulta', payload)
  return data
}
