import { useState } from 'react'
import './ApiKeySetup.css'

export default function ApiKeySetup({ onSave }) {
  const [key, setKey] = useState('')
  const [show, setShow] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    const trimmed = key.trim()
    if (trimmed) onSave(trimmed)
  }

  return (
    <div className="setup-wrapper">
      <div className="setup-card">
        <div className="setup-icon">🛢️</div>
        <h2 className="setup-title">Enter your EIA API Key</h2>
        <p className="setup-desc">
          This app uses the{' '}
          <strong>U.S. Energy Information Administration (EIA)</strong> free API
          to fetch WTI crude oil spot prices. No credit card required.
        </p>

        <div className="setup-steps">
          <div className="step">
            <span className="step-num">1</span>
            <span>
              Register for a free API key at{' '}
              <a
                href="https://www.eia.gov/opendata/register.php"
                target="_blank"
                rel="noopener noreferrer"
              >
                eia.gov/opendata
              </a>
            </span>
          </div>
          <div className="step">
            <span className="step-num">2</span>
            <span>Check your email — key arrives instantly</span>
          </div>
          <div className="step">
            <span className="step-num">3</span>
            <span>Paste it below and click Connect</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="setup-form">
          <div className="input-row">
            <input
              type={show ? 'text' : 'password'}
              value={key}
              onChange={e => setKey(e.target.value)}
              placeholder="Paste your EIA API key here"
              className="key-input"
              autoComplete="off"
              spellCheck={false}
            />
            <button
              type="button"
              className="show-btn"
              onClick={() => setShow(s => !s)}
              title={show ? 'Hide' : 'Show'}
            >
              {show ? '🙈' : '👁️'}
            </button>
          </div>
          <button type="submit" className="connect-btn" disabled={!key.trim()}>
            Connect →
          </button>
        </form>

        <p className="setup-note">
          Your key is stored only in your browser's localStorage and never sent anywhere except to api.eia.gov.
        </p>
      </div>
    </div>
  )
}
