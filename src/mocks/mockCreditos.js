const creditos = [
  {
    id: 'cred-001',
    cliente_id: 'cli-001',
    producto: 'credito_microempresa',
    nombre_producto: 'Crédito Microempresa',
    monto_original: 5000,
    monto_pendiente: 1200,
    cuota_mensual: 450.50,
    proxima_fecha_pago: '2026-07-15',
    tea: 36.0,
    estado: 'vigente',
    activo: true,
    created_at: '2025-06-15T10:00:00Z',
  },
  {
    id: 'cred-002',
    cliente_id: 'cli-001',
    producto: 'credito_microempresa',
    nombre_producto: 'Crédito Microempresa',
    monto_original: 3000,
    monto_pendiente: 0,
    cuota_mensual: 0,
    proxima_fecha_pago: null,
    tea: 32.0,
    estado: 'pagado',
    activo: false,
    created_at: '2024-03-01T10:00:00Z',
  },
  {
    id: 'cred-003',
    cliente_id: 'cli-003',
    producto: 'credito_microempresa',
    nombre_producto: 'Crédito Microempresa',
    monto_original: 8000,
    monto_pendiente: 3200,
    cuota_mensual: 720.00,
    proxima_fecha_pago: '2026-07-28',
    tea: 38.0,
    estado: 'vigente',
    activo: true,
    created_at: '2025-10-20T10:00:00Z',
  },
]

export function creditosPorCliente(clienteId) {
  return creditos.filter((c) => c.cliente_id === clienteId)
}

export function cronogramaPorCredito(creditoId) {
  const credito = creditos.find((c) => c.id === creditoId)
  if (!credito) return []

  const cuotas = []
  const fechaBase = new Date('2026-01-15')
  for (let i = 1; i <= 12; i++) {
    const fecha = new Date(fechaBase)
    fecha.setMonth(fecha.getMonth() + i)
    cuotas.push({
      numero: i,
      fecha_pago: fecha.toISOString().slice(0, 10),
      monto_cuota: credito.cuota_mensual || 450,
      capital: 350 + (i * 2),
      interes: 100 - (i * 2),
      saldo: credito.monto_pendiente - (350 * i),
      estado: i <= 6 ? 'pagada' : 'pendiente',
    })
  }
  return cuotas
}

export default creditos
