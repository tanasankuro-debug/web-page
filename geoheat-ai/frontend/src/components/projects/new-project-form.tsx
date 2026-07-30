"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { apiPost } from "@/lib/api";
import { GlassCard } from "@/components/ui/glass-card";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FloatingInput } from "@/components/ui/floating-input";
import { Button } from "@/components/ui/button";

interface ProjectResponse {
  id: string;
}

export function NewProjectForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const project = await apiPost<ProjectResponse>("/projects", { name, description });
      toast.success("สร้างโครงการสำเร็จ");
      router.push(`/dashboard/projects/${project.id}`);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "สร้างโครงการไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  }

  return (
    <GlassCard className="p-6">
      <CardHeader className="p-0">
        <CardTitle className="text-2xl font-extrabold tracking-tight">สร้างโครงการใหม่</CardTitle>
      </CardHeader>
      <CardContent className="mt-6 p-0">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <FloatingInput
            id="name"
            label="ชื่อโครงการ"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <FloatingInput
            id="description"
            label="คำอธิบาย (ไม่บังคับ)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Button type="submit" className="mt-2 rounded-xl" disabled={loading}>
            {loading && <Loader2 className="size-4 animate-spin" />}
            {loading ? "กำลังสร้าง..." : "สร้างโครงการ"}
          </Button>
        </form>
      </CardContent>
    </GlassCard>
  );
}
