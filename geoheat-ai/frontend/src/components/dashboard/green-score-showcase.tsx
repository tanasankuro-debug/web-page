"use client";

import { useState } from "react";
import { ScoreCircle } from "@/components/ui/score-circle";
import { cn } from "@/lib/utils";

export interface GreenSubScore {
  label: string;
  value: number;
  weight: number;
  color: string;
}

export function GreenScoreShowcase({
  score,
  subScores,
  size = 200,
  className,
}: {
  score: number;
  subScores: GreenSubScore[];
  size?: number;
  className?: string;
}) {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div
      className={cn(
        "relative flex flex-col items-center gap-8 sm:flex-row sm:items-center sm:justify-center",
        className,
      )}
    >
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <div
          className="absolute inset-0 -z-10 rounded-full bg-primary/25 blur-3xl"
          style={{ animation: "grid-pulse 3.5s ease-in-out infinite" }}
        />
        <div className="pointer-events-none absolute inset-0">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="absolute top-1/2 left-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary shadow-[0_0_10px_rgba(16,185,129,0.85)]"
              style={
                {
                  "--orbit-radius": `${size / 2 + 10}px`,
                  animation: `orbit ${7 + i * 2.4}s linear infinite`,
                  animationDelay: `${i * -2.3}s`,
                } as React.CSSProperties
              }
            />
          ))}
        </div>
        <ScoreCircle score={score} size={size} strokeWidth={Math.round(size * 0.07)} label="/ 100" />
      </div>

      <div className="flex w-full max-w-xs flex-col gap-3">
        {subScores.map((s, i) => (
          <div
            key={s.label}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            className={cn(
              "transition-opacity duration-200",
              hovered !== null && hovered !== i && "opacity-40",
            )}
          >
            <div className="mb-1.5 flex items-center justify-between text-sm">
              <span className="font-medium">{s.label}</span>
              <span className="text-muted-foreground">
                {s.value}/{s.weight}
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-white/[0.06]">
              <div
                className={cn("h-full rounded-full transition-all duration-700", s.color)}
                style={{ width: `${Math.min(100, (s.value / s.weight) * 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
