import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import type { ComponentProps } from "react";

export function GlassCard({ className, ...props }: ComponentProps<typeof Card>) {
  return (
    <Card
      className={cn(
        "glass rounded-3xl shadow-[0_8px_40px_-12px_rgba(0,0,0,0.4)]",
        className,
      )}
      {...props}
    />
  );
}
