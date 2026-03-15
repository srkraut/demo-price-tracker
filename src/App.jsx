import { useState, useEffect, useCallback } from 'react'
import Header from './components/Header'
import ApiKeySetup from './components/ApiKeySetup'
import CurrentPrice from './components/CurrentPrice'
import PriceChart from './components/PriceChart'
import PriceTable from './components/PriceTable'
import StatsBar from './components/StatsBar'
import ForexTab from './components/ForexTab'
import './App.css'

const STORAGE_KEY = 'eia_api_key'

function buildUrl(apiKey, length = 365) {
  const params = new URLSearchParams({
    api_key: apiKey,
    frequency: 'daily',
    'data[0]': 'value',
    'facets[series][]': 'RWTC',
    'sort[0][column]': 'period',
    'sort[0][direction]': 'desc',
    length: String(length),
  })
  return `https://api.eia.gov/v2/petroleum/pri/spt/data/?${params}`
}

const TABS = [
  { id: 'oil', label: '🛢️ Crude Oil', sub: 'WTI Spot Price · EIA' },
  { id: 'forex', label: '💱 NRB Forex', sub: 'Exchange Rates · Nepal Rastra Bank' },
]

export default function App() {
  const [activeTab, setActiveTab] = useState('oil')
  const [apiKey, setApiKey] = useState(() => localStorage.getItem(STORAGE_KEY) || '')
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [range, setRange] = useState(90)

  const fetchPrices = useCallback(async (key) => {
    if (!key) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch(buildUrl(key, 365))
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const json = await res.json()
      if (json.response?.error) throw new Error(json.response.error)
      const rows = (json.response?.data || [])
        .filter(d => d.value !== null)
        .map(d => ({ date: d.period, price: parseFloat(d.value) }))
        .reverse()
      if (rows.length === 0) throw new Error('No data returned. Check your API key.')
      setData(rows)
    } catch (err) {
      setError(err.message || 'Failed to fetch data')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (apiKey) fetchPrices(apiKey)
  }, [apiKey, fetchPrices])

  function handleSaveKey(key) {
    localStorage.setItem(STORAGE_KEY, key)
    setApiKey(key)
  }

  function handleClearKey() {
    localStorage.removeItem(STORAGE_KEY)
    setApiKey('')
    setData([])
    setError('')
  }

  const visibleData = data.slice(-range)

  return (
    <div className="app">
      <Header onClearKey={activeTab === 'oil' && apiKey ? handleClearKey : undefined} />

      {/* Tab navigation */}
      <div className="tab-nav">
        <div className="tab-nav-inner">
          {TABS.map(tab => (
            <button
              key={tab.id}
              className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="tab-label">{tab.label}</span>
              <span className="tab-sub">{tab.sub}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      {activeTab === 'oil' && (
        !apiKey ? (
          <div className="main"><ApiKeySetup onSave={handleSaveKey} /></div>
        ) : (
          <main className="main">
            {loading && (
              <div className="loading-overlay">
                <div className="spinner" />
                <span>Fetching EIA data…</span>
              </div>
            )}
            {error && (
              <div className="error-banner">
                <strong>Error:</strong> {error}
                <button onClick={() => fetchPrices(apiKey)} className="retry-btn">Retry</button>
              </div>
            )}
            {!loading && !error && data.length > 0 && (
              <>
                <CurrentPrice data={data} />
                <StatsBar data={data} range={range} />
                <PriceChart data={visibleData} range={range} onRangeChange={setRange} />
                <PriceTable data={data} />
              </>
            )}
          </main>
        )
      )}

      {activeTab === 'forex' && (
        <main className="main">
          <ForexTab />
        </main>
      )}
    </div>
  )
}
