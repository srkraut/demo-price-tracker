import './Header.css'

export default function Header({ onClearKey }) {
  return (
    <header className="header">
      <div className="header-inner">
        <div className="header-brand">
          <span className="header-icon">🛢️</span>
          <div>
            <h1 className="header-title">Crude Oil Price Tracker</h1>
            <p className="header-subtitle">WTI Spot Price · Powered by EIA Open Data</p>
          </div>
        </div>
        {onClearKey && (
          <button className="clear-key-btn" onClick={onClearKey} title="Remove API key">
            Change API Key
          </button>
        )}
      </div>
    </header>
  )
}
