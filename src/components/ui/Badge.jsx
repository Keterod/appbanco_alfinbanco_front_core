import { humanizar } from '../../utils/format.js'

export default function Badge({ estado, tone, label }) {
  const text = label ?? humanizar(estado)
  const variant = tone || toneFor(estado)
  return <span className={`hb-badge hb-badge-${variant}`}>{text}</span>
}

function toneFor(estado) {
  const e = String(estado ?? '').toLowerCase()
  if (/(apto|aprobad|desembolsad|normal|activ|vigente|al d[ií]a|pagad|visitad|compromiso|bajo)/.test(e)) return 'green'
  if (/(no apto|rechaz|bloque|perdida|negocio_cerrado|se_niega|castig|inhab|lta)/.test(e)) return 'red'
  if (/(condicionad|enviad|pendiente|proceso|evaluaci|reagendad|cpp|deficiente|dudoso|media|parcial|medio)/.test(e)) return 'amber'
  return 'gray'
}
