export function AmbientBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-background">
      {/* Aurora field — several independently-drifting blurred blobs */}
      <div
        className="absolute -top-32 left-[8%] size-[620px] rounded-full bg-aura-primary/20 blur-[130px] will-change-transform"
        style={{ animation: "aurora-drift-1 26s ease-in-out infinite" }}
      />
      <div
        className="absolute top-[15%] -right-40 size-[560px] rounded-full bg-aura-sky/14 blur-[130px] will-change-transform"
        style={{ animation: "aurora-drift-2 32s ease-in-out infinite" }}
      />
      <div
        className="absolute bottom-[-10%] left-[28%] size-[520px] rounded-full bg-aura-heat/10 blur-[140px] will-change-transform"
        style={{ animation: "aurora-drift-3 38s ease-in-out infinite" }}
      />
      <div
        className="absolute bottom-[5%] right-[10%] size-[420px] rounded-full bg-aura-primary/12 blur-[120px] will-change-transform"
        style={{ animation: "aurora-drift-2 22s ease-in-out infinite 3s" }}
      />

      {/* Subtle grid, faded toward the top */}
      <div className="bg-grid absolute inset-0 opacity-50 [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,black,transparent)]" />

      {/* Fine grain / noise, screen-blended so it stays extremely subtle */}
      <svg className="absolute inset-0 size-full opacity-[0.035] mix-blend-overlay" aria-hidden="true">
        <filter id="hskk-noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#hskk-noise)" />
      </svg>
    </div>
  );
}
