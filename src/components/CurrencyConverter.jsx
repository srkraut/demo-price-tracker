import { useState } from 'react'
import './CurrencyConverter.css'

export default function CurrencyConverter({ rate }) {
  const [amount, setAmount] = useState('1')
  const [direction, setDirection] = useState('foreign_to_npr') // or 'npr_to_foreign'

  const { currency, buy, sell } = rate
  const unit = currency.unit
  const buyRate = parseFloat(buy) / unit   // NPR per 1 foreign unit
  const sellRate = parseFloat(sell) / unit
  const midRate = (buyRate + sellRate) / 2

  const numAmount = parseFloat(amount) || 0

  let resultBuy, resultSell, resultMid, fromLabel, toLabel

  if (direction === 'foreign_to_npr') {
    resultBuy = (numAmount * buyRate).toFixed(2)
    resultSell = (numAmount * sellRate).toFixed(2)
    resultMid = (numAmount * midRate).toFixed(2)
    fromLabel = currency.iso3
    toLabel = 'NPR'
  } else {
    resultBuy = (numAmount / sellRate).toFixed(4)   // bank sells foreign = you pay NPR
    resultSell = (numAmount / buyRate).toFixed(4)   // bank buys foreign = you get NPR
    resultMid = (numAmount / midRate).toFixed(4)
    fromLabel = 'NPR'
    toLabel = currency.iso3
  }

  return (
    <div className="converter card">
      <div className="card-title">Currency Converter</div>

      <div className="conv-dir-toggle">
        <button
          className={direction === 'foreign_to_npr' ? 'dir-btn active' : 'dir-btn'}
          onClick={() => setDirection('foreign_to_npr')}
        >
          {currency.iso3} → NPR
        </button>
        <button
          className={direction === 'npr_to_foreign' ? 'dir-btn active' : 'dir-btn'}
          onClick={() => setDirection('npr_to_foreign')}
        >
          NPR → {currency.iso3}
        </button>
      </div>

      <div className="conv-input-row">
        <span className="conv-from-label">{fromLabel}</span>
        <input
          type="number"
          min="0"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          className="conv-input"
          placeholder="0"
        />
      </div>

      <div className="conv-results">
        <div className="conv-result-row mid">
          <span className="conv-label">Mid rate</span>
          <span className="conv-value">{toLabel} {Number(resultMid).toLocaleString()}</span>
        </div>
        <div className="conv-result-row buy">
          <span className="conv-label">
            {direction === 'foreign_to_npr' ? 'Bank buys at' : 'Bank sells at'}
          </span>
          <span className="conv-value green">{toLabel} {Number(resultBuy).toLocaleString()}</span>
        </div>
        <div className="conv-result-row sell">
          <span className="conv-label">
            {direction === 'foreign_to_npr' ? 'Bank sells at' : 'Bank buys at'}
          </span>
          <span className="conv-value red">{toLabel} {Number(resultSell).toLocaleString()}</span>
        </div>
      </div>

      <div className="conv-rate-info">
        1 {currency.iso3} = NPR {buyRate.toFixed(4)} (buy) / {sellRate.toFixed(4)} (sell)
      </div>
    </div>
  )
}
