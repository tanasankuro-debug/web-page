import Link from "next/link";
import { Camera, Sprout, Map, Thermometer } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScoreCircle } from "@/components/ui/score-circle";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Mock data — replace with /ai/result and /green-score/calculate once the
// FastAPI backend + Supabase project are wired up (see API_SPECIFICATION doc).
const heatStatus = {
  temperature: 39,
  level: "สูง" as const,
};

const greenScore = 62;

const quickActions = [
  { href: "/dashboard/scanner", label: "Scan New Area", icon: Camera },
  { href: "/dashboard/garden", label: "Design Garden", icon: Sprout },
  { href: "/dashboard/heat-map", label: "View Heat Map", icon: Map },
];

const recentProjects = [
  { id: "1", name: "สวนหลังบ้าน", date: "2026-07-28", score: 82 },
  { id: "2", name: "ระเบียงคอนโด", date: "2026-07-20", score: 55 },
  { id: "3", name: "ลานหน้าบ้าน", date: "2026-07-10", score: 40 },
];

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          ภาพรวมพื้นที่และคะแนนความเป็นมิตรต่อสิ่งแวดล้อมของคุณ
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <GlassCard className="p-6">
          <CardHeader className="p-0">
            <CardTitle className="flex items-center gap-2 text-base font-semibold text-muted-foreground">
              <Thermometer className="size-4 text-heat-orange" />
              Current Heat Status
            </CardTitle>
          </CardHeader>
          <CardContent className="mt-4 flex items-end justify-between p-0">
            <div>
              <div className="text-5xl font-extrabold text-heat-orange">
                {heatStatus.temperature}°C
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                พื้นที่ของคุณ
              </p>
            </div>
            <Badge className="rounded-full bg-heat-orange/15 text-heat-orange hover:bg-heat-orange/15">
              Heat Level: {heatStatus.level}
            </Badge>
          </CardContent>
        </GlassCard>

        <GlassCard className="p-6">
          <CardHeader className="p-0">
            <CardTitle className="text-base font-semibold text-muted-foreground">
              Green Score
            </CardTitle>
          </CardHeader>
          <CardContent className="mt-4 flex items-center gap-6 p-0">
            <ScoreCircle score={greenScore} label="/ 100" />
            <p className="text-sm text-muted-foreground">
              เพิ่มต้นไม้ใหญ่ 1 ต้น สามารถเพิ่มคะแนนได้ถึง 12 คะแนน
            </p>
          </CardContent>
        </GlassCard>
      </div>

      <GlassCard className="p-6">
        <CardHeader className="p-0">
          <CardTitle className="text-base font-semibold text-muted-foreground">
            Quick Action
          </CardTitle>
        </CardHeader>
        <CardContent className="mt-4 grid gap-3 p-0 sm:grid-cols-3">
          {quickActions.map((action) => (
            <Button
              key={action.href}
              variant="outline"
              className="h-auto flex-col gap-2 rounded-2xl py-6"
              render={<Link href={action.href} />}
            >
              <action.icon className="size-5" />
              {action.label}
            </Button>
          ))}
        </CardContent>
      </GlassCard>

      <GlassCard className="p-6">
        <CardHeader className="p-0">
          <CardTitle className="text-base font-semibold text-muted-foreground">
            Recent Projects
          </CardTitle>
        </CardHeader>
        <CardContent className="mt-4 divide-y divide-white/10 p-0">
          {recentProjects.map((project) => (
            <div
              key={project.id}
              className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
            >
              <div>
                <div className="font-medium">{project.name}</div>
                <div className="text-xs text-muted-foreground">
                  {project.date}
                </div>
              </div>
              <Badge variant="secondary" className="rounded-full">
                Score {project.score}
              </Badge>
            </div>
          ))}
        </CardContent>
      </GlassCard>
    </div>
  );
}
