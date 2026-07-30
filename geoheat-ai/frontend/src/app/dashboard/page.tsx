import Link from "next/link";
import { FolderKanban, Plus, Thermometer, FolderPlus } from "lucide-react";
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

export default async function DashboardPage() {
  const supabase = await createClient();

  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5);

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

      <GlassCard className="p-6">
        <CardHeader className="p-0">
          <CardTitle className="text-base font-semibold text-muted-foreground">
            Quick Action
          </CardTitle>
        </CardHeader>
        <CardContent className="mt-4 grid gap-3 p-0 sm:grid-cols-2">
          <Button
            variant="outline"
            className="h-auto flex-col gap-2 rounded-2xl py-6"
            render={<Link href="/dashboard/projects/new" />}
            nativeButton={false}
          >
            <Plus className="size-5" />
            New Project
          </Button>
          <Button
            variant="outline"
            className="h-auto flex-col gap-2 rounded-2xl py-6"
            render={<Link href="/dashboard/projects" />}
            nativeButton={false}
          >
            <FolderKanban className="size-5" />
            My Projects
          </Button>
        </CardContent>
      </GlassCard>

      <GlassCard className="p-6">
        <CardHeader className="p-0">
          <CardTitle className="text-base font-semibold text-muted-foreground">
            Recent Projects
          </CardTitle>
        </CardHeader>
        <CardContent className="mt-4 divide-y divide-white/10 p-0">
          {projects && projects.length > 0 ? (
            projects.map((project) => (
              <Link
                key={project.id}
                href={`/dashboard/projects/${project.id}`}
                className="flex items-center justify-between py-3 first:pt-0 last:pb-0 hover:opacity-80"
              >
                <div className="flex items-center gap-2">
                  <div>
                    <div className="font-medium">{project.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(project.created_at).toLocaleDateString("th-TH")}
                    </div>
                  </div>
                  {project.is_demo && <DemoBadge />}
                </div>
                <Badge variant="secondary" className="rounded-full">
                  {project.status}
                </Badge>
              </Link>
            ))
          ) : (
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
          )}
        </CardContent>
      </GlassCard>
    </div>
  );
}
