import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ImageIcon } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { GlassCard } from "@/components/ui/glass-card";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageUploadForm } from "@/components/projects/image-upload-form";
import { AnalyzeButton } from "@/components/projects/analyze-button";
import { DemoBadge } from "@/components/projects/demo-badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";

const BUCKET = "geoheat-storage";

export default async function ScannerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: project } = await supabase.from("projects").select("*").eq("id", id).single();
  if (!project) notFound();

  const [{ data: images }, { data: analyses }] = await Promise.all([
    supabase
      .from("project_images")
      .select("*")
      .eq("project_id", id)
      .order("created_at", { ascending: false }),
    supabase
      .from("analysis_results")
      .select("id")
      .eq("project_id", id)
      .order("created_at", { ascending: false })
      .limit(1),
  ]);

  const latestImage = images?.[0];
  const hasAnalysis = (analyses?.length ?? 0) > 0;
  const signedUrl = latestImage
    ? (await supabase.storage.from(BUCKET).createSignedUrl(latestImage.image_url, 3600)).data
        ?.signedUrl
    : null;

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
          <h1 className="text-2xl font-bold">AI Scanner</h1>
          <p className="text-sm text-muted-foreground">
            อัปโหลดรูปพื้นที่ แล้วให้ AI วิเคราะห์พื้นที่สีเขียวและระดับความร้อน
          </p>
        </div>
        {project.is_demo && <DemoBadge />}
      </div>

      <GlassCard className="p-6">
        <CardHeader className="p-0">
          <CardTitle className="text-base font-semibold text-muted-foreground">
            รูปพื้นที่
          </CardTitle>
        </CardHeader>
        <CardContent className="mt-4 flex flex-col gap-4 p-0">
          {project.is_demo ? (
            // Demo projects ship with curated, pre-computed results — hide the
            // upload/analyze controls so a demo run can't accidentally overwrite
            // the seeded numbers with a fresh mock analysis.
            <>
              {signedUrl && (
                <div className="relative aspect-video w-full max-w-sm overflow-hidden rounded-xl border border-white/10">
                  <Image src={signedUrl} alt={project.name} fill className="object-cover" unoptimized />
                </div>
              )}
              <p className="text-sm text-muted-foreground">
                นี่คือโครงการตัวอย่างพร้อมผลวิเคราะห์แล้ว
              </p>
              <Button
                size="sm"
                className="w-fit rounded-xl"
                render={<Link href={`/dashboard/projects/${id}/analysis`} />}
              >
                ดูผลวิเคราะห์
                <ArrowRight className="size-4" />
              </Button>
            </>
          ) : (
            <>
              <ImageUploadForm projectId={id} />

              {signedUrl && latestImage && (
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <div className="relative aspect-video w-full max-w-sm overflow-hidden rounded-xl border border-white/10">
                    <Image src={signedUrl} alt={project.name} fill className="object-cover" unoptimized />
                  </div>
                  <div className="flex flex-col items-start gap-2">
                    <AnalyzeButton projectId={id} imageId={latestImage.id} />
                    {hasAnalysis && (
                      <Link
                        href={`/dashboard/projects/${id}/analysis`}
                        className="text-xs text-muted-foreground hover:text-foreground"
                      >
                        ดูผลวิเคราะห์ล่าสุด →
                      </Link>
                    )}
                  </div>
                </div>
              )}

              {!latestImage && (
                <EmptyState
                  icon={ImageIcon}
                  title="ยังไม่มีรูปพื้นที่"
                  description="อัปโหลดรูปด้านบนเพื่อเริ่มวิเคราะห์"
                />
              )}
            </>
          )}
        </CardContent>
      </GlassCard>
    </div>
  );
}
