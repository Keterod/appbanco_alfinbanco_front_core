/**
 * Contratos de datos para la API FastAPI futura.
 *
 * Define la forma esperada de los objetos que intercambiará el frontend
 * con el backend. Cuando el backend FastAPI esté disponible, los services
 * devolverán objetos con esta misma estructura.
 *
 * Modo mock (VITE_USE_MOCKS=true): los datos en src/mocks/ siguen estos contratos.
 */

/**
 * @typedef {Object} SolicitudCredito
 * @property {string} id
 * @property {string} numero_expediente
 * @property {string|null} asesor_id
 * @property {string} solicitante_documento
 * @property {string} solicitante_nombre
 * @property {string} solicitante_telefono
 * @property {number} monto_solicitado
 * @property {number|null} monto_aprobado
 * @property {number} plazo_meses
 * @property {number} cuota_estimada
 * @property {number} tea_referencial
 * @property {number} ingresos_estimados
 * @property {number} gastos_mensuales
 * @property {number} score_pre_evaluacion
 * @property {'APTO'|'CONDICIONADO'|'NO APTO'} elegibilidad
 * @property {number} ratio_capacidad_pago
 * @property {'Bajo'|'Medio'|'Alto'} riesgo_asignado
 * @property {string} motivo_pre_evaluacion
 * @property {string|null} condicion_adicional
 * @property {string|null} motivo_rechazo
 * @property {'enviada'|'aprobada'|'condicionada'|'rechazada'|'desembolsada'} estado
 * @property {string} created_at
 * @property {string} updated_at
 */
export const SolicitudCredito = {}

/**
 * @typedef {Object} Credito
 * @property {string} id
 * @property {string} cliente_id
 * @property {string} producto
 * @property {string} nombre_producto
 * @property {number} monto_original
 * @property {number} monto_pendiente
 * @property {number} cuota_mensual
 * @property {string|null} proxima_fecha_pago
 * @property {number} tea
 * @property {string} estado
 * @property {boolean} activo
 * @property {string} created_at
 */
export const Credito = {}

/**
 * @typedef {Object} Asesor
 * @property {string} id
 * @property {string} codigo
 * @property {string} nombres
 * @property {string} apellidos
 * @property {string} email
 * @property {string|null} agencia_id
 * @property {string} rol
 */
export const Asesor = {}

/**
 * @typedef {Object} FichaCliente
 * @property {Object} cliente
 * @property {string} cliente.id
 * @property {string} cliente.numero_documento
 * @property {string} cliente.nombres
 * @property {string} cliente.apellidos
 * @property {string} cliente.telefono
 * @property {string} cliente.direccion
 * @property {string} cliente.tipo_negocio
 * @property {string} cliente.nombre_negocio
 * @property {number} cliente.antiguedad_negocio_meses
 * @property {string} cliente.calificacion_sbs
 * @property {Object} posicion
 * @property {number} posicion.deuda_total
 * @property {number} posicion.cuentas_vigentes
 * @property {number} posicion.cuentas_mora
 * @property {number} posicion.dias_mayor_mora
 * @property {Array} historial
 * @property {Object|null} oferta
 * @property {Object|null} indicadores
 */
export const FichaCliente = {}

/**
 * @typedef {Object} DashboardResumen
 * @property {number} visitas_pendientes
 * @property {number} visitas_completadas
 * @property {number} total_cartera
 * @property {number} monto_cartera
 * @property {number} solicitudes_enviadas
 * @property {number} solicitudes_aprobadas
 * @property {number} solicitudes_desembolsadas
 * @property {number} solicitudes_rechazadas
 * @property {number} solicitudes_pendientes
 */
export const DashboardResumen = {}

/**
 * @typedef {Object} LoginResponse
 * @property {string} access_token
 * @property {string} token_type
 * @property {Asesor} asesor
 */
export const LoginResponse = {}
