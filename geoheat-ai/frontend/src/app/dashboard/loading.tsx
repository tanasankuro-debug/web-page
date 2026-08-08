import { GlassCard } from "@/components/ui/glass-card";
import { CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-9 w-56" />
          <Skeleton className="h-4 w-72" />
        </div>
        <Skeleton className="h-8 w-32 rounded-xl" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3 lg:grid-rows-[auto_auto]">
        <GlassCard className="lg:col-span-2 lg:row-span-2 h-full p-6 sm:p-8">
          <CardHeader className="p-0">
            <Skeleton className="h-4 w-28" />
          </CardHeader>
          <CardContent className="mt-6 flex flex-col items-center gap-8 p-0 sm:flex-row sm:justify-center">
            <Skeleton className="size-[200px] shrink-0 rounded-full" />
            <div className="flex w-full max-w-xs flex-col gap-3">
              {[0, 1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-6 w-full" />
              ))}
            </div>
          </CardContent>
        </GlassCard>

        <GlassCard className="h-full p-6">
          <CardHeader className="p-0">
            <Skeleton className="h-4 w-32" />
          </CardHeader>
          <CardContent className="mt-4 flex flex-col gap-3 p-0">
            <Skeleton className="h-10 w-20" />
            <Skeleton className="h-4 w-40" />
          </CardContent>
        </GlassCard>

        <GlassCard className="h-full p-6">
          <CardContent className="grid grid-cols-2 gap-4 p-0">
            {[0, 1].map((i) => (
              <div key={i} className="flex items-center gap-2.5">
                <Skeleton className="size-9 shrink-0 rounded-xl" />
                <div className="flex flex-col gap-1.5">
                  <Skeleton className="h-5 w-8" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
            ))}
          </CardContent>
        </GlassCard>
      </div>

      <div className="flex flex-col gap-4">
        <Skeleton className="h-6 w-28" />
        <div className="-mx-1 flex gap-4 overflow-x-auto px-1 pb-3">
          {[0, 1, 2].map((i) => (
            <GlassCard key={i} className="w-72 shrink-0 p-5">
              <CardContent className="flex flex-col gap-3 p-0">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
            </GlassCard>
          ))}
        </div>
      </div>
    </div>
  );
}
