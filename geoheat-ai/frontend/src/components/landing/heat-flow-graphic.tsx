export function HeatFlowGraphic({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1200 640"
      fill="none"
      className={className}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="hf-glow-1" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="hf-glow-2" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ef4444" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="hf-line" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#f59e0b" stopOpacity="0" />
          <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Hot-spot glows, slow pulse */}
      <circle cx="880" cy="220" r="220" fill="url(#hf-glow-1)" style={{ animation: "grid-pulse 5s ease-in-out infinite" }} />
      <circle cx="300" cy="420" r="180" fill="url(#hf-glow-2)" style={{ animation: "grid-pulse 6.5s ease-in-out infinite 1s" }} />

      {/* Flowing heat lines */}
      {[
        "M0,140 C 250,80 450,220 700,150 S 1050,60 1200,140",
        "M0,260 C 260,320 470,180 720,260 S 1040,340 1200,260",
        "M0,400 C 240,440 480,340 730,400 S 1030,460 1200,400",
        "M0,500 C 300,540 500,460 760,500 S 1020,540 1200,500",
      ].map((d, i) => (
        <path
          key={d}
          d={d}
          stroke="url(#hf-line)"
          strokeWidth={2}
          strokeDasharray="14 10"
          style={{ animation: `dash-flow ${3 + i}s linear infinite` }}
        />
      ))}

      {/* Drifting particles */}
      {[
        { cx: 220, cy: 150, r: 3 },
        { cx: 560, cy: 260, r: 2.5 },
        { cx: 840, cy: 180, r: 3.5 },
        { cx: 980, cy: 380, r: 2.5 },
        { cx: 400, cy: 460, r: 3 },
      ].map((p, i) => (
        <circle
          key={i}
          cx={p.cx}
          cy={p.cy}
          r={p.r}
          fill="#fdba74"
          style={{ animation: `float ${4 + i * 0.8}s ease-in-out infinite ${i * 0.4}s` }}
        />
      ))}
    </svg>
  );
}
