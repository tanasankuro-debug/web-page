"use client";

import { Sparkles, Leaf, MousePointerClick } from "lucide-react";
import { BeforeAfterSlider } from "@/components/ui/before-after-slider";
import { cn } from "@/lib/utils";

export function PremiumSliderFrame({
  beforeSrc,
  afterSrc,
  beforeAlt,
  afterAlt,
  afterLabel,
  showHint = true,
  className,
}: {
  beforeSrc: string;
  afterSrc: string;
  beforeAlt: string;
  afterAlt: string;
  afterLabel?: string;
  showHint?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("relative", className)}>
      <div className="pointer-events-none absolute -inset-x-10 -inset-y-8 -z-10">
        <div className="absolute left-0 top-1/2 size-56 -translate-y-1/2 rounded-full bg-heat-orange/20 blur-[100px]" />
        <div className="absolute right-0 top-1/2 size-64 -translate-y-1/2 rounded-full bg-primary/30 blur-[100px]" />
      </div>

      <Sparkles
        className="pointer-events-none absolute -left-4 -top-5 size-6 text-primary/70 drop-shadow-[0_0_10px_rgba(16,185,129,0.6)]"
        style={{ animation: "float 4s ease-in-out infinite" }}
      />
      <Leaf
        className="pointer-events-none absolute -right-5 top-1/4 size-8 text-primary/60 drop-shadow-[0_0_12px_rgba(16,185,129,0.5)]"
        style={{ animation: "float 5.5s ease-in-out infinite .4s" }}
      />

      {showHint && (
        <div className="absolute left-1/2 -top-4 z-10 flex -translate-x-1/2 animate-bounce items-center gap-1.5 whitespace-nowrap rounded-full bg-background px-3.5 py-1.5 text-xs font-semibold shadow-[0_4px_20px_-4px_rgba(16,185,129,0.4)] ring-1 ring-primary/30">
          <MousePointerClick className="size-3.5 text-primary" />
          ลากเพื่อเปรียบเทียบ
        </div>
      )}

      <div className="rounded-[2rem] bg-gradient-to-br from-heat-orange/60 via-primary/35 to-primary/70 p-[2.5px] shadow-2xl">
        <div className="overflow-hidden rounded-[calc(2rem-2.5px)] bg-background">
          <BeforeAfterSlider
            beforeSrc={beforeSrc}
            afterSrc={afterSrc}
            beforeAlt={beforeAlt}
            afterAlt={afterAlt}
            afterLabel={afterLabel}
          />
        </div>
      </div>
    </div>
  );
}
