"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-1 items-center justify-center py-16">
      <GlassCard className="max-w-sm p-8 text-center">
        <CardContent className="flex flex-col items-center gap-3 p-0">
          <span className="flex size-12 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
            <AlertTriangle className="size-6" />
          </span>
          <p className="font-medium">เกิดข้อผิดพลาดบางอย่าง</p>
          <p className="text-sm text-muted-foreground">
            ลองใหม่อีกครั้ง หรือกลับไปที่แดชบอร์ด
          </p>
          <Button className="mt-2 rounded-xl" onClick={() => reset()}>
            ลองใหม่
          </Button>
        </CardContent>
      </GlassCard>
    </div>
  );
}
