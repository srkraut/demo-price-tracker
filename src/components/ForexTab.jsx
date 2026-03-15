import { useState, useEffect, useCallback } from 'react'
import CurrencyConverter from './CurrencyConverter'
import ForexChart from './ForexChart'
import './ForexTab.css'

const NRB_BASE = 'https://www.nrb.org.np/api/forex/v1/rates'

function today() {
  return new Date().toISOString().slice(0, 10)
}

function daysAgo(n) {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString().slice(0, 10)
}

// Currency flag emoji from ISO3 code
const FLAG = {
  USD: '🇺🇸', EUR: '🇪🇺', GBP: '🇬🇧', CHF: '🇨🇭', AUD: '🇦🇺',
  CAD: '🇨🇦', SGD: '🇸🇬', JPY: '🇯🇵', CNY: '🇨🇳', SEK: '🇸🇪',
  DKK: '🇩🇰', HKD: '🇭🇰', KWD: '🇰🇼', SAR: '🇸🇦', AED: '🇦🇪',
  MYR: '🇲🇾', INR: '🇮🇳', QAR: '🇶🇦', THB: '🇹🇭', PKR: '🇵🇰',
  SEK2: '🇸🇪', NOK: '🇳🇴',
}

function getFlag(iso3) {
  return FLAG[iso3] || '🏳️'
}

export default function ForexTab() {
  const [rates, setRates] = useState([])           // today's rates array
  const [publishedDate, setPublishedDate] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)   // selected currency object
  const [history, setHistory] = useState([])        // 90-day history for selected
  const [historyLoading, setHistoryLoading] = useState(false)

  // Fetch today's rates (look back 7 days to handle weekends/holidays)
  const fetchRates = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const url = `${NRB_BASE}?per_page=1&from=${daysAgo(7)}&to=${today()}`
      const res = await fetch(url)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const json = await res.json()
      const payload = json?.data?.payload
      if (!payload?.length) throw new Error('No data from NRB API')
      const latest = payload[0]
      setPublishedDate(latest.date)
      setRates(latest.rates || [])
      // default select USD
      const usd = latest.rates?.find(r => r.currency.iso3 === 'USD')
      if (usd) setSelected(usd)
    } catch (err) {
      setError(err.message || 'Failed to fetch NRB rates')
    } finally {
      setLoading(false)
    }
  }, [])

  // Fetch 90-day history for selected currency
  const fetchHistory = useCallback(async (iso3) => {
    setHistoryLoading(true)
    try {
      const url = `${NRB_BASE}?per_page=90&from=${daysAgo(90)}&to=${today()}`
      const res = await fetch(url)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const json = await res.json()
      const payload = json?.data?.payload || []
      const points = payload
        .map(day => {
          const r = day.rates.find(x => x.currency.iso3 === iso3)
          if (!r) return null
          const mid = (parseFloat(r.buy) + parseFloat(r.sell)) / 2 / r.currency.unit
          return { date: day.date, buy: parseFloat(r.buy) / r.currency.unit, sell: parseFloat(r.sell) / r.currency.unit, mid }
        })
        .filter(Boolean)
        .reverse() // oldest first
      setHistory(points)
    } catch {
      setHistory([])
    } finally {
      setHistoryLoading(false)
    }
  }, [])

  useEffect(() => { fetchRates() }, [fetchRates])

  useEffect(() => {
    if (selected) fetchHistory(selected.currency.iso3)
  }, [selected, fetchHistory])

  const filtered = rates.filter(r =>
    r.currency.name.toLowerCase().includes(search.toLowerCase()) ||
    r.currency.iso3.toLowerCase().includes(search.toLowerCase())
  )

  // Key currencies to show in the summary strip
  const KEY_CURRENCIES = ['USD', 'EUR', 'GBP', 'INR', 'CNY', 'AUD']
  const keyRates = KEY_CURRENCIES.map(iso3 => rates.find(r => r.currency.iso3 === iso3)).filter(Boolean)

  return (
    <div className="forex-tab">

      {/* Summary strip */}
      {!loading && !error && keyRates.length > 0 && (
        <div className="forex-strip">
          {keyRates.map(r => {
            const mid = (parseFloat(r.buy) + parseFloat(r.sell)) / 2 / r.currency.unit
            return (
              <button
                key={r.currency.iso3}
                className={`strip-item ${selected?.currency.iso3 === r.currency.iso3 ? 'active' : ''}`}
                onClick={() => setSelected(r)}
              >
                <span className="strip-flag">{getFlag(r.currency.iso3)}</span>
                <span className="strip-code">{r.currency.iso3}</span>
                <span className="strip-mid">NPR {mid.toFixed(2)}</span>
              </button>
            )
          })}
        </div>
      )}

      {loading && (
        <div className="loading-overlay">
          <div className="spinner" />
          <span>Fetching NRB rates…</span>
        </div>
      )}

      {error && (
        <div className="error-banner">
          <strong>Error:</strong> {error}
          <button onClick={fetchRates} className="retry-btn">Retry</button>
        </div>
      )}

      {!loading && !error && rates.length > 0 && (
        <div className="forex-body">
          {/* Left: rates table */}
          <div className="forex-left">
            <div className="card rates-card">
              <div className="rates-header">
                <div>
                  <div className="card-title" style={{ marginBottom: 4 }}>Exchange Rates · NPR</div>
                  <div className="rates-date">Published: {publishedDate}</div>
                </div>
                <input
                  className="forex-search"
                  type="text"
                  placeholder="Search currency…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>

              <div className="rates-table-wrap">
                <table className="rates-table">
                  <thead>
                    <tr>
                      <th>Currency</th>
                      <th>Unit</th>
                      <th>Buy (NPR)</th>
                      <th>Sell (NPR)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(r => {
                      const isActive = selected?.currency.iso3 === r.currency.iso3
                      return (
                        <tr
                          key={r.currency.iso3}
                          className={isActive ? 'row-active' : ''}
                          onClick={() => setSelected(r)}
                        >
                          <td className="td-currency">
                            <span className="curr-flag">{getFlag(r.currency.iso3)}</span>
                            <div>
                              <div className="curr-code">{r.currency.iso3}</div>
                              <div className="curr-name">{r.currency.name}</div>
                            </div>
                          </td>
                          <td className="td-unit">{r.currency.unit}</td>
                          <td className="td-buy">{r.buy || '—'}</td>
                          <td className="td-sell">{r.sell || '—'}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
                {filtered.length === 0 && (
                  <div className="no-results">No currencies match "{search}"</div>
                )}
              </div>
            </div>
          </div>

          {/* Right: converter + chart */}
          {selected && (
            <div className="forex-right">
              <CurrencyConverter rate={selected} />
              <ForexChart
                currency={selected.currency}
                history={history}
                loading={historyLoading}
              />
            </div>
          )}
        </div>
      )}
    </div>
  )
}
