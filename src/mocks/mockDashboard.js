export const resumenDashboard = {
  solicitudes_total: 14,
  solicitudes_enviadas: 8,
  solicitudes_aprobadas: 4,
  solicitudes_condicionadas: 1,
  solicitudes_rechazadas: 1,
  solicitudes_desembolsadas: 3,
  solicitudes_libres: 2,
  mis_expedientes: 5,
  monto_desembolsado_total: 18000,
  monto_desembolsado_mes: 10000,
  creditos_activos: 12,
  clientes_atendidos: 25,
  cartera_pendientes: 3,
  cartera_completadas: 2,
  total_cartera: 5,
  monto_cartera: 28500,
}

export const carteraEjemplo = [
  {
    id: 'car-001',
    cliente_id: 'cli-001',
    cliente_nombre: 'Pedro González Torres',
    documento: '12345678',
    tipo_gestion: 'visita_cobranza',
    prioridad: 'alta',
    score_prioridad: 85,
    monto_credito: 5000,
    estado_visita: 'pendiente',
  },
  {
    id: 'car-002',
    cliente_id: 'cli-002',
    cliente_nombre: 'Rosa Mamani Condori',
    documento: '23456789',
    tipo_gestion: 'seguimiento',
    prioridad: 'media',
    score_prioridad: 60,
    monto_credito: 3500,
    estado_visita: 'visitado',
  },
  {
    id: 'car-003',
    cliente_id: 'cli-003',
    cliente_nombre: 'Luis Ramírez Díaz',
    documento: '34567890',
    tipo_gestion: 'visita_cobranza',
    prioridad: 'normal',
    score_prioridad: 40,
    monto_credito: 8000,
    estado_visita: 'pendiente',
  },
]

export const moraEjemplo = [
  {
    id: 'mor-001',
    cliente_id: 'cli-001',
    cliente_nombre: 'Pedro González Torres',
    documento: '12345678',
    telefono: '987654321',
    cod_cuenta_credito: 'CR-001',
    dias_mora: 15,
    monto_vencido: 450.50,
  },
  {
    id: 'mor-002',
    cliente_id: 'cli-003',
    cliente_nombre: 'Luis Ramírez Díaz',
    documento: '34567890',
    telefono: '965432109',
    cod_cuenta_credito: 'CR-003',
    dias_mora: 45,
    monto_vencido: 1440.00,
  },
]

export default resumenDashboard
