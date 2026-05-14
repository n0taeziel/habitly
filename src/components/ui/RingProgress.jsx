export function RingProgress({ pct = 0, size = 100, stroke = 8, color = 'var(--accent)' }) {
  const r = (size - stroke) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (pct / 100) * circ

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--bg3)" strokeWidth={stroke} />
      <circle
        className="ring-fill"
        cx={size/2} cy={size/2} r={r}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeDasharray={circ}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform={`rotate(-90 ${size/2} ${size/2})`}
      />
      <text
        x={size/2} y={size/2 - 6}
        textAnchor="middle"
        fontFamily="'DM Serif Display',serif"
        fontSize={size * 0.22}
        fill="var(--text)"
      >
        {pct}%
      </text>
      <text
        x={size/2} y={size/2 + size * 0.14}
        textAnchor="middle"
        fontFamily="'DM Sans',sans-serif"
        fontSize={size * 0.1}
        fill="var(--text3)"
      >
        complete
      </text>
    </svg>
  )
}