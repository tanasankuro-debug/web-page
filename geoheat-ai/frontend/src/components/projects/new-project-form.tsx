"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { apiPost } from "@/lib/api";
import { GlassCard } from "@/components/ui/glass-card";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
        <CardTitle className="text-xl font-bold">สร้างโครงการใหม่</CardTitle>
      </CardHeader>
      <CardContent className="mt-6 p-0">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid gap-1.5">
            <Label htmlFor="name">ชื่อโครงการ</Label>
            <Input
              id="name"
              placeholder="เช่น สวนหลังบ้าน"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="description">คำอธิบาย (ไม่บังคับ)</Label>
            <Input
              id="description"
              placeholder="เช่น พื้นที่คอนกรีต 20 ตร.ม. ด้านหลังบ้าน"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <Button type="submit" className="mt-2 rounded-xl" disabled={loading}>
            {loading ? "กำลังสร้าง..." : "สร้างโครงการ"}
          </Button>
        </form>
      </CardContent>
    </GlassCard>
  );
}
