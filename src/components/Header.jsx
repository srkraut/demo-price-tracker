import './Header.css'

export default function Header({ onClearKey, theme, onToggleTheme }) {
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

        <div className="header-actions">
          {onClearKey && (
            <button className="clear-key-btn" onClick={onClearKey} title="Remove API key">
              Change API Key
            </button>
          )}

          <button
            className="theme-toggle"
            onClick={onToggleTheme}
            title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
            aria-label="Toggle theme"
          >
            <span className="theme-toggle-track">
              <span className="theme-toggle-thumb" />
            </span>
            <span className="theme-toggle-icon">
              {theme === 'light' ? '🌙' : '☀️'}
            </span>
          </button>
        </div>
      </div>
    </header>
  )
}
