import Link from "next/link";
import {
  Plus,
  Thermometer,
  FolderPlus,
  FolderKanban,
  Sparkles,
  Trophy,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { GlassCard } from "@/components/ui/glass-card";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScoreCircle } from "@/components/ui/score-circle";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { DemoBadge } from "@/components/projects/demo-badge";

const HEAT_LEVEL_TH: Record<string, string> = {
  low: "ต่ำ",
  moderate: "ปานกลาง",
  high: "สูง",
  extreme: "สูงมาก",
};

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
}) {
  return (
    <GlassCard className="p-5">
      <CardContent className="flex items-center gap-3 p-0">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Icon className="size-5" />
        </span>
        <div>
          <div className="text-xl font-bold">{value}</div>
          <div className="text-xs text-muted-foreground">{label}</div>
        </div>
      </CardContent>
    </GlassCard>
  );
}

export default async function DashboardPage() {
  const supabase = await createClient();

  const [{ data: userData }, { data: projects }] = await Promise.all([
    supabase.auth.getUser(),
    supabase.from("projects").select("*").order("created_at", { ascending: false }),
  ]);

  const displayName = userData?.user?.user_metadata?.full_name || userData?.user?.email || "";
  const latestProject = projects?.[0];

  const [{ data: scores }, { data: analyses }] = latestProject
    ? await Promise.all([
        supabase
          .from("green_scores")
          .select("*")
          .eq("project_id", latestProject.id)
          .eq("stage", "current")
          .order("created_at", { ascending: false })
          .limit(1),
        supabase
          .from("analysis_results")
          .select("*")
          .eq("project_id", latestProject.id)
          .order("created_at", { ascending: false })
          .limit(1),
      ])
    : [{ data: null }, { data: null }];

  const latestScore = scores?.[0];
  const latestAnalysis = analyses?.[0];
  const totalProjects = projects?.length ?? 0;
  const demoProjects = projects?.filter((p) => p.is_demo).length ?? 0;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-primary">สวัสดี</p>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight md:text-4xl">
            {displayName}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            ภาพรวมพื้นที่และคะแนนความเป็นมิตรต่อสิ่งแวดล้อมของคุณ
          </p>
        </div>
        <Button className="rounded-xl" render={<Link href="/dashboard/projects/new" />} nativeButton={false}>
          <Plus className="size-4" />
          New Project
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={FolderKanban} label="โครงการทั้งหมด" value={totalProjects} />
        <StatCard icon={Sparkles} label="โครงการตัวอย่าง" value={demoProjects} />
        <StatCard
          icon={Trophy}
          label="Green Score ล่าสุด"
          value={latestScore ? Math.round(latestScore.total_score) : "-"}
        />
        <StatCard
          icon={Thermometer}
          label="Heat Level ล่าสุด"
          value={latestAnalysis ? (HEAT_LEVEL_TH[latestAnalysis.heat_level] ?? latestAnalysis.heat_level) : "-"}
        />
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
            {latestAnalysis ? (
              <>
                <div>
                  <div className="text-5xl font-extrabold text-heat-orange">
                    {latestAnalysis.green_percentage}%
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    พื้นที่สีเขียวใน {latestProject!.name}
                  </p>
                </div>
                <Badge className="rounded-full bg-heat-orange/15 text-heat-orange hover:bg-heat-orange/15">
                  Heat Level: {HEAT_LEVEL_TH[latestAnalysis.heat_level] ?? latestAnalysis.heat_level}
                </Badge>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                ยังไม่มีข้อมูลวิเคราะห์พื้นที่ — เริ่มจากสร้างโครงการแรกของคุณ
              </p>
            )}
          </CardContent>
        </GlassCard>

        <GlassCard className="p-6">
          <CardHeader className="p-0">
            <CardTitle className="text-base font-semibold text-muted-foreground">
              Green Score
            </CardTitle>
          </CardHeader>
          <CardContent className="mt-4 flex items-center gap-6 p-0">
            {latestScore ? (
              <>
                <ScoreCircle score={Math.round(latestScore.total_score)} label="/ 100" />
                <p className="text-sm text-muted-foreground">
                  คำนวณจาก {latestProject!.name} ล่าสุด
                </p>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                ยังไม่มี Green Score — วิเคราะห์พื้นที่ก่อนเพื่อคำนวณคะแนน
              </p>
            )}
          </CardContent>
        </GlassCard>
      </div>

      <div>
        <h2 className="text-lg font-semibold">My Projects</h2>
        {projects && projects.length > 0 ? (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <Link key={project.id} href={`/dashboard/projects/${project.id}`}>
                <GlassCard className="h-full p-5">
                  <CardContent className="flex h-full flex-col gap-3 p-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="font-semibold">{project.name}</div>
                      {project.is_demo && <DemoBadge />}
                    </div>
                    <p className="line-clamp-2 flex-1 text-sm text-muted-foreground">
                      {project.description || "ไม่มีคำอธิบาย"}
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{new Date(project.created_at).toLocaleDateString("th-TH")}</span>
                      <Badge variant="secondary" className="rounded-full">
                        {project.status}
                      </Badge>
                    </div>
                  </CardContent>
                </GlassCard>
              </Link>
            ))}
          </div>
        ) : (
          <GlassCard className="mt-4 p-6">
            <CardContent className="p-0">
              <EmptyState
                icon={FolderPlus}
                title="ยังไม่มีโครงการ"
                description="เริ่มสร้างโครงการแรกของคุณได้เลย"
                action={
                  <Button size="sm" className="rounded-xl" render={<Link href="/dashboard/projects/new" />} nativeButton={false}>
                    สร้างโครงการ
                  </Button>
                }
              />
            </CardContent>
          </GlassCard>
        )}
      </div>
    </div>
  );
}
