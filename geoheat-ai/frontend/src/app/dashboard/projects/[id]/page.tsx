import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Camera, ImageIcon, LineChart, Sprout } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { GlassCard } from "@/components/ui/glass-card";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ImageUploadForm } from "@/components/projects/image-upload-form";
import { DemoBadge } from "@/components/projects/demo-badge";
import { EmptyState } from "@/components/ui/empty-state";

const BUCKET = "geoheat-storage";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: project } = await supabase.from("projects").select("*").eq("id", id).single();
  if (!project) notFound();

  const [{ data: images }, { data: analyses }, { data: scores }] = await Promise.all([
    supabase
      .from("project_images")
      .select("*")
      .eq("project_id", id)
      .order("created_at", { ascending: false }),
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

  const signedImages = await Promise.all(
    (images ?? []).map(async (img) => {
      const { data } = await supabase.storage.from(BUCKET).createSignedUrl(img.image_url, 3600);
      return { ...img, signedUrl: data?.signedUrl };
    }),
  );

  const latestAnalysis = analyses?.[0];
  const latestScore = scores?.[0];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">{project.name}</h1>
            {project.is_demo && <DemoBadge />}
          </div>
          <p className="text-sm text-muted-foreground">
            {project.description || "ไม่มีคำอธิบาย"}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            className="rounded-xl"
            render={<Link href={`/dashboard/projects/${project.id}/scanner`} />}
            nativeButton={false}
          >
            <Camera className="size-4" />
            AI Scanner
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="rounded-xl"
            render={<Link href={`/dashboard/projects/${project.id}/analysis`} />}
            nativeButton={false}
          >
            <LineChart className="size-4" />
            ผลวิเคราะห์
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="rounded-xl"
            render={<Link href={`/dashboard/projects/${project.id}/garden`} />}
            nativeButton={false}
          >
            <Sprout className="size-4" />
            แบบสวน
          </Button>
        </div>
      </div>

      <GlassCard className="p-6">
        <CardHeader className="p-0">
          <CardTitle className="text-base font-semibold text-muted-foreground">
            รูปภาพพื้นที่
          </CardTitle>
        </CardHeader>
        <CardContent className="mt-4 flex flex-col gap-4 p-0">
          {!project.is_demo && <ImageUploadForm projectId={project.id} />}
          {signedImages.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {signedImages.map(
                (img, index) =>
                  img.signedUrl && (
                    <div
                      key={img.id}
                      className="group relative aspect-square overflow-hidden rounded-xl border border-border"
                    >
                      <Image
                        src={img.signedUrl}
                        alt={project.name}
                        fill
                        className="object-cover transition-transform duration-200 group-hover:scale-105"
                        unoptimized
                        priority={index === 0}
                      />
                    </div>
                  ),
              )}
            </div>
          ) : (
            <EmptyState
              icon={ImageIcon}
              title="ยังไม่มีรูปภาพ"
              description={project.is_demo ? undefined : "อัปโหลดรูปแรกด้านบน"}
            />
          )}
        </CardContent>
      </GlassCard>

      <div className="grid gap-4 md:grid-cols-2">
        <GlassCard className="p-6">
          <CardHeader className="p-0">
            <CardTitle className="text-base font-semibold text-muted-foreground">
              ผลวิเคราะห์ล่าสุด
            </CardTitle>
          </CardHeader>
          <CardContent className="mt-4 p-0">
            {latestAnalysis ? (
              <div className="flex flex-col gap-2 text-sm">
                <div>พื้นที่ทั้งหมด: {latestAnalysis.total_area} ตร.ม.</div>
                <div>พื้นที่สีเขียว: {latestAnalysis.green_area} ตร.ม. ({latestAnalysis.green_percentage}%)</div>
                <div>พื้นที่คอนกรีต: {latestAnalysis.concrete_area} ตร.ม.</div>
                <Badge className="w-fit rounded-full bg-heat-orange/15 text-heat-orange hover:bg-heat-orange/15">
                  Heat Level: {latestAnalysis.heat_level}
                </Badge>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">ยังไม่มีผลวิเคราะห์สำหรับโครงการนี้</p>
            )}
          </CardContent>
        </GlassCard>

        <GlassCard className="p-6">
          <CardHeader className="p-0">
            <CardTitle className="text-base font-semibold text-muted-foreground">
              Green Score
            </CardTitle>
          </CardHeader>
          <CardContent className="mt-4 p-0">
            {latestScore ? (
              <div className="text-4xl font-extrabold text-primary">
                {Math.round(latestScore.total_score)}
                <span className="text-base font-normal text-muted-foreground"> / 100</span>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">ยังไม่มี Green Score สำหรับโครงการนี้</p>
            )}
          </CardContent>
        </GlassCard>
      </div>
    </div>
  );
}
