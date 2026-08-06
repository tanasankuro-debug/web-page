import Link from "next/link";
import {
  Plus,
  Thermometer,
  FolderPlus,
  FolderKanban,
  Sparkles,
  Trophy,
  Gauge,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { GlassCard } from "@/components/ui/glass-card";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { DemoBadge } from "@/components/projects/demo-badge";
import { GreenScoreShowcase } from "@/components/dashboard/green-score-showcase";
import { Reveal } from "@/components/motion/reveal";
import { TiltCard } from "@/components/motion/tilt-card";
import { Magnetic } from "@/components/motion/magnetic";

const HEAT_LEVEL_TH: Record<string, string> = {
  low: "ต่ำ",
  moderate: "ปานกลาง",
  high: "สูง",
  extreme: "สูงมาก",
};

function MiniStat({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
}) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Icon className="size-4" />
      </span>
      <div>
        <div className="text-lg font-bold leading-none">{value}</div>
        <div className="mt-1 text-[11px] text-muted-foreground">{label}</div>
      </div>
    </div>
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

  // Each *_score column is a raw 0-100 rating for that category; the
  // Green Score formula weights them (30/25/20/15/10) to build total_score.
  // Convert to "points earned out of this category's max" for display.
  const subScores = latestScore
    ? [
        { label: "พืชพรรณ", value: Math.round(latestScore.vegetation_score * 0.3), weight: 30, color: "bg-primary" },
        { label: "ร่มเงา", value: Math.round(latestScore.shade_score * 0.25), weight: 25, color: "bg-sky-blue" },
        { label: "ลดความร้อน", value: Math.round(latestScore.heat_reduction_score * 0.2), weight: 20, color: "bg-heat-orange" },
        { label: "ความหลากหลาย", value: Math.round(latestScore.diversity_score * 0.15), weight: 15, color: "bg-deep-forest" },
        { label: "การดูแลรักษา", value: Math.round(latestScore.maintenance_score * 0.1), weight: 10, color: "bg-muted-foreground" },
      ]
    : [];

  return (
    <div className="flex flex-col gap-6">
      <Reveal className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-primary">สวัสดี</p>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight md:text-4xl">
            {displayName}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            ภาพรวมพื้นที่และคะแนนความเป็นมิตรต่อสิ่งแวดล้อมของคุณ
          </p>
        </div>
        <Magnetic>
          <Button className="rounded-xl" render={<Link href="/dashboard/projects/new" />} nativeButton={false}>
            <Plus className="size-4" />
            New Project
          </Button>
        </Magnetic>
      </Reveal>

      {/* Bento grid — the heart of the dashboard */}
      <div className="grid gap-4 lg:grid-cols-3 lg:grid-rows-[auto_auto]">
        <Reveal className="lg:col-span-2 lg:row-span-2">
          <GlassCard interactive className="h-full p-6 sm:p-8">
            <CardHeader className="p-0">
              <CardTitle className="flex items-center gap-2 text-base font-semibold text-muted-foreground">
                <Trophy className="size-4 text-primary" />
                Green Score
              </CardTitle>
            </CardHeader>
            <CardContent className="mt-6 p-0">
              {latestScore ? (
                <GreenScoreShowcase score={Math.round(latestScore.total_score)} subScores={subScores} />
              ) : (
                <EmptyState
                  icon={Gauge}
                  title="ยังไม่มี Green Score"
                  description="วิเคราะห์พื้นที่ก่อนเพื่อคำนวณคะแนน"
                />
              )}
            </CardContent>
          </GlassCard>
        </Reveal>

        <Reveal delay={0.08}>
          <GlassCard interactive className="h-full p-6">
            <CardHeader className="p-0">
              <CardTitle className="flex items-center gap-2 text-base font-semibold text-muted-foreground">
                <Thermometer className="size-4 text-heat-orange" />
                Current Heat Status
              </CardTitle>
            </CardHeader>
            <CardContent className="mt-4 p-0">
              {latestAnalysis ? (
                <>
                  <div className="text-4xl font-extrabold text-heat-orange">
                    {latestAnalysis.green_percentage}%
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    พื้นที่สีเขียวใน {latestProject!.name}
                  </p>
                  <Badge className="mt-3 rounded-full bg-heat-orange/15 text-heat-orange hover:bg-heat-orange/15">
                    Heat Level: {HEAT_LEVEL_TH[latestAnalysis.heat_level] ?? latestAnalysis.heat_level}
                  </Badge>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">
                  ยังไม่มีข้อมูลวิเคราะห์พื้นที่
                </p>
              )}
            </CardContent>
          </GlassCard>
        </Reveal>

        <Reveal delay={0.14}>
          <GlassCard interactive className="h-full p-6">
            <CardContent className="grid grid-cols-2 gap-4 p-0">
              <MiniStat icon={FolderKanban} label="โครงการทั้งหมด" value={totalProjects} />
              <MiniStat icon={Sparkles} label="โครงการตัวอย่าง" value={demoProjects} />
            </CardContent>
          </GlassCard>
        </Reveal>
      </div>

      {/* Project list — horizontally scrollable card row */}
      <Reveal delay={0.2}>
        <h2 className="text-lg font-semibold">My Projects</h2>
        {projects && projects.length > 0 ? (
          <div className="mt-4 -mx-1 flex snap-x gap-4 overflow-x-auto px-1 pb-3">
            {projects.map((project) => (
              <Link
                key={project.id}
                href={`/dashboard/projects/${project.id}`}
                className="w-72 shrink-0 snap-start"
              >
                <TiltCard strength={4}>
                  <GlassCard interactive className="h-full p-5">
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
                </TiltCard>
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
      </Reveal>
    </div>
  );
}
