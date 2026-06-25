const clientes = [
  {
    id: 'cli-001',
    numero_documento: '12345678',
    nombres: 'Pedro',
    apellidos: 'González Torres',
    telefono: '987654321',
    direccion: 'Av. Los Olivos 456, San Martín',
    tipo_negocio: 'bodega',
    nombre_negocio: 'Bodega Don Pedro',
    antiguedad_negocio_meses: 48,
    calificacion_sbs: 'Normal',
  },
  {
    id: 'cli-002',
    numero_documento: '23456789',
    nombres: 'Rosa',
    apellidos: 'Mamani Condori',
    telefono: '976543210',
    direccion: 'Jr. Las Flores 234, Tarapoto',
    tipo_negocio: 'restaurante',
    nombre_negocio: 'Restaurante Rosa',
    antiguedad_negocio_meses: 24,
    calificacion_sbs: 'CPP',
  },
  {
    id: 'cli-003',
    numero_documento: '34567890',
    nombres: 'Luis',
    apellidos: 'Ramírez Díaz',
    telefono: '965432109',
    direccion: 'Calle Los Pinos 789, Juanjuí',
    tipo_negocio: 'transporte',
    nombre_negocio: 'Transportes Luis',
    antiguedad_negocio_meses: 60,
    calificacion_sbs: 'Normal',
  },
]

export function obtenerCliente(dni) {
  return clientes.find((c) => c.numero_documento === dni) || null
}

export function obtenerClientePorId(id) {
  return clientes.find((c) => c.id === id) || null
}

export function obtenerFichaCompleta(clienteId) {
  const cliente = obtenerClientePorId(clienteId)
  if (!cliente) return null

  return {
    cliente,
    posicion: {
      deuda_total: 8500,
      cuentas_vigentes: 2,
      cuentas_mora: 0,
      dias_mayor_mora: 0,
    },
    historial: [
      {
        producto: 'credito_microempresa',
        monto_desembolsado: 5000,
        plazo_meses: 12,
        tea: 36.0,
        cuotas_pagadas: 10,
        cuotas_total: 12,
        dias_mora: 0,
        estado: 'vigente',
      },
      {
        producto: 'credito_microempresa',
        monto_desembolsado: 3000,
        plazo_meses: 8,
        tea: 32.0,
        cuotas_pagadas: 8,
        cuotas_total: 8,
        dias_mora: 0,
        estado: 'pagado',
      },
    ],
    oferta: {
      monto_maximo: 15000,
      plazo_sugerido_meses: 18,
      tea_referencial: 34.5,
      score_confianza: 82,
      fecha_vencimiento: '2026-08-15',
    },
    indicadores: {
      pct_puntual: 95.0,
      dias_prom_mora: 2,
      monto_pagado: 7200,
    },
  }
}

export default clientes
