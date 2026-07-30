import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Sprout } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { GardenStyleSelector } from "@/components/projects/garden-style-selector";
import { GardenDesignResult } from "@/components/projects/garden-design-result";
import { DemoBadge } from "@/components/projects/demo-badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";

const BUCKET = "geoheat-storage";

export default async function GardenPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: project } = await supabase.from("projects").select("*").eq("id", id).single();
  if (!project) notFound();

  const [{ data: analyses }, { data: images }, { data: designs }] = await Promise.all([
    supabase
      .from("analysis_results")
      .select("*")
      .eq("project_id", id)
      .order("created_at", { ascending: false })
      .limit(1),
    supabase
      .from("project_images")
      .select("*")
      .eq("project_id", id)
      .order("created_at", { ascending: false })
      .limit(1),
    supabase
      .from("garden_designs")
      .select("*, recommendations(plants)")
      .eq("project_id", id)
      .order("created_at", { ascending: false })
      .limit(1),
  ]);

  const latestAnalysis = analyses?.[0];
  const latestImage = images?.[0];
  const existingDesign = designs?.[0];

  const beforeImageUrl = latestImage
    ? (await supabase.storage.from(BUCKET).createSignedUrl(latestImage.image_url, 3600)).data
        ?.signedUrl ?? null
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
          <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">แนะนำแบบสวน</h1>
          <p className="text-sm text-muted-foreground">
            {existingDesign
              ? "แบบสวนที่แนะนำสำหรับโครงการนี้"
              : "เลือกสไตล์ที่ต้องการ ให้ AI แนะนำต้นไม้และประเมินค่าใช้จ่าย"}
          </p>
        </div>
        {project.is_demo && <DemoBadge />}
      </div>

      {existingDesign ? (
        <GardenDesignResult
          style={existingDesign.style}
          estimatedCost={existingDesign.estimated_cost}
          coolingEffect={existingDesign.cooling_effect}
          templateAfterImage={existingDesign.template_after_image}
          beforeImageUrl={beforeImageUrl}
          plants={existingDesign.recommendations?.plants ?? []}
          description={existingDesign.description}
        />
      ) : latestAnalysis ? (
        <GardenStyleSelector
          projectId={id}
          area={latestAnalysis.total_area}
          beforeImageUrl={beforeImageUrl}
        />
      ) : (
        <EmptyState
          icon={Sprout}
          title="ยังวิเคราะห์พื้นที่ไม่เสร็จ"
          description="กรุณาวิเคราะห์พื้นที่ก่อนเพื่อรับคำแนะนำแบบสวน"
          action={
            <Button size="sm" className="rounded-xl" render={<Link href={`/dashboard/projects/${id}/scanner`} />} nativeButton={false}>
              ไปที่ AI Scanner
            </Button>
          }
        />
      )}
    </div>
  );
}
