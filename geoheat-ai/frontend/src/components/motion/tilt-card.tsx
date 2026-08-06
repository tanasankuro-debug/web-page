"use client";

import { useRef, useState, type ReactNode } from "react";
import { motion, useMotionValue, useMotionTemplate, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

export function TiltCard({
  children,
  className,
  glow = true,
  strength = 7,
}: {
  children: ReactNode;
  className?: string;
  glow?: boolean;
  strength?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const springConf = { stiffness: 200, damping: 22, mass: 0.4 };
  const smx = useSpring(mx, springConf);
  const smy = useSpring(my, springConf);
  const rotateX = useTransform(smy, [0, 1], [strength, -strength]);
  const rotateY = useTransform(smx, [0, 1], [-strength, strength]);
  const glowX = useTransform(smx, [0, 1], ["0%", "100%"]);
  const glowY = useTransform(smy, [0, 1], ["0%", "100%"]);
  const glowBackground = useMotionTemplate`radial-gradient(280px circle at ${glowX} ${glowY}, rgba(16,185,129,0.16), transparent 70%)`;

  function handleMove(e: React.PointerEvent) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width);
    my.set((e.clientY - rect.top) / rect.height);
  }
  function handleLeave() {
    mx.set(0.5);
    my.set(0.5);
    setHovered(false);
  }

  return (
    <motion.div
      ref={ref}
      onPointerMove={handleMove}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={handleLeave}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      className={cn("relative", className)}
    >
      {glow && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -inset-px rounded-[inherit] transition-opacity duration-300"
          style={{ background: glowBackground, opacity: hovered ? 1 : 0 }}
        />
      )}
      {children}
    </motion.div>
  );
}
