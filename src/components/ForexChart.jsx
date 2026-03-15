import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import './ForexChart.css'

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T12:00:00')
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  const d = new Date(label + 'T12:00:00')
  return (
    <div className="forex-tooltip">
      <div className="ftt-date">{d.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</div>
      {payload.map(p => (
        <div key={p.dataKey} className="ftt-row" style={{ color: p.color }}>
          <span>{p.name}</span>
          <span>NPR {p.value?.toFixed(4)}</span>
        </div>
      ))}
    </div>
  )
}

export default function ForexChart({ currency, history, loading }) {
  if (loading) {
    return (
      <div className="forex-chart-card card">
        <div className="loading-overlay" style={{ padding: '40px 0' }}>
          <div className="spinner" />
          <span>Loading history…</span>
        </div>
      </div>
    )
  }

  if (!history.length) return null

  const prices = history.map(d => d.mid)
  const minP = Math.min(...prices)
  const maxP = Math.max(...prices)
  const pad = (maxP - minP) * 0.1 || 0.01
  const yMin = Math.max(0, minP - pad)
  const yMax = maxP + pad

  const tickInterval = Math.max(1, Math.floor(history.length / 6))

  return (
    <div className="forex-chart-card card">
      <div className="card-title">
        {currency.iso3} / NPR — Last 90 Days
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={history} margin={{ top: 4, right: 4, left: -8, bottom: 0 }}>
          <defs>
            <linearGradient id="buyGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="sellGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e2d42" vertical={false} />
          <XAxis
            dataKey="date"
            tickFormatter={formatDate}
            interval={tickInterval}
            tick={{ fill: '#64748b', fontSize: 10 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            domain={[yMin, yMax]}
            tickFormatter={v => v.toFixed(2)}
            tick={{ fill: '#64748b', fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            width={52}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: '0.75rem', paddingTop: 8 }}
          />
          <Area
            type="monotone"
            dataKey="buy"
            name="Buy"
            stroke="#10b981"
            strokeWidth={1.5}
            fill="url(#buyGrad)"
            dot={false}
            activeDot={{ r: 3 }}
          />
          <Area
            type="monotone"
            dataKey="sell"
            name="Sell"
            stroke="#ef4444"
            strokeWidth={1.5}
            fill="url(#sellGrad)"
            dot={false}
            activeDot={{ r: 3 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
