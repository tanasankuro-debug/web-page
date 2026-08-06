import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, LineChart, Ruler, Leaf, Building2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { GlassCard } from "@/components/ui/glass-card";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AnimatedNumber } from "@/components/ui/animated-number";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DemoBadge } from "@/components/projects/demo-badge";
import { EmptyState } from "@/components/ui/empty-state";
import { GreenScoreShowcase } from "@/components/dashboard/green-score-showcase";
import { Reveal } from "@/components/motion/reveal";

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

  const subScores = score
    ? [
        { label: "พืชพรรณ", value: Math.round(score.vegetation_score * 0.3), weight: 30, color: "bg-primary" },
        { label: "ร่มเงา", value: Math.round(score.shade_score * 0.25), weight: 25, color: "bg-sky-blue" },
        { label: "ลดความร้อน", value: Math.round(score.heat_reduction_score * 0.2), weight: 20, color: "bg-heat-orange" },
        { label: "ความหลากหลาย", value: Math.round(score.diversity_score * 0.15), weight: 15, color: "bg-deep-forest" },
        { label: "การดูแลรักษา", value: Math.round(score.maintenance_score * 0.1), weight: 10, color: "bg-muted-foreground" },
      ]
    : [];

  return (
    <div className="flex flex-col gap-6">
      <Link
        href={`/dashboard/projects/${id}`}
        className="flex w-fit items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        {project.name}
      </Link>

      <Reveal className="flex items-center gap-3">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">ผลวิเคราะห์พื้นที่</h1>
          <p className="text-sm text-muted-foreground">
            ผลจาก AI วิเคราะห์พื้นที่สีเขียว คอนกรีต และระดับความร้อน
          </p>
        </div>
        {project.is_demo && <DemoBadge />}
      </Reveal>

      {analysis ? (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { icon: Ruler, label: "พื้นที่ทั้งหมด", value: analysis.total_area, color: "text-foreground", bg: "bg-white/10" },
              { icon: Leaf, label: "พื้นที่สีเขียว", value: analysis.green_area, color: "text-primary", bg: "bg-primary/10", extra: ` (${analysis.green_percentage}%)` },
              { icon: Building2, label: "พื้นที่คอนกรีต", value: analysis.concrete_area, color: "text-heat-orange", bg: "bg-heat-orange/10" },
            ].map((m, i) => (
              <Reveal key={m.label} delay={i * 0.06}>
                <GlassCard interactive className="p-6">
                  <CardContent className="flex items-start gap-3 p-0">
                    <span className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${m.bg} ${m.color}`}>
                      <m.icon className="size-5" />
                    </span>
                    <div>
                      <div className="text-xs text-muted-foreground">{m.label}</div>
                      <div className={`mt-1 text-2xl font-bold ${m.color}`}>
                        <AnimatedNumber value={m.value} suffix=" ตร.ม." />
                        {m.extra}
                      </div>
                    </div>
                  </CardContent>
                </GlassCard>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.15}>
            <GlassCard interactive className="p-6">
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
                      <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
                        <div
                          className="relative h-full overflow-hidden rounded-full bg-primary transition-all duration-700"
                          style={{ width: `${obj.confidence * 100}%` }}
                        >
                          <div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                            style={{ animation: "shimmer-sweep 2.2s ease-in-out infinite", animationDelay: `${i * 0.15}s` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </GlassCard>
          </Reveal>

          {score && (
            <Reveal delay={0.2}>
              <GlassCard interactive className="p-6 sm:p-8">
                <CardHeader className="p-0">
                  <CardTitle className="text-base font-semibold text-muted-foreground">
                    Green Score
                  </CardTitle>
                </CardHeader>
                <CardContent className="mt-6 p-0">
                  <GreenScoreShowcase score={Math.round(score.total_score)} subScores={subScores} size={160} />
                </CardContent>
              </GlassCard>
            </Reveal>
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
