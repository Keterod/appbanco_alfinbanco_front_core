import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FileText, PlusCircle, RefreshCw, StickyNote, Send, UserCheck,
  CheckCircle, XCircle, AlertTriangle, DollarSign, ArrowLeft,
} from 'lucide-react'
import PageHead from '../components/layout/PageHead.jsx'
import Loader from '../components/ui/Loader.jsx'
import Alert from '../components/ui/Alert.jsx'
import Badge from '../components/ui/Badge.jsx'
import Money from '../components/ui/Money.jsx'
import Modal from '../components/ui/Modal.jsx'
import Card from '../components/ui/Card.jsx'
import {
  listarSolicitudes, listarNotas, agregarNota,
  reclamarSolicitud, aprobarSolicitud,
  condicionarSolicitud, rechazarSolicitud, desembolsarSolicitud,
} from '../services/solicitudesService.js'
import { useAuth } from '../context/AuthContext.jsx'
import { extractError, formatDate, formatDateTime, humanizar } from '../utils/format.js'

const ELEGIBILIDAD_COLOR = {
  APTO: 'green',
  CONDICIONADO: 'amber',
  'NO APTO': 'red',
}

export default function SolicitudesPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [ok, setOk] = useState(null)

  const [notasDe, setNotasDe] = useState(null)
  const [notas, setNotas] = useState([])
  const [notasLoading, setNotasLoading] = useState(false)
  const [nuevaNota, setNuevaNota] = useState('')
  const [savingNota, setSavingNota] = useState(false)

  const [detalle, setDetalle] = useState(null)
  const [accionLoading, setAccionLoading] = useState(false)

  const [showCondicionar, setShowCondicionar] = useState(false)
  const [condForm, setCondForm] = useState({ monto_aprobado: '', observacion: '' })
  const [condError, setCondError] = useState(null)

  const [showRechazar, setShowRechazar] = useState(false)
  const [rechazoMotivo, setRechazoMotivo] = useState('')
  const [rechazoError, setRechazoError] = useState(null)

  const cargar = useCallback(() => {
    setLoading(true)
    listarSolicitudes()
      .then((data) => setItems(data || []))
      .catch((err) => setError(extractError(err)))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { cargar() }, [cargar])

  const abrirNotas = async (sol) => {
    setNotasDe(sol)
    setNotas([])
    setNuevaNota('')
    setNotasLoading(true)
    try {
      setNotas(await listarNotas(sol.id) || [])
    } catch (err) {
      setError(extractError(err))
    } finally {
      setNotasLoading(false)
    }
  }

  const guardarNota = async () => {
    if (!nuevaNota.trim() || !notasDe) return
    setSavingNota(true)
    try {
      await agregarNota(notasDe.id, nuevaNota.trim())
      setNotas(await listarNotas(notasDe.id) || [])
      setNuevaNota('')
    } catch (err) {
      setError(extractError(err))
    } finally {
      setSavingNota(false)
    }
  }

  const asesorId = user?.id || ''

  const badgeAsesor = (sol) => {
    if (!sol.asesor_id) return <Badge estado="libre" tone="gray" label="Libre" />
    if (sol.asesor_id === asesorId) return <Badge estado="mi_expediente" tone="turq" label="Mi expediente" />
    return <Badge estado="asignada" tone="morado" label="Asignada" />
  }

  const handleReclamar = async (solId) => {
    setError(null)
    setAccionLoading(true)
    try {
      const actualizada = await reclamarSolicitud(solId, asesorId)
      setItems((prev) => prev.map((i) => (i.id === solId ? actualizada : i)))
      if (detalle?.id === solId) setDetalle(actualizada)
      setOk('Solicitud reclamada exitosamente.')
    } catch (err) {
      setError(extractError(err))
    } finally {
      setAccionLoading(false)
    }
  }

  const handleAprobar = async (solId) => {
    setError(null)
    setAccionLoading(true)
    try {
      const actualizada = await aprobarSolicitud(solId)
      setItems((prev) => prev.map((i) => (i.id === solId ? actualizada : i)))
      if (detalle?.id === solId) setDetalle(actualizada)
      setOk('Solicitud aprobada correctamente.')
    } catch (err) {
      setError(extractError(err))
    } finally {
      setAccionLoading(false)
    }
  }

  const openCondicionar = () => {
    setCondForm({ monto_aprobado: '', observacion: '' })
    setCondError(null)
    setShowCondicionar(true)
  }

  const handleCondicionar = async () => {
    const monto = parseFloat(condForm.monto_aprobado)
    if (!monto || monto <= 0) {
      setCondError('El monto aprobado debe ser mayor a 0.')
      return
    }
    if (detalle && monto >= detalle.monto_solicitado) {
      setCondError('El monto aprobado debe ser menor al monto solicitado.')
      return
    }
    if (!condForm.observacion.trim()) {
      setCondError('Debes ingresar una observación.')
      return
    }
    setCondError(null)
    setAccionLoading(true)
    try {
      const actualizada = await condicionarSolicitud(detalle.id, {
        monto_aprobado: monto,
        condicion: condForm.observacion.trim(),
      })
      setItems((prev) => prev.map((i) => (i.id === detalle.id ? actualizada : i)))
      setDetalle(actualizada)
      setShowCondicionar(false)
      setOk('Solicitud condicionada correctamente.')
    } catch (err) {
      setCondError(extractError(err))
    } finally {
      setAccionLoading(false)
    }
  }

  const openRechazar = () => {
    setRechazoMotivo('')
    setRechazoError(null)
    setShowRechazar(true)
  }

  const handleRechazar = async () => {
    if (!rechazoMotivo.trim()) {
      setRechazoError('Debes ingresar el motivo de rechazo.')
      return
    }
    setRechazoError(null)
    setAccionLoading(true)
    try {
      const actualizada = await rechazarSolicitud(detalle.id, { motivo: rechazoMotivo.trim() })
      setItems((prev) => prev.map((i) => (i.id === detalle.id ? actualizada : i)))
      setDetalle(actualizada)
      setShowRechazar(false)
      setOk('Solicitud rechazada.')
    } catch (err) {
      setRechazoError(extractError(err))
    } finally {
      setAccionLoading(false)
    }
  }

  const handleDesembolsar = async (solId) => {
    setError(null)
    setAccionLoading(true)
    try {
      const actualizada = await desembolsarSolicitud(solId)
      setItems((prev) => prev.map((i) => (i.id === solId ? actualizada : i)))
      if (detalle?.id === solId) setDetalle(actualizada)
      setOk('Solicitud desembolsada correctamente.')
    } catch (err) {
      setError(extractError(err))
    } finally {
      setAccionLoading(false)
    }
  }

  const puedeAccionar = (sol) => {
    if (!sol.asesor_id || sol.asesor_id !== asesorId) return false
    return sol.estado === 'enviada' || sol.estado === 'aprobada' || sol.estado === 'condicionada'
  }

  const accionesDisponibles = (sol) => {
    if (!puedeAccionar(sol)) return []
    if (sol.estado === 'enviada') {
      return ['aprobar', 'condicionar', 'rechazar']
    }
    if (sol.estado === 'aprobada') {
      return ['desembolsar']
    }
    return []
  }

  return (
    <>
      <PageHead
        title="Mis solicitudes"
        subtitle="Tablero de estado de tus expedientes de crédito"
        icon={FileText}
        actions={
          <>
            <button className="hb-btn hb-btn-gray hb-btn-sm" onClick={cargar}><RefreshCw size={15} /> Actualizar</button>
            <button className="hb-btn" onClick={() => navigate('/solicitudes/nueva')}><PlusCircle size={16} /> Nueva</button>
          </>
        }
      />

      {error && <Alert tipo="error">{error}</Alert>}
      {ok && <Alert tipo="success">{ok}</Alert>}

      {loading ? (
        <Loader text="Cargando solicitudes…" />
      ) : items.length === 0 ? (
        <div className="hb-card hb-table-empty">
          Aún no has registrado solicitudes este mes.
          <div style={{ marginTop: 14 }}>
            <button className="hb-btn" onClick={() => navigate('/solicitudes/nueva')}><PlusCircle size={16} /> Registrar la primera</button>
          </div>
        </div>
      ) : (
        <div className="hb-card" style={{ padding: 0 }}>
          <div className="hb-table-wrap">
            <table className="hb-table">
              <thead>
                <tr>
                  <th>Expediente</th>
                  <th>Cliente</th>
                  <th className="num">Solicitado</th>
                  <th className="num">Aprobado</th>
                  <th>Estado</th>
                  <th>Asesor</th>
                  <th>Elegibilidad</th>
                  <th>Fecha</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {items.map((s) => (
                  <tr key={s.id}>
                    <td><strong>{s.numero_expediente}</strong></td>
                    <td>{s.solicitante_nombre}</td>
                    <td className="num"><Money value={s.monto_solicitado} /></td>
                    <td className="num">{s.monto_aprobado ? <Money value={s.monto_aprobado} /> : '—'}</td>
                    <td><Badge estado={s.estado} /></td>
                    <td>{badgeAsesor(s)}</td>
                    <td>
                      {s.elegibilidad ? (
                        <Badge estado={s.elegibilidad} tone={ELEGIBILIDAD_COLOR[s.elegibilidad] || 'gray'} label={humanizar(s.elegibilidad)} />
                      ) : '—'}
                    </td>
                    <td>{formatDate(s.created_at)}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button
                          className="hb-btn hb-btn-ghost hb-btn-sm"
                          onClick={() => setDetalle(s)}
                          title="Ver detalle"
                        >
                          <FileText size={14} />
                        </button>
                        <button className="hb-btn hb-btn-ghost hb-btn-sm" onClick={() => abrirNotas(s)}>
                          <StickyNote size={14} />
                        </button>
                        {!s.asesor_id && (
                          <button
                            className="hb-btn hb-btn-sm"
                            onClick={() => handleReclamar(s.id)}
                            disabled={accionLoading}
                            title="Reclamar solicitud"
                          >
                            <UserCheck size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Panel de detalle */}
      {detalle && (
        <Modal
          title={`Detalle · ${detalle.numero_expediente}`}
          icon={FileText}
          onClose={() => setDetalle(null)}
          footer={
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
              {detalle.asesor_id !== asesorId && detalle.asesor_id && (
                <span style={{ color: 'var(--hb-muted)', fontSize: 13, padding: '6px 0' }}>
                  Asignada a otro asesor
                </span>
              )}
              {!detalle.asesor_id && (
                <button className="hb-btn" onClick={() => handleReclamar(detalle.id)} disabled={accionLoading}>
                  <UserCheck size={16} /> Reclamar
                </button>
              )}
              {accionesDisponibles(detalle).includes('aprobar') && (
                <button className="hb-btn hb-btn-turq" onClick={() => handleAprobar(detalle.id)} disabled={accionLoading}>
                  <CheckCircle size={16} /> Aprobar
                </button>
              )}
              {accionesDisponibles(detalle).includes('condicionar') && (
                <button className="hb-btn" style={{ background: 'var(--hb-naranja)' }} onClick={openCondicionar} disabled={accionLoading}>
                  <AlertTriangle size={16} /> Condicionar
                </button>
              )}
              {accionesDisponibles(detalle).includes('rechazar') && (
                <button className="hb-btn" style={{ background: 'var(--hb-red-dark)' }} onClick={openRechazar} disabled={accionLoading}>
                  <XCircle size={16} /> Rechazar
                </button>
              )}
              {accionesDisponibles(detalle).includes('desembolsar') && (
                <button className="hb-btn" style={{ background: 'var(--hb-green)' }} onClick={() => handleDesembolsar(detalle.id)} disabled={accionLoading}>
                  <DollarSign size={16} /> Desembolsar
                </button>
              )}
            </div>
          }
        >
          <div className="hb-grid-2" style={{ marginBottom: 16 }}>
            <div className="hb-field" style={{ marginBottom: 8 }}>
              <label>Cliente</label>
              <div style={{ fontWeight: 600 }}>{detalle.solicitante_nombre}</div>
            </div>
            <div className="hb-field" style={{ marginBottom: 8 }}>
              <label>Documento</label>
              <div>{detalle.solicitante_documento}</div>
            </div>
            <div className="hb-field" style={{ marginBottom: 8 }}>
              <label>Teléfono</label>
              <div>{detalle.solicitante_telefono || '—'}</div>
            </div>
            <div className="hb-field" style={{ marginBottom: 8 }}>
              <label>Estado</label>
              <div><Badge estado={detalle.estado} /></div>
            </div>
          </div>

          <Card title="Preevaluación del crédito" style={{ marginBottom: 16 }}>
            <dl className="cm-dl">
              <div><dt>Score</dt><dd><strong>{detalle.score_pre_evaluacion || '—'}</strong>/100</dd></div>
              <div><dt>Elegibilidad</dt><dd>{detalle.elegibilidad ? <Badge estado={detalle.elegibilidad} tone={ELEGIBILIDAD_COLOR[detalle.elegibilidad] || 'gray'} /> : '—'}</dd></div>
              <div><dt>Riesgo asignado</dt><dd><Badge estado={detalle.riesgo_asignado || '—'} /></dd></div>
              <div><dt>Ratio capacidad de pago</dt><dd>{detalle.ratio_capacidad_pago ? `${detalle.ratio_capacidad_pago.toFixed(2)}` : '—'}</dd></div>
              <div style={{ gridColumn: '1 / -1' }}><dt>Motivo</dt><dd>{detalle.motivo_pre_evaluacion || '—'}</dd></div>
            </dl>
          </Card>

          <Card title="Condiciones del crédito" style={{ marginBottom: 16 }}>
            <dl className="cm-dl">
              <div><dt>Monto solicitado</dt><dd><Money value={detalle.monto_solicitado} /></dd></div>
              <div><dt>Monto aprobado</dt><dd>{detalle.monto_aprobado ? <Money value={detalle.monto_aprobado} /> : '—'}</dd></div>
              <div><dt>Plazo</dt><dd>{detalle.plazo_meses} meses</dd></div>
              <div><dt>Cuota estimada</dt><dd><Money value={detalle.cuota_estimada} /></dd></div>
              <div><dt>TEA</dt><dd>{detalle.tea_referencial}%</dd></div>
              <div><dt>Destino</dt><dd>{detalle.destino_credito || '—'}</dd></div>
            </dl>
            {detalle.condicion_adicional && (
              <div style={{ background: '#fef3e2', border: '1px solid #f6dcae', borderRadius: 10, padding: '10px 14px', marginTop: 12 }}>
                <strong>Condición adicional:</strong> {detalle.condicion_adicional}
              </div>
            )}
            {detalle.motivo_rechazo && (
              <div style={{ background: '#fdeaea', border: '1px solid #f6c5c8', borderRadius: 10, padding: '10px 14px', marginTop: 12 }}>
                <strong>Motivo de rechazo:</strong> {detalle.motivo_rechazo}
              </div>
            )}
          </Card>
        </Modal>
      )}

      {/* Modal condicionar */}
      {showCondicionar && detalle && (
        <Modal
          title="Condicionar solicitud"
          icon={AlertTriangle}
          onClose={() => setShowCondicionar(false)}
          footer={
            <>
              <button className="hb-btn hb-btn-gray" onClick={() => setShowCondicionar(false)}>Cancelar</button>
              <button className="hb-btn" style={{ background: 'var(--hb-naranja)' }} onClick={handleCondicionar} disabled={accionLoading}>
                {accionLoading ? 'Guardando…' : 'Guardar condición'}
              </button>
            </>
          }
        >
          <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
            <div className="hb-card" style={{ flex: 1, textAlign: 'center', padding: 12 }}>
              <div style={{ fontSize: 12, color: 'var(--hb-muted)' }}>Solicitado</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--hb-red)' }}>
                <Money value={detalle.monto_solicitado} />
              </div>
            </div>
            <div className="hb-card" style={{ flex: 1, textAlign: 'center', padding: 12, borderColor: 'var(--hb-naranja)' }}>
              <div style={{ fontSize: 12, color: 'var(--hb-muted)' }}>Recomendado</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--hb-naranja)' }}>
                <Money value={Math.round(detalle.monto_solicitado * 0.7)} />
              </div>
            </div>
          </div>

          {condError && <Alert tipo="error">{condError}</Alert>}

          <div className="hb-field">
            <label>Monto aprobado *</label>
            <input
              className="hb-input"
              inputMode="decimal"
              placeholder="0.00"
              value={condForm.monto_aprobado}
              onChange={(e) => setCondForm((s) => ({ ...s, monto_aprobado: e.target.value }))}
            />
            {detalle && parseFloat(condForm.monto_aprobado) >= detalle.monto_solicitado && (
              <small style={{ color: 'var(--hb-red)' }}>Debe ser menor al monto solicitado</small>
            )}
          </div>
          <div className="hb-field" style={{ marginBottom: 0 }}>
            <label>Observación *</label>
            <textarea
              className="hb-textarea"
              placeholder="Describe la condición para la aprobación…"
              value={condForm.observacion}
              onChange={(e) => setCondForm((s) => ({ ...s, observacion: e.target.value }))}
            />
          </div>
        </Modal>
      )}

      {/* Modal rechazar */}
      {showRechazar && detalle && (
        <Modal
          title="Rechazar solicitud"
          icon={XCircle}
          onClose={() => setShowRechazar(false)}
          footer={
            <>
              <button className="hb-btn hb-btn-gray" onClick={() => setShowRechazar(false)}>Cancelar</button>
              <button className="hb-btn" style={{ background: 'var(--hb-red-dark)' }} onClick={handleRechazar} disabled={accionLoading}>
                {accionLoading ? 'Guardando…' : 'Confirmar rechazo'}
              </button>
            </>
          }
        >
          {rechazoError && <Alert tipo="error">{rechazoError}</Alert>}
          <div className="hb-field" style={{ marginBottom: 0 }}>
            <label>Motivo de rechazo *</label>
            <textarea
              className="hb-textarea"
              placeholder="Indica el motivo por el cual se rechaza la solicitud…"
              value={rechazoMotivo}
              onChange={(e) => setRechazoMotivo(e.target.value)}
            />
          </div>
        </Modal>
      )}

      {/* Notas */}
      {notasDe && (
        <Modal
          title={`Notas · ${notasDe.numero_expediente}`}
          icon={StickyNote}
          onClose={() => setNotasDe(null)}
        >
          {notasLoading ? (
            <Loader text="Cargando notas…" />
          ) : (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16, maxHeight: 240, overflowY: 'auto' }}>
                {notas.length === 0 ? (
                  <p style={{ color: 'var(--hb-muted)', margin: 0, fontSize: 14 }}>Sin notas todavía.</p>
                ) : (
                  notas.map((n, i) => (
                    <div key={i} style={{ background: 'var(--hb-bg)', borderRadius: 10, padding: '10px 12px', border: '1px solid var(--hb-border)' }}>
                      <div style={{ fontSize: 14 }}>{n.contenido}</div>
                      {n.created_at && <small style={{ color: 'var(--hb-muted)' }}>{formatDateTime(n.created_at)}</small>}
                    </div>
                  ))
                )}
              </div>
              <div className="hb-field" style={{ marginBottom: 10 }}>
                <textarea
                  className="hb-textarea"
                  placeholder="Escribe una nota interna…"
                  value={nuevaNota}
                  onChange={(e) => setNuevaNota(e.target.value)}
                />
              </div>
              <button className="hb-btn" onClick={guardarNota} disabled={savingNota || !nuevaNota.trim()}>
                <Send size={15} /> {savingNota ? 'Guardando…' : 'Agregar nota'}
              </button>
            </>
          )}
        </Modal>
      )}
    </>
  )
}
