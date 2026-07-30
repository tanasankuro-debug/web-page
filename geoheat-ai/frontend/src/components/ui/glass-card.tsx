import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import type { ComponentProps } from "react";

export function GlassCard({ className, ...props }: ComponentProps<typeof Card>) {
  return (
    <Card
      className={cn(
        "glass rounded-3xl transition-all duration-200 hover:border-white/[0.14] hover:shadow-[0_12px_40px_-8px_rgba(16,185,129,0.15)]",
        className,
      )}
      {...props}
    />
  );
}
