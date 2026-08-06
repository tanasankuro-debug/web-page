"use client";

import { motion } from "framer-motion";
import { Leaf, Sparkles, MousePointerClick } from "lucide-react";
import { BeforeAfterSlider } from "@/components/ui/before-after-slider";

export function GardenShowcase() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.94 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="relative mx-auto mt-16 max-w-4xl"
    >
      {/* dual-tone ambient glow — heat orange fading into green */}
      <div className="pointer-events-none absolute -inset-x-16 -inset-y-14 -z-10">
        <div className="absolute left-0 top-1/2 size-72 -translate-y-1/2 rounded-full bg-heat-orange/25 blur-[110px]" />
        <div className="absolute right-0 top-1/2 size-80 -translate-y-1/2 rounded-full bg-primary/35 blur-[110px]" />
      </div>

      {/* floating decorative icons */}
      <Sparkles
        className="pointer-events-none absolute -left-5 -top-7 size-8 text-primary/70 drop-shadow-[0_0_10px_rgba(16,185,129,0.6)]"
        style={{ animation: "float 4s ease-in-out infinite" }}
      />
      <Leaf
        className="pointer-events-none absolute -right-6 top-1/4 size-11 text-primary/60 drop-shadow-[0_0_12px_rgba(16,185,129,0.5)]"
        style={{ animation: "float 5.5s ease-in-out infinite .4s" }}
      />
      <Sparkles
        className="pointer-events-none absolute -bottom-7 left-1/4 size-6 text-heat-orange/70 drop-shadow-[0_0_10px_rgba(255,107,53,0.5)]"
        style={{ animation: "float 4.5s ease-in-out infinite 1s" }}
      />
      <Leaf
        className="pointer-events-none absolute -bottom-5 right-1/5 size-7 rotate-45 text-primary/50"
        style={{ animation: "float 6s ease-in-out infinite .8s" }}
      />

      {/* drag-me hint, floating above the frame */}
      <motion.div
        initial={{ opacity: 0, y: -14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="absolute left-1/2 -top-5 z-20 flex -translate-x-1/2 animate-bounce items-center gap-1.5 whitespace-nowrap rounded-full bg-background px-4 py-1.5 text-xs font-semibold shadow-[0_4px_20px_-4px_rgba(16,185,129,0.4)] ring-1 ring-primary/30"
      >
        <MousePointerClick className="size-3.5 text-primary" />
        ลากเพื่อเปรียบเทียบก่อน-หลัง
      </motion.div>

      {/* gradient frame + slider */}
      <div className="rounded-[2.5rem] bg-gradient-to-br from-heat-orange/70 via-primary/40 to-primary/80 p-[3px] shadow-2xl">
        <div className="overflow-hidden rounded-[calc(2.5rem-3px)] bg-background">
          <BeforeAfterSlider
            beforeSrc="/illustrations/before-backyard.svg"
            afterSrc="/illustrations/after-tropical.svg"
            beforeAlt="ก่อนออกแบบสวน"
            afterAlt="หลังออกแบบสวน สไตล์ Tropical"
            className="aspect-video rounded-[calc(2.5rem-3px)] md:aspect-[21/9]"
          />
        </div>
      </div>
    </motion.div>
  );
}
