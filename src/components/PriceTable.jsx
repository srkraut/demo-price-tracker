import { useState } from 'react'
import './PriceTable.css'

const PAGE_SIZE = 20

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T12:00:00')
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

export default function PriceTable({ data }) {
  const [page, setPage] = useState(1)

  // Show newest first
  const reversed = [...data].reverse()
  const totalPages = Math.ceil(reversed.length / PAGE_SIZE)
  const rows = reversed.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <div className="table-card card">
      <h3 className="card-title">Historical Data</h3>

      <div className="table-wrapper">
        <table className="price-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Price (USD/bbl)</th>
              <th>Change</th>
              <th>Change %</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => {
              const globalIdx = (page - 1) * PAGE_SIZE + i
              const nextRow = reversed[globalIdx + 1]
              const change = nextRow ? row.price - nextRow.price : null
              const changePct = nextRow ? (change / nextRow.price) * 100 : null
              const isUp = change !== null ? change >= 0 : null

              return (
                <tr key={row.date}>
                  <td className="td-date">{formatDate(row.date)}</td>
                  <td className="td-price">${row.price.toFixed(2)}</td>
                  <td className={`td-change ${isUp === null ? '' : isUp ? 'up' : 'down'}`}>
                    {change !== null
                      ? `${isUp ? '+' : ''}${change.toFixed(2)}`
                      : '—'}
                  </td>
                  <td className={`td-change ${isUp === null ? '' : isUp ? 'up' : 'down'}`}>
                    {changePct !== null
                      ? `${isUp ? '+' : ''}${changePct.toFixed(2)}%`
                      : '—'}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="page-btn"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            ← Prev
          </button>
          <span className="page-info">
            Page {page} of {totalPages} · {data.length} records
          </span>
          <button
            className="page-btn"
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  )
}
