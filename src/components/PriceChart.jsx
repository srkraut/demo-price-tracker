import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts'
import './PriceChart.css'

const RANGES = [
  { label: '1M', days: 30 },
  { label: '3M', days: 90 },
  { label: '6M', days: 180 },
  { label: '1Y', days: 365 },
]

function formatXAxis(dateStr, totalPoints) {
  const d = new Date(dateStr + 'T12:00:00')
  if (totalPoints > 180) return d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const { date, price } = payload[0].payload
  const d = new Date(date + 'T12:00:00')
  return (
    <div className="chart-tooltip">
      <div className="tt-date">{d.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</div>
      <div className="tt-price">${price.toFixed(2)} <span>/bbl</span></div>
    </div>
  )
}

export default function PriceChart({ data, range, onRangeChange }) {
  const prices = data.map(d => d.price)
  const minPrice = Math.min(...prices)
  const maxPrice = Math.max(...prices)
  const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length

  const yMin = Math.floor((minPrice - 2) / 5) * 5
  const yMax = Math.ceil((maxPrice + 2) / 5) * 5

  const isUp = data.length >= 2
    ? data[data.length - 1].price >= data[0].price
    : true

  const color = isUp ? '#10b981' : '#ef4444'

  // Thin out ticks to avoid overcrowding
  const tickInterval = data.length > 180 ? 30 : data.length > 60 ? 14 : 7

  return (
    <div className="chart-card card">
      <div className="chart-header">
        <h3 className="card-title" style={{ marginBottom: 0 }}>Price History (WTI $/bbl)</h3>
        <div className="range-btns">
          {RANGES.map(r => (
            <button
              key={r.label}
              className={`range-btn ${range === r.days ? 'active' : ''}`}
              onClick={() => onRangeChange(r.days)}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={340}>
        <AreaChart data={data} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
          <defs>
            <linearGradient id="priceGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.25} />
              <stop offset="95%" stopColor={color} stopOpacity={0.01} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e2d42" vertical={false} />
          <XAxis
            dataKey="date"
            tickFormatter={v => formatXAxis(v, data.length)}
            interval={tickInterval}
            tick={{ fill: '#64748b', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            domain={[yMin, yMax]}
            tickFormatter={v => `$${v}`}
            tick={{ fill: '#64748b', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={56}
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine
            y={avgPrice}
            stroke="#f59e0b"
            strokeDasharray="4 4"
            strokeOpacity={0.6}
            label={{ value: `Avg $${avgPrice.toFixed(1)}`, fill: '#f59e0b', fontSize: 10, position: 'insideTopRight' }}
          />
          <Area
            type="monotone"
            dataKey="price"
            stroke={color}
            strokeWidth={2}
            fill="url(#priceGrad)"
            dot={false}
            activeDot={{ r: 4, fill: color, strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
