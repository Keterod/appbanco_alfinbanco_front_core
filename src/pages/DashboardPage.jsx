import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Briefcase, FileText, ShieldCheck, HandCoins, BarChart3, MapPin,
  CheckCircle2, AlertTriangle, TrendingUp, ArrowRight, PlusCircle,
} from 'lucide-react'
import PageHead from '../components/layout/PageHead.jsx'
import Card from '../components/ui/Card.jsx'
import Loader from '../components/ui/Loader.jsx'
import Alert from '../components/ui/Alert.jsx'
import Money from '../components/ui/Money.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { listarCartera, obtenerResumenDashboard } from '../services/carteraService.js'
import { listarSolicitudes } from '../services/solicitudesService.js'
import { extractError } from '../utils/format.js'

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === 'true'

const ACCESOS = [
  { to: '/cartera', icon: Briefcase, color: '#e2132b', t: 'Cartera del día', d: 'Clientes asignados para visitar hoy' },
  { to: '/solicitudes/nueva', icon: PlusCircle, color: '#00a9a5', t: 'Nueva solicitud', d: 'Registrar una solicitud de crédito' },
  { to: '/evaluacion', icon: ShieldCheck, color: '#8e24aa', t: 'Pre-evaluar / Buró', d: 'Capacidad de pago y listas negras' },
  { to: '/cobranza', icon: HandCoins, color: '#f7941e', t: 'Cobranza', d: 'Gestión de mora del día' },
  { to: '/solicitudes', icon: FileText, color: '#e6398b', t: 'Mis solicitudes', d: 'Tablero de estado de expedientes' },
  { to: '/reportes', icon: BarChart3, color: '#4caf50', t: 'Reportes', d: 'Productividad del equipo' },
]

export default function DashboardPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [cartera, setCartera] = useState([])
  const [solicitudes, setSolicitudes] = useState([])
  const [resumen, setResumen] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let alive = true
    const load = async () => {
      try {
        if (USE_MOCKS) {
          const [c, s] = await Promise.allSettled([listarCartera(), listarSolicitudes()])
          if (!alive) return
          if (c.status === 'fulfilled') setCartera(c.value || [])
          if (s.status === 'fulfilled') setSolicitudes(s.value || [])
          if (c.status === 'rejected' && s.status === 'rejected') {
            setError(extractError(c.reason, 'No se pudieron cargar los datos.'))
          }
        } else {
          const [r, c] = await Promise.allSettled([obtenerResumenDashboard(), listarCartera()])
          if (!alive) return
          if (r.status === 'fulfilled') setResumen(r.value || {})
          if (c.status === 'fulfilled') setCartera(c.value || [])
          if (r.status === 'rejected') {
            setError(extractError(r.reason, 'No se pudieron cargar los datos.'))
          }
        }
      } finally {
        if (alive) setLoading(false)
      }
    }
    load()
    return () => { alive = false }
  }, [])

  const pendientes = USE_MOCKS
    ? cartera.filter((c) => c.estado_visita === 'pendiente').length
    : (resumen?.cartera_pendientes ?? 0)
  const visitados = USE_MOCKS
    ? cartera.filter((c) => c.estado_visita && c.estado_visita !== 'pendiente').length
    : (resumen?.cartera_completadas ?? 0)
  const totalCartera = USE_MOCKS ? cartera.length : (resumen?.total_cartera ?? 0)
  const montoCartera = USE_MOCKS
    ? cartera.reduce((acc, c) => acc + (c.monto_credito || 0), 0)
    : (resumen?.monto_cartera ?? 0)
  const aprobadas = USE_MOCKS
    ? solicitudes.filter((s) => ['aprobada', 'desembolsada'].includes(s.estado)).length
    : (resumen?.solicitudes_aprobadas ?? 0) + (resumen?.solicitudes_desembolsadas ?? 0)
  const totalSolicitudes = USE_MOCKS ? solicitudes.length : (resumen?.solicitudes_total ?? 0)

  return (
    <>
      <PageHead
        title={`Hola, ${user?.nombres || 'asesor'}`}
        subtitle="Este es el resumen de tu jornada en campo."
      />

      {error && <Alert tipo="error">{error}</Alert>}

      {loading ? (
        <Loader text="Cargando tu panel…" />
      ) : (
        <>
          <div className="cm-kpis">
            <div className="cm-kpi">
              <span className="cm-kpi-ico" style={{ background: '#fde8eb', color: '#e2132b' }}><MapPin size={24} /></span>
              <div>
                <div className="cm-kpi-label">Visitas pendientes</div>
                <span className="cm-kpi-val">{pendientes}</span>
                <small>de {totalCartera} en cartera</small>
              </div>
            </div>
            <div className="cm-kpi" style={{ borderLeftColor: '#00a9a5' }}>
              <span className="cm-kpi-ico" style={{ background: '#e6f7f6', color: '#00a9a5' }}><CheckCircle2 size={24} /></span>
              <div>
                <div className="cm-kpi-label">Gestionadas hoy</div>
                <span className="cm-kpi-val">{visitados}</span>
                <small>visitas registradas</small>
              </div>
            </div>
            <div className="cm-kpi" style={{ borderLeftColor: '#f7941e' }}>
              <span className="cm-kpi-ico" style={{ background: '#fef3e2', color: '#f7941e' }}><TrendingUp size={24} /></span>
              <div>
                <div className="cm-kpi-label">Monto en cartera</div>
                <span className="cm-kpi-val" style={{ fontSize: 20 }}><Money value={montoCartera} /></span>
                <small>colocación gestionada</small>
              </div>
            </div>
            <div className="cm-kpi" style={{ borderLeftColor: '#8e24aa' }}>
              <span className="cm-kpi-ico" style={{ background: '#f3e6f7', color: '#8e24aa' }}><FileText size={24} /></span>
              <div>
                <div className="cm-kpi-label">Solicitudes aprobadas</div>
                <span className="cm-kpi-val">{aprobadas}</span>
                <small>de {totalSolicitudes} este mes</small>
              </div>
            </div>
          </div>

          <h2 className="cm-section-title">Accesos rápidos</h2>
          <div className="cm-quick-grid">
            {ACCESOS.map((a) => {
              const Icon = a.icon
              return (
                <button key={a.to} className="cm-quick" onClick={() => navigate(a.to)}>
                  <span className="cm-quick-ico" style={{ background: `${a.color}1a`, color: a.color }}>
                    <Icon size={24} />
                  </span>
                  <div style={{ flex: 1 }}>
                    <h3>{a.t}</h3>
                    <p>{a.d}</p>
                  </div>
                  <ArrowRight size={18} color="#9ca3af" />
                </button>
              )
            })}
          </div>

          {pendientes > 0 && cartera.length > 0 && (
            <Card title="Próxima visita prioritaria" icon={AlertTriangle} style={{ marginTop: 22 }}>
              {(() => {
                const top = [...cartera]
                  .filter((c) => c.estado_visita === 'pendiente')
                  .sort((a, b) => (b.score_prioridad || 0) - (a.score_prioridad || 0))[0]
                if (!top) return null
                return (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
                    <div>
                      <strong style={{ fontSize: 16 }}>{top.cliente_nombre}</strong>
                      <div style={{ color: 'var(--hb-muted)', fontSize: 13 }}>
                        DNI {top.documento} · Prioridad {top.prioridad} (score {top.score_prioridad})
                      </div>
                    </div>
                    <button className="hb-btn" onClick={() => navigate('/cartera')}>
                      Ir a la cartera <ArrowRight size={16} />
                    </button>
                  </div>
                )
              })()}
            </Card>
          )}
        </>
      )}
    </>
  )
}
