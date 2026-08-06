"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useMotionValue, useMotionTemplate, useScroll, useTransform } from "framer-motion";
import { TrendingDown, Sprout } from "lucide-react";
import { TiltCard } from "@/components/motion/tilt-card";
import { ScoreCircle } from "@/components/ui/score-circle";
import { AnimatedNumber } from "@/components/ui/animated-number";

export function HeroVisual() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const glowX = useTransform(mx, [0, 1], ["0%", "100%"]);
  const glowY = useTransform(my, [0, 1], ["0%", "100%"]);
  const glowBackground = useMotionTemplate`radial-gradient(650px circle at ${glowX} ${glowY}, rgba(16,185,129,0.14), transparent 70%)`;

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const yChip1 = useTransform(scrollYProgress, [0, 1], [0, -70]);
  const yChip2 = useTransform(scrollYProgress, [0, 1], [0, -30]);

  function handleMove(e: React.PointerEvent) {
    const el = sectionRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width);
    my.set((e.clientY - rect.top) / rect.height);
  }

  return (
    <div
      ref={sectionRef}
      onPointerMove={handleMove}
      className="relative mx-auto mt-16 max-w-5xl"
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -inset-24 -z-10"
        style={{ background: glowBackground }}
      />
      <div className="absolute -inset-x-10 -inset-y-6 -z-10 rounded-[3rem] bg-primary/15 blur-[80px]" />

      <TiltCard
        strength={3.5}
        className="relative aspect-[1200/800] w-full overflow-hidden rounded-[2.5rem] shadow-2xl ring-1 ring-border"
      >
        <Image
          src="/illustrations/hero-transform.svg"
          alt="พื้นที่คอนกรีตร้อนเปลี่ยนเป็นสวนสีเขียวด้วย AI"
          fill
          className="object-cover"
          priority
        />
      </TiltCard>

      {/* Floating live-stat chips */}
      <motion.div
        style={{ y: yChip1 }}
        className="absolute -left-6 top-8 hidden md:block"
      >
        <div
          className="glass flex items-center gap-3 rounded-2xl px-4 py-3 shadow-xl"
          style={{ animation: "float 5.5s ease-in-out infinite" }}
        >
          <ScoreCircle score={92} size={46} strokeWidth={5} />
          <div className="text-xs">
            <div className="font-semibold text-foreground">Green Score</div>
            <div className="text-muted-foreground">อัปเดตเรียลไทม์</div>
          </div>
        </div>
      </motion.div>

      <motion.div
        style={{ y: yChip2 }}
        className="absolute -right-6 bottom-10 hidden md:block"
      >
        <div
          className="glass flex items-center gap-3 rounded-2xl px-4 py-3 shadow-xl"
          style={{ animation: "float 6.5s ease-in-out infinite .6s" }}
        >
          <span className="flex size-9 items-center justify-center rounded-xl bg-sky-blue/15 text-sky-blue">
            <TrendingDown className="size-4" />
          </span>
          <div className="text-xs">
            <div className="font-semibold text-foreground">
              -<AnimatedNumber value={42} className="inline" suffix="%" />
            </div>
            <div className="text-muted-foreground">ความร้อนสะสม</div>
          </div>
        </div>
      </motion.div>

      <motion.div
        style={{ y: yChip1 }}
        className="absolute -right-4 top-1/3 hidden lg:block"
      >
        <div
          className="glass flex items-center gap-2 rounded-full px-3.5 py-2 shadow-xl"
          style={{ animation: "float 4.8s ease-in-out infinite 1.1s" }}
        >
          <Sprout className="size-3.5 text-primary" />
          <span className="text-xs font-medium">+<AnimatedNumber value={68} className="inline" suffix="%" /> พื้นที่สีเขียว</span>
        </div>
      </motion.div>
    </div>
  );
}
