import api from './api.js'

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === 'true'

function delay(ms = 400) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function productividad() {
  if (USE_MOCKS) {
    await delay()
    return [
      {
        asesor_nombre: 'Carlos Quispe Huamán',
        enviadas: 12,
        aprobadas: 7,
        desembolsadas: 5,
        monto_total: 45000,
        tasa_aprobacion: 58.3,
      },
      {
        asesor_nombre: 'María López García',
        enviadas: 8,
        aprobadas: 5,
        desembolsadas: 4,
        monto_total: 32000,
        tasa_aprobacion: 62.5,
      },
      {
        asesor_nombre: 'Juan Paredes Soto',
        enviadas: 15,
        aprobadas: 10,
        desembolsadas: 8,
        monto_total: 78000,
        tasa_aprobacion: 66.7,
      },
    ]
  }

  const { data } = await api.get('/reportes/productividad')
  return data
}
