import './StatsBar.css'

export default function StatsBar({ data, range }) {
  if (!data.length) return null

  const slice = data.slice(-range)
  const prices = slice.map(d => d.price)
  const high = Math.max(...prices)
  const low = Math.min(...prices)
  const avg = prices.reduce((a, b) => a + b, 0) / prices.length
  const first = slice[0]?.price ?? 0
  const last = slice[slice.length - 1]?.price ?? 0
  const periodChange = last - first
  const periodChangePct = first ? (periodChange / first) * 100 : 0

  const stats = [
    { label: `${range}d High`, value: `$${high.toFixed(2)}`, color: 'var(--green)' },
    { label: `${range}d Low`, value: `$${low.toFixed(2)}`, color: 'var(--red)' },
    { label: `${range}d Avg`, value: `$${avg.toFixed(2)}`, color: 'var(--text-primary)' },
    {
      label: `${range}d Change`,
      value: `${periodChange >= 0 ? '+' : ''}${periodChangePct.toFixed(1)}%`,
      color: periodChange >= 0 ? 'var(--green)' : 'var(--red)',
    },
  ]

  return (
    <div className="stats-bar">
      {stats.map(s => (
        <div key={s.label} className="stat-item card">
          <div className="stat-label">{s.label}</div>
          <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
        </div>
      ))}
    </div>
  )
}
