import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, LineChart } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { GlassCard } from "@/components/ui/glass-card";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScoreCircle } from "@/components/ui/score-circle";
import { AnimatedNumber } from "@/components/ui/animated-number";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DemoBadge } from "@/components/projects/demo-badge";
import { EmptyState } from "@/components/ui/empty-state";

const HEAT_LEVEL_TH: Record<string, string> = {
  low: "ต่ำ",
  moderate: "ปานกลาง",
  high: "สูง",
  extreme: "สูงมาก",
};

interface DetectedObject {
  type: string;
  confidence: number;
}

export default async function AnalysisPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: project } = await supabase.from("projects").select("*").eq("id", id).single();
  if (!project) notFound();

  const [{ data: analyses }, { data: scores }] = await Promise.all([
    supabase
      .from("analysis_results")
      .select("*")
      .eq("project_id", id)
      .order("created_at", { ascending: false })
      .limit(1),
    supabase
      .from("green_scores")
      .select("*")
      .eq("project_id", id)
      .eq("stage", "current")
      .order("created_at", { ascending: false })
      .limit(1),
  ]);

  const analysis = analyses?.[0];
  const score = scores?.[0];

  return (
    <div className="flex flex-col gap-6">
      <Link
        href={`/dashboard/projects/${id}`}
        className="flex w-fit items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        {project.name}
      </Link>

      <div className="flex items-center gap-3">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">ผลวิเคราะห์พื้นที่</h1>
          <p className="text-sm text-muted-foreground">
            ผลจาก AI วิเคราะห์พื้นที่สีเขียว คอนกรีต และระดับความร้อน
          </p>
        </div>
        {project.is_demo && <DemoBadge />}
      </div>

      {analysis ? (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            <GlassCard className="p-6">
              <CardContent className="p-0">
                <div className="text-xs text-muted-foreground">พื้นที่ทั้งหมด</div>
                <div className="mt-1 text-2xl font-bold">
                  <AnimatedNumber value={analysis.total_area} suffix=" ตร.ม." />
                </div>
              </CardContent>
            </GlassCard>
            <GlassCard className="p-6">
              <CardContent className="p-0">
                <div className="text-xs text-muted-foreground">พื้นที่สีเขียว</div>
                <div className="mt-1 text-2xl font-bold text-primary">
                  <AnimatedNumber value={analysis.green_area} suffix=" ตร.ม." /> ({analysis.green_percentage}%)
                </div>
              </CardContent>
            </GlassCard>
            <GlassCard className="p-6">
              <CardContent className="p-0">
                <div className="text-xs text-muted-foreground">พื้นที่คอนกรีต</div>
                <div className="mt-1 text-2xl font-bold text-heat-orange">
                  <AnimatedNumber value={analysis.concrete_area} suffix=" ตร.ม." />
                </div>
              </CardContent>
            </GlassCard>
          </div>

          <GlassCard className="p-6">
            <CardHeader className="p-0">
              <CardTitle className="text-base font-semibold text-muted-foreground">
                สิ่งที่ตรวจพบ
              </CardTitle>
            </CardHeader>
            <CardContent className="mt-4 flex flex-col gap-4 p-0">
              <Badge className="w-fit rounded-full bg-heat-orange/15 text-heat-orange hover:bg-heat-orange/15">
                Heat Level: {HEAT_LEVEL_TH[analysis.heat_level] ?? analysis.heat_level}
              </Badge>
              <div className="flex flex-col gap-3">
                {(analysis.detected_objects as DetectedObject[]).map((obj, i) => (
                  <div key={i}>
                    <div className="mb-1.5 flex items-center justify-between text-sm">
                      <span className="font-medium capitalize">{obj.type}</span>
                      <span className="text-muted-foreground">{Math.round(obj.confidence * 100)}%</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
                      <div
                        className="h-full rounded-full bg-primary transition-all duration-700"
                        style={{ width: `${obj.confidence * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </GlassCard>

          {score && (
            <GlassCard className="p-6">
              <CardHeader className="p-0">
                <CardTitle className="text-base font-semibold text-muted-foreground">
                  Green Score
                </CardTitle>
              </CardHeader>
              <CardContent className="mt-4 flex items-center gap-6 p-0">
                <ScoreCircle score={Math.round(score.total_score)} label="/ 100" />
                <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-xs text-muted-foreground">
                  <div>พืชพรรณ: {score.vegetation_score}</div>
                  <div>ร่มเงา: {score.shade_score}</div>
                  <div>ลดความร้อน: {score.heat_reduction_score}</div>
                  <div>ความหลากหลาย: {score.diversity_score}</div>
                </div>
              </CardContent>
            </GlassCard>
          )}

          <Button
            className="w-fit rounded-xl"
            render={<Link href={`/dashboard/projects/${id}/garden`} />}
            nativeButton={false}
          >
            แนะนำแบบสวน
            <ArrowRight className="size-4" />
          </Button>
        </>
      ) : (
        <GlassCard className="p-6">
          <CardContent className="p-0">
            <EmptyState
              icon={LineChart}
              title="ยังไม่มีผลวิเคราะห์สำหรับโครงการนี้"
              description="เริ่มวิเคราะห์พื้นที่ที่ AI Scanner"
              action={
                <Button size="sm" className="rounded-xl" render={<Link href={`/dashboard/projects/${id}/scanner`} />} nativeButton={false}>
                  ไปที่ AI Scanner
                </Button>
              }
            />
          </CardContent>
        </GlassCard>
      )}
    </div>
  );
}
