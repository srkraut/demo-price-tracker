import './CurrentPrice.css'

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T12:00:00')
  return d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
}

export default function CurrentPrice({ data }) {
  const latest = data[data.length - 1]
  const prev = data[data.length - 2]
  if (!latest) return null

  const change = prev ? latest.price - prev.price : 0
  const changePct = prev ? (change / prev.price) * 100 : 0
  const isUp = change >= 0

  return (
    <div className="current-price-card card">
      <div className="cp-left">
        <div className="cp-label card-title">WTI Crude Oil · Current Price</div>
        <div className="cp-price">
          <span className="cp-dollar">$</span>
          <span className="cp-value">{latest.price.toFixed(2)}</span>
          <span className="cp-unit">/ bbl</span>
        </div>
        <div className="cp-date">{formatDate(latest.date)}</div>
      </div>

      <div className="cp-right">
        <div className={`cp-change ${isUp ? 'up' : 'down'}`}>
          <span className="cp-arrow">{isUp ? '▲' : '▼'}</span>
          <span className="cp-change-val">
            {isUp ? '+' : ''}{change.toFixed(2)}
          </span>
          <span className="cp-change-pct">
            ({isUp ? '+' : ''}{changePct.toFixed(2)}%)
          </span>
        </div>
        <div className="cp-vs">vs previous close</div>
      </div>
    </div>
  )
}
