import { GlassCard } from "@/components/ui/glass-card";
import { CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-4 w-72" />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {[0, 1].map((i) => (
          <GlassCard key={i} className="p-6">
            <CardContent className="flex flex-col gap-3 p-0">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-10 w-24" />
            </CardContent>
          </GlassCard>
        ))}
      </div>

      <GlassCard className="p-6">
        <CardContent className="flex flex-col gap-3 p-0">
          <Skeleton className="h-4 w-28" />
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </CardContent>
      </GlassCard>
    </div>
  );
}
