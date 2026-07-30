import Link from "next/link";
import { FolderPlus, Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { GlassCard } from "@/components/ui/glass-card";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { DemoBadge } from "@/components/projects/demo-badge";

export default async function ProjectsPage() {
  const supabase = await createClient();
  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Projects</h1>
          <p className="text-sm text-muted-foreground">โครงการทั้งหมดของคุณ</p>
        </div>
        <Button className="rounded-xl" render={<Link href="/dashboard/projects/new" />} nativeButton={false}>
          <Plus className="size-4" />
          New Project
        </Button>
      </div>

      <GlassCard className="p-6">
        <CardHeader className="p-0">
          <CardTitle className="text-base font-semibold text-muted-foreground">
            Projects
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
                      {project.description || "ไม่มีคำอธิบาย"} ·{" "}
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
              description="สร้างโครงการแรกของคุณเพื่อเริ่มต้น"
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
